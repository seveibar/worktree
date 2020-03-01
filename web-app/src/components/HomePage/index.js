import React from "react"
import useAPI from "../../hooks/use-api.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"
import useAccount from "../../hooks/use-account.js"

export default () => {
  const api = useAPI()
  const account = useAccount()

  return (
    <Page>
      <h1>Welcome to Work Tree!</h1>
      <p>
        Work Tree is a way of understanding the work you're doing and where it's
        leading you by providing an interactive tree where items are unlocked as
        you complete work.
      </p>
      <p>
        We've already set up your account. Your username is{" "}
        <b>{account ? account.account_name : "..."}</b>
      </p>
      <p>
        Get started by{" "}
        <a href="/seveibar/getting-started">
          cloning the "Getting Started" work tree
        </a>
        .
      </p>
      <br />
      <br />
      <h2>About Work Tree</h2>
      <p>
        Work Tree is an open-source project created by{" "}
        <a href="https://twitter.com">@seveibar</a>. It was inspired by video
        games that motivate you to continue your progression with skill trees.
        Read more on the{" "}
        <a href="https://github.com/seveibar/worktree">github repository</a>.
      </p>
    </Page>
  )
}
