// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import NestedWorkTree from "./"

const exampleTree = {
  name: "Beginner Push Upper",
  description: "You can do this! Get started with...",
  rewards: ["Get Gym Membership"],
  requirements: {
    "fitness_tracker.total_push_ups": {
      mustBeAtleast: 100
    }
  },
  state: {
    complete: true,
    completeValues: {
      "fitness_tracker.total_push_ups": 100
    },
    startTime: "2020-02-23T19:16:44.240Z",
    completeTime: "2020-02-23T19:16:44.240Z"
  },
  children: [
    {
      name: "Advanced Push Upper",
      parent: "Beginner Push Upper",
      rewards: ["Buy Dumbbells", "Buy Yoga Mat"],
      description:
        "Okay, so you can do some push ups, but you have no idea what it takes to become a push up master. Show your dedication!",
      requirements: {
        "fitness_tracker.total_push_ups": {
          mustIncreaseBy: 200
        }
      },
      state: {
        complete: false,
        startValues: {
          "fitness_tracker.total_push_ups": 100
        },
        startTime: "2020-02-23T19:16:44.240Z"
      },
      children: [
        {
          name: "Push Up Master",
          parent: "Advanced Push Upper"
        }
      ]
    },
    {
      name: "Beginner Sit Ups",
      parent: "Beginner Push Upper",
      rewards: [],
      requirements: {
        "fitness_tracker.total_push_ups": {
          mustIncreaseBy: 200
        },
        "fitness_tracker.total_sit_ups": {
          mustIncreaseBy: 50
        }
      },
      state: {
        complete: false,
        startTime: "2020-02-23T19:16:44.240Z"
      },
      children: [
        {
          name: "Advanced Sit Ups",
          parent: "Beginner Sit Ups",
          rewards: []
        },
        {
          name: "Beginner Crunches",
          parent: "Beginner Sit Ups",
          rewards: []
        }
      ]
    }
  ]
}

const exampleMeters = {
  "fitness_tracker.total_push_ups": {
    name: "Total Push Ups",
    description: "",
    meterKey: "fitness_tracker.total_push_ups",
    outputType: "integer",
    value: 130
  },
  "fitness_tracker.total_sit_ups": {
    name: "Total Sit Ups",
    description: "",
    meterKey: "fitness_tracker.total_sit_ups",
    outputType: "integer",
    value: 2
  }
}

storiesOf("NestedWorkTree", module)
  .add("Normal Mode", () => (
    <NestedWorkTree
      onUnlock={action("onUnlock")}
      nestedTree={exampleTree}
      meters={exampleMeters}
    />
  ))
  .add("Edit Mode", () => (
    <NestedWorkTree
      inEditMode
      onChangeFlatTree={action("onChangeFlatTree")}
      onUnlock={action("onUnlock")}
      nestedTree={exampleTree}
      meters={exampleMeters}
    />
  ))
