// @flow

import React, { useState } from "react"
import { useInterval } from "react-use"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TreeSquare from "./"

storiesOf("TreeSquare", module)
  .add("Basic", () => (
    <TreeSquare
      name="First Tree"
      meters={{
        somemeter: {
          name: "Some Meter",
          description: "",
          meterKey: "somemeter",
          outputType: "integer",
          value: 30
        }
      }}
      requirements={{
        somemeter: {
          mustIncreaseBy: 50
        }
      }}
      state={{}}
    />
  ))
  .add("Toggle Complete", () => {
    const [ticks, changeTicks] = useState(0)
    useInterval(() => changeTicks(ticks + 1), 1000)
    if (ticks % 3 === 2) return null
    return (
      <div style={{ padding: 100 }}>
        <TreeSquare
          name="First Tree"
          key={Math.floor(ticks / 3)}
          complete={ticks % 3 === 1}
          meters={{
            somemeter: {
              name: "Some Meter",
              description: "",
              meterKey: "somemeter",
              outputType: "integer",
              value: 30
            }
          }}
          requirements={{
            somemeter: {
              mustIncreaseBy: 50
            }
          }}
          state={{}}
        />
      </div>
    )
  })
