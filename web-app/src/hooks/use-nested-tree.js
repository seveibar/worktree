import React, { useState, useEffect, useMemo, useCallback } from "react"
import useAPI from "./use-api.js"
import useDBTree from "./use-db-tree"
import convertToNestedTree from "../methods/convert-to-nested-tree"
import convertToFlatTree from "../methods/convert-to-flat-tree"

export default (treePath, treeState) => {
  const { loadingDBTree, dbTree, treeDoesNotExist, changeDBTree } = useDBTree(
    treePath
  )
  const [nestedTree, changeNestedTreeState] = useState()
  const [nestedTreePath, changeNestedTreePath] = useState(treePath)
  const changeNestedTree = useCallback(
    nestedTree => {
      changeNestedTreeState(nestedTree)
      changeDBTree({ tree_def: convertToFlatTree(nestedTree) })
    },
    [changeNestedTreeState, changeDBTree]
  )
  const changeTree = useCallback(
    changes => {
      changes = { ...changes }
      if (changes.nestedTree) {
        changeNestedTreeState(changes.nestedTree)
        changes.tree_def = convertToFlatTree(changes.nestedTree)
        delete changes.nestedTree
      }
      changeDBTree(changes)
    },
    [changeDBTree, dbTree]
  )

  useEffect(() => {
    if (loadingDBTree || treeDoesNotExist) return
    // Don't reload the same tree to avoid "useless" updates
    if (nestedTree && nestedTreePath === dbTree.tree_path) return
    changeNestedTreeState(convertToNestedTree(dbTree.tree_def))
    changeNestedTreePath(treePath)
  }, [dbTree, loadingDBTree, treePath])

  console.log({
    treeDoesNotExist,
    loadingDBTree,
    nestedTree: Boolean(nestedTree)
  })

  const loadingNestedTree = !treeDoesNotExist && (loadingDBTree || !nestedTree)

  return useMemo(
    () => ({
      dbTree,
      loadingNestedTree,
      changeDBTree,
      nestedTree,
      treeDoesNotExist,
      changeTree,
      changeNestedTree
    }),
    [dbTree, nestedTree, loadingNestedTree, treeDoesNotExist]
  )
}
