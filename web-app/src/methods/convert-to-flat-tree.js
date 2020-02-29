export const convertToFlatTree = (nestedTree, agg = {}, parent = null) => {
  agg[nestedTree.name] = { ...nestedTree }
  if (parent) agg[nestedTree.name].parent = parent
  delete agg[nestedTree.name].children
  for (const child of nestedTree.children || []) {
    convertToFlatTree(child, agg, nestedTree.name)
  }
  return agg
}
export default convertToFlatTree
