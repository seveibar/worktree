// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import Page from "./"

storiesOf("Page", module).add("Basic", () => (
  <Page>
    <h1>Configure Your Account</h1>
    <p>Some instructions for configuration...</p>
  </Page>
))
