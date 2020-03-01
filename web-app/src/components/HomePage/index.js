import React from "react"
import useAPI from "../../hooks/use-api.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"
import useAccount from "../../hooks/use-account.js"
import useMyTrees from "../../hooks/use-my-trees.js"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import TreeIcon from "@material-ui/icons/AccountTree"

const Welcome = ({ account }) => (
  <>
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
  </>
)

const MyTreeButton = styled(Button)({
  "& .icon": {
    marginLeft: 0,
    marginRight: 16
  },
  "& .container": {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  "& .name": {
    fontSize: 18,
    fontWeight: "bold"
  },
  "& .path": {
    fontSize: 14
  }
})

export default ({ onChangeRoute }) => {
  const api = useAPI()
  const account = useAccount()
  const { myTrees } = useMyTrees()

  return (
    <Page>
      {myTrees && myTrees.length > 0 ? (
        <>
          <h1>Your Work Trees</h1>
          {myTrees.map(t => (
            <Box display="inline-flex" margin={1} key={t.tree_path}>
              <MyTreeButton
                variant="outlined"
                onClick={() => onChangeRoute(t.tree_path)}
              >
                <TreeIcon className="icon" />
                <div className="container">
                  <div className="name">{t.tree_name}</div>
                  <div className="path">{t.tree_path}</div>
                </div>
              </MyTreeButton>
            </Box>
          ))}
        </>
      ) : (
        <Welcome account={account} />
      )}
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
