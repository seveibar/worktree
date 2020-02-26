// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import EditNumber from "./"

storiesOf("EditNumber", module).add("Basic", () => {
  const [num, changeNumber] = useState(20123)
  return (
    <div
      style={{
        width: 500,
        height: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <EditNumber onChange={changeNumber} value={num} />
    </div>
  )
})
