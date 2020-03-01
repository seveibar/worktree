import React, { useState } from "react"
import useAPI from "../../hooks/use-api.js"
import useAccount from "../../hooks/use-account.js"
import useToast from "../../hooks/use-toast.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"

export default () => {
  const api = useAPI()
  const account = useAccount()
  const toast = useToast()
  const [newUsername, changeUsername] = useState("")

  return (
    <Page>
      <h1>Your Account</h1>
      <p>
        Your username is <b>{account ? account.account_name : "..."}</b>
      </p>
      <h2>Change Username</h2>
      <p>
        Look, I hate to say this, but don't get too attached to this account.
        Since{" "}
        <a href="https://github.com/seveibar/worktree/issues">
          we don't have email authentication yet
        </a>
        , you might not get to keep your username.
      </p>
      <Box display="flex" alignItems="center">
        <TextField
          value={newUsername}
          onChange={e => changeUsername(e.target.value)}
          variant="outlined"
          label="New Username"
        />
        <Box px={1}>
          <Button
            onClick={async () => {
              if (!newUsername) return
              try {
                const response = await api.patch(
                  `account?account_id=eq.${api.accountId}`,
                  { account_name: newUsername }
                )
              } catch (e) {
                toast.error("Couldn't change username (it might be taken)")
                return
              }
              account.reload()
            }}
            variant="outlined"
          >
            Change Username
          </Button>
        </Box>
      </Box>
    </Page>
  )
}
