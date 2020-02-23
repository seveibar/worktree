// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import WorkTree from "./"

storiesOf("WorkTree", module).add("Basic", () => (
  <WorkTree
    nestedTree={{
      name: "",
      description: ""
    }}
  />
))
