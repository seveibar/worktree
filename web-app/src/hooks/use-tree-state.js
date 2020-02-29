import React, { useState, useEffect, useCallback } from "react"
import useAPI from "./use-api"

export default treePath => {
  const api = useAPI()
  const [state, changeState] = useState()

  const changeStateAndSave = useCallback(
    newState => {
      for (let k in newState) {
        if (newState[k] === null) delete newState[k]
      }
      changeState(newState)
      async function callAPI() {
        await api.patch(
          `account_tree?account_id=eq.${api.accountId}&tree_path=eq.${treePath}`,
          {
            state: newState
          }
        )
      }
      callAPI()
    },
    [api.accountId, treePath]
  )

  useEffect(() => {
    if (!api.accountId) return
    if (!treePath) return
    if (treePath.startsWith("/")) treePath = treePath.slice(1)
    async function callAPI() {
      let { data } = await api.get(
        `account_tree?account_id=eq.${api.accountId}&tree_path=eq.${treePath}`
      )
      if (data.length === 0) {
        const { data: matchingTrees } = await api.get(
          `tree?tree_path=eq.${treePath}`
        )
        if (matchingTrees.length === 0) return
        ;({ data } = await api.post(
          "account_tree",
          {
            account_id: api.accountId,
            tree_id: matchingTrees[0].tree_id
          },
          { Prefer: "return=representation" }
        ))
      }
      changeState(data[0].state)
    }
    callAPI()
  }, [api.accountId, treePath])

  return [state, changeStateAndSave]
}
