import React, { useState, useEffect } from "react"
import useAPI from "./use-api"

export default () => {
  const api = useAPI()
  const [tree, changeTree] = useState()

  useEffect(() => {
    if (!api.treeId) return
    async function callAPI() {
      const {
        data: [tree]
      } = await api.get(`tree?tree_id=eq.${api.treeId}`)
      changeTree(tree)
    }
    callAPI()
  }, [api.treeId])

  return tree
}
