import React from "react"
import * as colors from "@material-ui/core/colors"
import { styled, withStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"

const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  marginTop: -120,
  flexDirection: "column"
})
const LoadingText = styled("div")({
  fontSize: 24,
  marginTop: -120,
  color: colors.grey[500]
})
const CircularProgressContainer = styled("div")({})

const StyledCircularProgress = withStyles({
  colorPrimary: {
    color: colors.grey[300]
  }
})(CircularProgress)

export default () => {
  return (
    <Container>
      <CircularProgressContainer>
        <StyledCircularProgress size={200} thickness={1} color="primary" />
      </CircularProgressContainer>
      <LoadingText>Loading</LoadingText>
    </Container>
  )
}
