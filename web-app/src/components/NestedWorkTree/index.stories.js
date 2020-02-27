// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import getNestedTreePath from "../../methods/get-nested-tree-path.js"
import cloneDeep from "lodash/cloneDeep"
import setIn from "lodash/set"
import getIn from "lodash/get"

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
          mustBeAtleast: 50
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
    endpointName: "Fitness",
    description: "",
    meterKey: "fitness_tracker.total_push_ups",
    outputType: "integer",
    value: 130
  },
  "fitness_tracker.total_sit_ups": {
    name: "Total Sit Ups",
    endpointName: "Fitness",
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
      onChangeMeter={action("onChangeMeter")}
      nestedTree={exampleTree}
      meters={exampleMeters}
    />
  ))
  .add("Edit Mode", () => (
    <NestedWorkTree
      inEditMode
      onChangeFlatTree={action("onChangeFlatTree")}
      onUnlock={action("onUnlock")}
      onChangeMeter={action("onChangeMeter")}
      nestedTree={exampleTree}
      meters={exampleMeters}
    />
  ))
  .add("Controlled Edit Mode", () => {
    const [inEditMode, changeInEditMode] = useState()
    const [nestedTree, changeNestedTree] = useState(exampleTree)
    const [meters, changeMeters] = useState(exampleMeters)
    return (
      <div>
        <NestedWorkTree
          inEditMode={inEditMode}
          onChangeFlatTree={(flatTreePath, newValue) => {
            const subTreeName =
              typeof flatTreePath === "string" ? flatTreePath : flatTreePath[0]
            const nestedSubTreePath = getNestedTreePath(nestedTree, subTreeName)

            if (typeof flatTreePath === "string") {
              newValue = {
                ...getIn(nestedTree, nestedSubTreePath),
                ...newValue
              }
            }
            changeNestedTree(
              setIn(
                cloneDeep(nestedTree),
                typeof flatTreePath === "string"
                  ? nestedSubTreePath
                  : nestedSubTreePath.concat(flatTreePath.slice(1)),
                newValue
              )
            )
          }}
          onChangeMeter={meter => {
            changeMeters({
              ...meters,
              [meter.meterKey]: {
                ...(meters[meter.meterKey] || {}),
                ...meter
              }
            })
          }}
          onUnlockTree={treeName => {
            const nestedSubTreePath = getNestedTreePath(nestedTree, treeName)
            changeNestedTree(
              setIn(
                cloneDeep(nestedTree),
                [...nestedSubTreePath, "state", "complete"],
                true
              )
            )
          }}
          onDeleteTree={treeName => {
            const nestedSubTreePath = getNestedTreePath(nestedTree, treeName)
            const { parent: parentName } = getIn(nestedTree, nestedSubTreePath)
            const nestedSubTreeParentPath = getNestedTreePath(
              nestedTree,
              parentName
            )
            const parent = getIn(nestedTree, nestedSubTreeParentPath)

            changeNestedTree(
              setIn(
                cloneDeep(nestedTree),
                [...nestedSubTreeParentPath, "children"],
                parent.children.filter(c => c.name !== treeName)
              )
            )
          }}
          onUnlock={action("onUnlock")}
          nestedTree={nestedTree}
          meters={meters}
        />
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            textAlign: "center",
            padding: 16,
            cursor: "pointer",
            color: "#fff",
            backgroundColor: "#000"
          }}
          onClick={() => changeInEditMode(!inEditMode)}
        >
          Toggle Edit Mode
        </div>
      </div>
    )
  })
