# Data Structures

I think it's helpful to have a central reference for different data structures within a project, as well as some examples. I've included some common data structures in the project here. This document can serve as an example-driven specification for them.

## Work Tree Data Type

The work tree can be represented as a `nestedTree` or a `flatTree`. Both of these data structures are useful depending on what type of operation you're doing. They can be converted `1:1` using `src/methods/convert-tree-to-nested` or `src/methods/convert-tree-to-flat`.

When we store trees, we always store them flat. We do this because it's much easier to update them when meter data comes in.

Here's an example `flatTree`:

```javascript
{
  "Beginner Push Upper": {
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
        "mustBeAnAdditional": 200
      }
    },
    "state": {
      "complete": false,
      "startTime": "2020-02-23T19:16:44.240Z"
    }
  }
}
```

> Notice how there's some redundancy in the tree? That's okay! We use redundancy to make querying easier and access more predictable at the expense of harder rename operations :)

> Most of the time, if a string is displayed it can probably be written in markdown
