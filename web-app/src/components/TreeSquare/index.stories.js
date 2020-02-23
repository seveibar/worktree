// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import TreeSquare from "./"

storiesOf("TreeSquare", module).add("Basic", () => (
  <TreeSquare name="First Tree" />
))
