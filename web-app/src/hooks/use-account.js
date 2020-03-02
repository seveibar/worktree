import React, { createContext, useState, useEffect, useContext } from "react"
import useAPI from "./use-api"
import useToast from "./use-toast"
import { useUpdate } from "react-use"

const AccountContext = createContext()

export const AccountProvider = ({ children }) => {
  const api = useAPI()
  const toast = useToast()
  const [account, changeAccount] = useState()

  useEffect(() => {
    if (!api.accountId) return
    if (account && api.accountId === account.account_id) return
    async function getAccount() {
      const {
        data: [account]
      } = await api.get(`account?account_id=eq.${api.accountId}`)
      if (!account) return api.unauthenticate()
      account.reload = () => changeAccount(null)
      changeAccount(account)
    }
    getAccount()
  }, [api.accountId, account])

  // Create account if it doesn't exist
  useEffect(() => {
    if (api.accountId) return
    if (window.attemptedAccountCreation) return
    window.attemptedAccountCreation = true
    async function createAccount() {
      const response = await api.post("/api/create-account")
      api.authenticate(response.data.account_id, response.data.default_api_key)
    }
    createAccount()
    return () => {}
  }, [api.accountId])

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  )
}

export default () => {
  return useContext(AccountContext)
}
