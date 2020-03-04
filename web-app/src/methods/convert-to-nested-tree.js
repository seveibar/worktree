const getRootTree = flatTree => {
  return Object.values(flatTree).find(t => !t.parent)
}
const convertToNestedTree = (flatTree, rootTreeName) => {
  if (!rootTreeName) rootTreeName = getRootTree(flatTree).name
  return {
    ...flatTree[rootTreeName],
    children: Object.values(flatTree)
      .filter(t => t.parent === rootTreeName && t.parent !== undefined)
      .map(t => convertToNestedTree(flatTree, t.name))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }
}
export default convertToNestedTree
