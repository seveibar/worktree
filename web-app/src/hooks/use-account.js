import React, { useState, useEffect } from "react"
import useAPI from "./use-api"

export default () => {
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

  return account
}
