import React from "react"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import AddBoxIcon from "@material-ui/icons/AddBox"

const Container = styled("div")({
  display: "inline-block",
  width: 50,
  height: 50,
  transition: "transform 80ms linear, color 80ms linear",
  color: colors.grey[300],
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.05,1.05)",
    color: colors.grey[500]
  }
})

export default props => {
  return (
    <Container {...props}>
      <AddBoxIcon style={{ fontSize: 50 }} />
    </Container>
  )
}
