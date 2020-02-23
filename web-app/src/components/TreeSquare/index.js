import React from "react"
import AutoIcon from "../AutoIcon"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  width: 120,
  height: 120,
  border: `2px solid ${colors.grey[900]}`,
  borderTop: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 3px 3px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition: "transform 80ms linear",
  "&:hover": {
    transform: "scale(1.05,1.05)"
  }
})

const Title = styled("div")({
  display: "flex",
  width: "100%",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  backgroundColor: colors.grey[900],
  fontSize: 14,
  fontWeight: 500,
  paddingTop: 8,
  paddingBottom: 8
})

const StyledAutoIcon = styled(AutoIcon)({
  width: 64,
  height: 64,
  color: "#fff",
  transform: "translate(0px, 10px) scale(1.8,1.8) rotate(30deg)"
})

const IconContainer = styled("div")({
  flexGrow: 1,
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  background:
    "radial-gradient(circle, rgba(3,155,229,1) 0%, rgba(129,212,250,1) 100%)"
})

export default ({ name }) => {
  return (
    <Container>
      <Title>{name}</Title>
      <IconContainer>
        <StyledAutoIcon />
      </IconContainer>
    </Container>
  )
}
