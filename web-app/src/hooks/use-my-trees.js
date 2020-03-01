import { useState, useEffect, useMemo } from "react"
import useAPI from "./use-api.js"

export default () => {
  const api = useAPI()
  const [myTrees, changeMyTrees] = useState()

  useEffect(() => {
    if (!api.accountId) return
    async function load() {
      const response = await api.get(
        `account_tree?account_id=eq.${api.accountId}`
      )
      changeMyTrees(response.data)
    }
    load()
  }, [api.accountId])

  return useMemo(() => ({ myTrees }), [myTrees])
}
