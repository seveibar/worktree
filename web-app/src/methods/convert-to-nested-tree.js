const getRootTree = flatTree => {
  return Object.values(flatTree).find(t => !t.parent)
}
const convertToNestedTree = (flatTree, rootTreeName) => {
  if (!rootTreeName) rootTreeName = getRootTree(flatTree).name
  return {
    ...flatTree[rootTreeName],
    children: Object.values(flatTree)
      .filter(t => t.parent === rootTreeName)
      .map(t => convertToNestedTree(flatTree, t.name))
  }
}
export default convertToNestedTree
