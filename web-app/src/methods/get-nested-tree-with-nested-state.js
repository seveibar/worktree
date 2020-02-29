import { setIn } from "seamless-immutable"
import getNestedTreePath from "./get-nested-tree-path.js"

// TODO a recursive solution would be slightly faster, but it's a bit messy
// to do it with seamless
const f = (nestedTree, state) => {
  if (!nestedTree) return
  if (!state) return nestedTree
  let ret = nestedTree
  for (const treeName in state) {
    const treePath = getNestedTreePath(nestedTree, treeName)
    if (!treePath) continue
    ret = setIn(ret, treePath.concat(["state"]), state[treeName])
  }
  return ret
}

export default f
