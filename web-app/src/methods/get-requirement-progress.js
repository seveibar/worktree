export default ({ state = {}, meter, requirement }) => {
  const startValue = (state.startValues || {})[meter.meterKey] || 0
  let absoluteGoal, distanceToGoal, goalSize, progress
  if (
    meter.outputType === "integer" ||
    meter.outputType === "float" ||
    meter.outputType === "percent"
  ) {
    absoluteGoal =
      requirement.mustBeAtleast || startValue + requirement.mustIncreaseBy
    distanceToGoal = meter.value - startValue
    goalSize = absoluteGoal - startValue
    return (distanceToGoal / goalSize) * 100
  } else if (meter.outputType === "boolean") {
    return requirement.mustBe === meter.value ? 100 : 0
  }
}
