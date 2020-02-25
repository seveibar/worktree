export const convertToFlatTree = (nestedTree, agg = {}) => {
  agg[nestedTree.name] = { ...nestedTree }
  delete agg[nestedTree.name].children
  for (const child of nestedTree.children || []) {
    convertToFlatTree(child, agg)
  }
  return agg
}
export default convertToFlatTree
