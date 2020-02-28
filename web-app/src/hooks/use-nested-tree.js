import React, { useState, useEffect, useMemo } from "react"
import useAPI from "./use-api.js"
import useDBTree from "./use-db-tree"
import convertToNestedTree from "../methods/convert-to-nested-tree"

export default (treePath, treeState) => {
  const { loadingDBTree, dbTree, treeDoesNotExist } = useDBTree(treePath)
  const [nestedTree, changeNestedTreeState] = useState()
  const changeNestedTree = useMemo(() => {}, [])

  useEffect(() => {
    if (loadingDBTree || treeDoesNotExist) return
    changeNestedTreeState(convertToNestedTree(dbTree.tree_def))
  }, [dbTree, loadingDBTree])

  return {
    dbTree,
    loadingNestedTree: !treeDoesNotExist && (loadingDBTree || !nestedTree),
    nestedTree,
    treeDoesNotExist,
    changeNestedTree
  }
}
