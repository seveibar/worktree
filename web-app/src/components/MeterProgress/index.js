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

export default () => {
  return (
    <Container>
      <IconContainer>
        <AutoIcon className="icon" name="8" />
      </IconContainer>
      <RightOfIconContainer>
        <TopContent>
          <MetricName>Push Ups</MetricName>
          <ProgressText>100 of 100</ProgressText>
          <div style={{ width: 32, height: 18 }}>
            <Checkbox
              style={{ color: "#fff", marginTop: -8, width: 18, height: 18 }}
              // checked={false}
              checked
            />
          </div>
        </TopContent>
        <ProgressBar>
          <div className="topbar" style={{ width: `${100}%` }} />
          <div className="bottombar" />
        </ProgressBar>
      </RightOfIconContainer>
    </Container>
  )
}
