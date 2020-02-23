# Building Automated Meters

> Hey, you know we already built a bunch of automated meters for you? Most people that use work tree don't build an automated meter at all! [Check out the automated meters here!](#).

An automated meter takes an input of parameters and outputs an array of meters. If the input isn't provided, it outputs a JSON object describing how to use the meter.

## Outputting Instructions

If a GET request is sent and has the `Accept: application/json` header, output the following templated JSON object. _Note, you'll need to remove the comments before using._

```javascript
{
  // REQUIRED

  "name": "My Custom Github Meter",

  // description can be written in markdown
  "description": "This meter uses the github api to...",

  "parameters": [
    {
      "name": "Github API Key",
      "description": "Your personal github api key, you can get it by...",

      // optional: key name in the input json object, by default uses "name"
      "keyName": "githubAPIKey",
      // optional: Is it required? defaults to false
      "required": false,
      // optional: Is it secret? Should the user be able to read it after submitting it? defaults to false
      "secret": true
    }
  ],

  "meters": [
    {
      "name": "Stars on Projects",
      "keyName": "project_stars",
      "description": "Number of stars on all your projects.",
      "outputType": "integer"
    }
  ],

  // OPTIONAL
  sourceCodeUrl: "https://github.com/myname/mymeter"
}
```

If the request does not have `Accept: application/json`, you're welcome to display a web page documenting your meter in html, or redirect to github!

## Outputting Meters

When the endpoint receives a POST request with JSON object in the body, it should respond with meters. The example below should illustrate what this looks like:

```javascript
// INPUT
{
  "githubAPIKey": "my_api_key"
}
```

```javascript
// OUTPUT
{
  "project_stars": 151
}
```

## Outputting Dynamic Meters

Let's say you want to output meters that can't be predefined, e.g. you want want to output a meter for every project a user has github. No problem! Add the new meters to your output object with some additional information.

```javascript
// OUTPUT WITH DYNAMIC METERS
{
  "project_stars": 151,
  "project1_stars": {
    "name": "Project 1 Stars",
    "value": 100,
    "outputType": "integer",
    "description": "Stars from project 1..."
  },
  "project2_stars": {
    "name": "Project 2 Stars",
    "value": 51,
    "outputType": "integer",
    "description": "Stars from project 2..."
  }
}
```

## Meter Output Types

| Data Type | Description                |
| --------- | -------------------------- |
| integer   | 1,2,3,4 etc.               |
| float     | real numbers like 1.234    |
| boolean   | true/false                 |
| percent   | A number between 0 and 100 |

## Errors

Return a 400 or 500 type status code if something goes wrong, don't forget a descriptive message!

## Testing your Meter

You can test your meter using curl! Here's a line you can use:

```bash
curl -H 'Accept: application/json' -H 'Content-Type: application/json' -d '{ "githubAPIKey": "some_key" }'
```
