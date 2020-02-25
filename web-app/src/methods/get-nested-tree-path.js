// Get nested tree path to sub tree
export const getNestedTreePath = (tree, name, path = []) => {
  if (tree.name === name) return path
  for (let i = 0; i < (tree.children || []).length; i++) {
    const child = tree.children[i]
    const result = getNestedTreePath(child, name, path.concat(["children", i]))
    if (result) return result
  }
  return null
}

export default getNestedTreePath
