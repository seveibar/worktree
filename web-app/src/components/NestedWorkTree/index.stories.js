// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import NestedWorkTree from "./"

storiesOf("NestedWorkTree", module).add("Basic", () => (
  <NestedWorkTree
    nestedTree={{
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
        startTime: "2020-02-23T19:16:44.240Z",
        completeTime: "2020-02-23T19:16:44.240Z"
      },
      children: [
        {
          name: "Advanced Push Upper",
          parent: "Beginner Push Upper",
          rewards: ["Buy Dumbbells", "Buy Yoga Mat"],
          requirements: {
            "fitness_tracker.total_push_ups": {
              mustBeAnAdditional: 200
            }
          },
          state: {
            complete: false,
            progress: 100,
            startTime: "2020-02-23T19:16:44.240Z"
          }
        },
        {
          name: "Beginner Sit Ups",
          parent: "Beginner Push Upper",
          rewards: [],
          requirements: {
            "fitness_tracker.total_push_ups": {
              mustBeAnAdditional: 200
            }
          },
          state: {
            complete: false,
            progress: 50,
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
    }}
  />
))
