// @flow weak

import { setIn, getIn } from "seamless-immutable"
import getNestedTreePath from "./get-nested-tree-path.js"

export default (nestedTree, changeNestedTree, treeState, changeTreeState) => {
  return {
    onChangeFlatTree: (flatTreePath, newValue) => {
      const subTreeName =
        typeof flatTreePath === "string" ? flatTreePath : flatTreePath[0]
      const nestedSubTreePath = getNestedTreePath(nestedTree, subTreeName)
      let newValueisSubTree = false

      if (typeof flatTreePath === "string") {
        newValueisSubTree = true
        newValue = {
          ...getIn(nestedTree, nestedSubTreePath),
          ...newValue
        }
      }

      const newNestedSubTreePath =
        typeof flatTreePath === "string"
          ? nestedSubTreePath
          : nestedSubTreePath.concat(flatTreePath.slice(1))
      const newNestedTree = setIn(nestedTree, newNestedSubTreePath, newValue)

      changeNestedTree(newNestedTree)

      // If there was a rename, update the state to reflect that
      if (newValueisSubTree) {
        changeTreeState({
          ...treeState,
          [subTreeName]: null,
          [newValue.name]: treeState[subTreeName]
        })
      }
      if (flatTreePath[1] === "name") {
        changeTreeState({
          ...treeState,
          [subTreeName]: null,
          [flatTreePath[1]]: treeState[subTreeName]
        })
      }
    },
    onDeleteTree: treeName => {
      const nestedSubTreePath = getNestedTreePath(nestedTree, treeName)
      const { parent: parentName } = getIn(nestedTree, nestedSubTreePath)
      const nestedSubTreeParentPath = getNestedTreePath(nestedTree, parentName)
      let parent = getIn(nestedTree, nestedSubTreeParentPath)
      if (nestedSubTreeParentPath.length === 0) parent = nestedTree

      changeNestedTree(
        setIn(
          nestedTree,
          [...nestedSubTreeParentPath, "children"],
          parent.children.filter(c => c.name !== treeName)
        )
      )

      const newTreeState = { ...treeState }
      delete newTreeState[treeName]
      changeTreeState(newTreeState)
    }
  }
}
