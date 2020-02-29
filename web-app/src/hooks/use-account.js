import React, { createContext, useState, useEffect, useContext } from "react"
import useAPI from "./use-api"

const AccountContext = createContext()

export const AccountProvider = ({ children }) => {
  const api = useAPI()
  const [account, changeAccount] = useState()

  useEffect(() => {
    if (!api.accountId) return
    async function getAccount() {
      const {
        data: [account]
      } = await api.get(`account?account_id=eq.${api.accountId}`)
      if (!account) api.unauthenticate()
      changeAccount(account)
    }
    getAccount()
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
