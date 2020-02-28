import React, { useState, useEffect, useMemo } from "react"
import useAPI from "./use-api"

export default treePath => {
  if (treePath.startsWith("/")) treePath = treePath.slice(1)
  const api = useAPI()
  const [loadingDBTree, changeLoadingDBTree] = useState(true)
  const [treeDoesNotExist, changeTreeDoesNotExist] = useState(false)
  const [dbTree, changeTree] = useState()

  useEffect(() => {
    async function callAPI() {
      const { data } = await api.get(
        `tree?tree_path=eq.${encodeURIComponent(treePath)}`
      )
      console.log(treePath, data)
      if (data.length === 0) {
        changeTreeDoesNotExist(true)
      } else {
        changeTree(data[0])
      }
      changeLoadingDBTree(false)
    }
    callAPI()
  }, [treePath])

  const reloadDBTree = useMemo(() => {}, [])

  return { dbTree, reloadDBTree, changeTree, loadingDBTree, treeDoesNotExist }
}
