export default flatTree => {
  flatTree = { ...flatTree }
  for (const key in flatTree) {
    delete flatTree[key].state
  }
  return flatTree
}
