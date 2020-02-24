import React from "react"
import { styled } from "@material-ui/core/styles"
import AutoIcon from "../AutoIcon"
import Checkbox from "@material-ui/core/Checkbox"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  color: "#fff",
  display: "flex",
  alignItems: "center"
})
const IconContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.purple[600],
  padding: 4,
  margin: 4,
  marginLeft: 0,
  marginRight: 8,
  "& .icon": {
    width: 24,
    height: 24
  },
  border: "2px solid rgba(0,0,0,0.3)"
})
const RightOfIconContainer = styled("div")({
  flexGrow: 1
})
const TopContent = styled("div")({
  display: "flex",
  alignItems: "center",
  paddingBottom: 8
})
const MetricName = styled("div")({})
const ProgressText = styled("div")({
  flexGrow: 1,
  textAlign: "right"
})
const ProgressBar = styled("div")({
  position: "relative",
  height: 4,
  "& .topbar": {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    height: 4
  },
  "& .bottombar": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    opacity: 0.5,
    height: 4
  }
})
const NoMeter = styled("div")({
  color: "#fff",
  fontWeight: "bold",
  backgroundColor: colors.red[600],
  textAlign: "center",
  width: "100%",
  padding: 8,
  marginTop: 8,
  marginBottom: 8
})

export default ({ requirement, meter, state }) => {
  if (!meter) return <NoMeter>Missing Meter!</NoMeter>
  const startValue = (state.startValues || {})[meter.meterKey] || 0
  const endValue = (state.endValues || {})[meter.meterKey] || meter.value
  let absoluteGoal, distanceToGoal, goalSize, progress
  if (
    meter.outputType === "integer" ||
    meter.outputType === "float" ||
    meter.outputType === "percent"
  ) {
    absoluteGoal =
      requirement.mustBeAtleast || startValue + requirement.mustIncreaseBy
    distanceToGoal = endValue - startValue
    goalSize = absoluteGoal - startValue
    progress = (distanceToGoal / goalSize) * 100
  } else if (meter.outputType === "boolean") {
    progress = requirement.mustBe === endValue ? 100 : 0
  }
  return (
    <Container>
      <IconContainer>
        <AutoIcon className="icon" name={meter.name} />
      </IconContainer>
      <RightOfIconContainer>
        <TopContent>
          <MetricName>{meter.name}</MetricName>
          <ProgressText>
            {meter.outputType === "boolean"
              ? ""
              : requirement.mustIncreaseBy
              ? `${Math.min(distanceToGoal, goalSize)} of ${goalSize}`
              : `${Math.min(endValue, absoluteGoal)}/${absoluteGoal}`}
          </ProgressText>
          <div style={{ width: 32, height: 18 }}>
            <Checkbox
              style={{ color: "#fff", marginTop: -8, width: 18, height: 18 }}
              checked={progress >= 100}
            />
          </div>
        </TopContent>
        <ProgressBar>
          <div
            className="topbar"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
          <div className="bottombar" />
        </ProgressBar>
      </RightOfIconContainer>
    </Container>
  )
}
