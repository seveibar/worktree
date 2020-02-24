// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import * as colors from "@material-ui/core/colors"

import MeterProgress from "./"

storiesOf("MeterProgress", module).add("Basic", () => (
  <div style={{ backgroundColor: colors.blue[700], padding: 40 }}>
    <MeterProgress
      meter={{
        name: "Github Project Stars",
        value: 150,
        outputType: "integer",
        description: "Stars from project 1.",
        meterKey: "github_project_stars"
      }}
      requirement={{
        mustIncreaseBy: 100
      }}
      state={{
        startValues: {
          github_project_stars: 100
        }
      }}
    />
    <MeterProgress
      meter={{
        name: "Launched New Open-Source Project",
        value: false,
        outputType: "boolean",
        description: "Did the project launch?",
        meterKey: "launched"
      }}
      requirement={{
        mustBe: true
      }}
      state={{}}
    />
  </div>
))
