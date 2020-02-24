# Data Structures

I think it's helpful to have a central reference for different data structures within a project, as well as some examples. I've included some common data structures in the project here. This document can serve as an example-driven specification for them.

## Work Tree Data Type

The work tree can be represented as a `nestedTree` or a `flatTree`. Both of these data structures are useful depending on what type of operation you're doing. They can be converted `1:1` using `src/methods/convert-tree-to-nested` or `src/methods/convert-tree-to-flat`.

When we store trees, we always store them flat. We do this because it's much easier to update them when meter data comes in.

### Flat Tree

Here's an example `flatTree`:

```javascript
{
  "Beginner Push Upper": {
    "name": "Beginner Push Upper",
    "description": "You can do this! Get started with...",
    "rewards": ["Get Gym Membership"],
    "requirements": {
      "fitness_tracker.total_push_ups": {
        "mustBeAtleast": 100
      }
    },
    "state": {
      "complete": true,
      "startTime": "2020-02-23T19:16:44.240Z",
      "completeTime": "2020-02-23T19:16:44.240Z"
    }
  },
  "Advanced Push Upper": {
    "name": "Advanced Push Upper",
    "parent": "Beginner Push Upper",
    "rewards": [
      "Buy Dumbbells",
      "Buy Yoga Mat"
    ],
    "requirements": {
      "fitness_tracker.total_push_ups": {
        "mustIncreaseBy": 200
      }
    },
    "state": {
      "complete": false,
      "progress": 50,
      "startTime": "2020-02-23T19:16:44.240Z",
      "startValues": {
        "fitness_tracker.total_push_ups": 100
      }
    }
  }
}
```

> Notice how there's some redundancy in the tree? That's okay! We use redundancy to make querying easier and access more predictable at the expense of harder rename operations :)

> Most of the time, if a string is displayed it can probably be written in markdown

### Nested Tree

The nested tree has the same data as the flat tree but nests subtrees within their parents.

```javascript
{
  "children": [
    {
      "name": "Beginner Push Upper",
      "description": "You can do this! Get started with...",
      "reward": "Get Gym Membership",
      "requirements": {
        "fitness_tracker.total_push_ups": {
          "mustBeAtleast": 100
        }
      },
      "state": {
        "complete": true,
        "startTime": "2020-02-23T19:16:44.240Z",
        "completeTime": "2020-02-23T19:16:44.240Z"
      },
      children: [
        {
          "name": "Advanced Push Upper",
          "parent": "Beginner Push Upper",
          "rewards": [
            "Buy Dumbbells",
            "Buy Yoga Mat"
          ],
          "requirements": {
            "fitness_tracker.total_push_ups": {
              "mustBeAnAdditional": 200
            }
          },
          "state": {
            "complete": false,
            "startTime": "2020-02-23T19:16:44.240Z"
          }
        }
      ]
    }
  ]
}
```

## Root Work Tree Properties

The root work tree has some additional properties.

- `name`: Name of the entire tree
- `keyName`: Optional, used to reference the work tree
- `description`: What this tree is all about.
- `createdAt`: When this tree was created
- `state.active`: Is this tree active?
- `state.complete`: Is this tree complete?

## Meter State

After a user imports a meter, we want to track how that meter has increased over time, not just it's current value. A meter's full id is `"userOrOrg"."endpoint"."keyName"`. A meter's `poiHistory` is an abbreviated history that contains the meter's value at "Points of Interest". The server will automatically group the history to save bandwidth. The `poiHistory` doesn't exceed more than 100 entries in length.

```javascript
{
  "my_name.my_github_meter.project_stars": {
    "name": "Github Project Stars",
    "value": 100,
    "outputType": "integer",
    "description": "Stars from project 1...",
    "poiHistory": [
      {
        "at": "2020-02-23T19:16:44.240Z",
        "value": 110,
        "delta": 10
      },
      {
        "at": "2020-02-22T19:16:44.240Z",
        "value": 100,
        "delta": 0
      }
    ]
  }
}
```
