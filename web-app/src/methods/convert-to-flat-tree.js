export const convertToFlatTree = (
  nestedTree,
  agg = {},
  parent = null,
  order = 0
) => {
  agg[nestedTree.name] = { ...nestedTree }
  if (parent) agg[nestedTree.name].parent = parent
  agg[nestedTree.name].order = order
  delete agg[nestedTree.name].children
  for (let i = 0; i < (nestedTree.children || []).length; i++) {
    const child = nestedTree.children[i]
    convertToFlatTree(child, agg, nestedTree.name, i)
  }
  return agg
}
export default convertToFlatTree
