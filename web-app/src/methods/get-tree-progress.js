import getRequirementProgress from "./get-requirement-progress.js"
export default (tree, meters = {}) => {
  if (tree.state && tree.state.complete) return 100
  const requirementProgresses = Object.entries(tree.requirements || []).map(
    ([meterKey, requirement]) => {
      if (!meters[meterKey]) return 0
      return getRequirementProgress({
        meter: meters[meterKey],
        requirement,
        state: tree.state
      })
    }
  )
  if (requirementProgresses.length === 0) return 100
  return (
    requirementProgresses.reduce((a, b) => a + b, 0) /
    requirementProgresses.length
  )
}
