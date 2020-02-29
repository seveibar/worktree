// @flow weak

import { setIn, getIn } from "seamless-immutable"
import getNestedTreePath from "./get-nested-tree-path.js"

export default (nestedTree, changeNestedTree) => {
  return {
    onChangeFlatTree: (flatTreePath, newValue) => {
      const subTreeName =
        typeof flatTreePath === "string" ? flatTreePath : flatTreePath[0]
      const nestedSubTreePath = getNestedTreePath(nestedTree, subTreeName)

      if (typeof flatTreePath === "string") {
        newValue = {
          ...getIn(nestedTree, nestedSubTreePath),
          ...newValue
        }
      }
      changeNestedTree(
        setIn(
          nestedTree,
          typeof flatTreePath === "string"
            ? nestedSubTreePath
            : nestedSubTreePath.concat(flatTreePath.slice(1)),
          newValue
        )
      )
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
    }
  }
}
