// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TreeSquareHoverBox from "./"

storiesOf("TreeSquareHoverBox", module).add("Basic", () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between"
    }}
  >
    <div
      style={{
        display: "inline-flex",
        width: 10,
        height: 10,
        backgroundColor: "#000",
        position: "relative"
      }}
    >
      <TreeSquareHoverBox
        open
        fullyOpen
        complete
        available
        inEditMode
        name="Beginner Marketing"
        description="Get started by investigating keywords. Find the ten keywords you want to target."
        rewards={[]}
        requirements={{
          "fitness_tracker.total_push_ups": {
            mustIncreaseBy: 100
          },
          "fitness_tracker.total_sit_ups": {
            mustBeAtleast: 50
          }
        }}
        meters={{
          "fitness_tracker.total_push_ups": {
            name: "Total Push Ups",
            endpointName: "Fitness Tracker",
            description: "",
            meterKey: "fitness_tracker.total_push_ups",
            outputType: "integer",
            value: 130
          },
          "fitness_tracker.total_sit_ups": {
            name: "Total Sit Ups",
            endpointName: "Fitness Tracker",
            description: "",
            meterKey: "fitness_tracker.total_sit_ups",
            outputType: "integer",
            value: 2
          },
          "fitness_tracker.total_crunches": {
            name: "Total Crunches",
            endpointName: "Fitness Tracker",
            description: "",
            meterKey: "fitness_tracker.total_sit_ups",
            outputType: "integer",
            value: 2
          },
          "github.total_project_stars": {
            name: "Total Project Stars",
            endpointName: "Github",
            description: "",
            meterKey: "fitness_tracker.total_sit_ups",
            outputType: "integer",
            value: 2
          }
        }}
        state={{}}
        progress={50}
        onChangeFlatTree={action("onChangeFlatTree")}
        onDeleteTree={action("onDeleteTree")}
      />
    </div>
    <div
      style={{
        display: "inline-flex",
        width: 10,
        height: 10,
        backgroundColor: "#000",
        position: "relative"
      }}
    >
      <TreeSquareHoverBox
        open
        fullyOpen
        complete
        available
        name="Beginner Marketing"
        description="Get started by investigating keywords. Find the ten keywords you want to target."
        rewards={[]}
        requirements={{
          "fitness_tracker.total_push_ups": {
            mustIncreaseBy: 100
          },
          "fitness_tracker.total_sit_ups": {
            mustBeAtleast: 50
          }
        }}
        meters={{
          "fitness_tracker.total_push_ups": {
            name: "Total Push Ups",
            endpointName: "Fitness Tracker",
            description: "",
            meterKey: "fitness_tracker.total_push_ups",
            outputType: "integer",
            value: 130
          },
          "fitness_tracker.total_sit_ups": {
            name: "Total Sit Ups",
            endpointName: "Fitness Tracker",
            description: "",
            meterKey: "fitness_tracker.total_sit_ups",
            outputType: "integer",
            value: 2
          }
        }}
        state={{}}
        progress={50}
        onChangeFlatTree={action("onChangeFlatTree")}
        onDeleteTree={action("onDeleteTree")}
      />
    </div>
  </div>
))
