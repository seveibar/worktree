import React, { useState, useEffect, useCallback, useMemo } from "react"
import useAPI from "./use-api"
import removeFlatTreeState from "../methods/remove-flat-tree-state.js"

export default treePath => {
  if (treePath.startsWith("/")) treePath = treePath.slice(1)
  const api = useAPI()
  const [loadingDBTree, changeLoadingDBTree] = useState(true)
  const [treeDoesNotExist, changeTreeDoesNotExist] = useState(false)
  const [dbTree, changeTree] = useState()

  useEffect(() => {
    if (!api.accountId) return
    if (!treePath) return
    changeLoadingDBTree(true)
    changeTreeDoesNotExist(false)
    async function callAPI() {
      const { data } = await api.get(
        `tree?tree_path=eq.${encodeURIComponent(treePath)}`
      )
      if (data.length === 0) {
        changeTreeDoesNotExist(true)
      } else {
        changeTree(data[0])
      }
      changeLoadingDBTree(false)
    }
    callAPI()
  }, [treePath, api.accountId])

  const changeDBTree = useCallback(
    async changes => {
      if (changes.tree_def) {
        changes.tree_def = removeFlatTreeState(changes.tree_def)
      }
      const { data } = await api.patch(
        `tree?tree_path=eq.${treePath}`,
        changes,
        {
          headers: { Prefer: "return=representation" }
        }
      )
      changeTree(data[0])
      return data[0]
    },
    [treePath]
  )

  const reloadDBTree = useCallback(() => {}, [])

  return useMemo(
    () => ({
      dbTree,
      reloadDBTree,
      changeTree,
      loadingDBTree,
      treeDoesNotExist,
      changeDBTree
    }),
    [dbTree, loadingDBTree, treeDoesNotExist]
  )
}
