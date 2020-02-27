// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { exampleTree, exampleMeters } from "../NestedWorkTree/index.stories.js"
import NestedWorkTree from "../NestedWorkTree"

import Page from "./"

storiesOf("Page", module).add("Basic", () => (
  <Page
    visibility="private"
    onChangeTitle={action("onChangeTitle")}
    onChangeId={action("onChangeId")}
    onChangeVisibility={action("onChangeVisibility")}
    title="Fitness for Beginners"
    id="fitness_for_beginners"
    userName="seveibar"
    onCreateNew={action("onCreateNew")}
    onClickEdit={action("onClickEdit")}
  >
    <div style={{ paddingTop: 20 }}>
      <NestedWorkTree
        onUnlock={action("onUnlock")}
        onChangeMeter={action("onChangeMeter")}
        nestedTree={exampleTree}
        meters={exampleMeters}
      />
    </div>
  </Page>
))
