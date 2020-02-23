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
      reward: "Get Gym Membership",
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
            startTime: "2020-02-23T19:16:44.240Z"
          }
        }
      ]
    }}
  />
))
