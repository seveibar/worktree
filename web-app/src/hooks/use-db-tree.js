import React, { useState, useEffect, useCallback, useMemo } from "react"
import useAPI from "./use-api"

export default treePath => {
  if (treePath.startsWith("/")) treePath = treePath.slice(1)
  const api = useAPI()
  const [loadingDBTree, changeLoadingDBTree] = useState(true)
  const [treeDoesNotExist, changeTreeDoesNotExist] = useState(false)
  const [dbTree, changeTree] = useState()

  useEffect(() => {
    if (!treePath) return
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
  }, [treePath])

  const changeDBTree = useCallback(
    async changes => {
      const { data } = await api.patch(
        `tree?tree_path=eq.${treePath}`,
        changes,
        {
          headers: { Prefer: "return=representation" }
        }
      )
      changeTree(data[0])
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
