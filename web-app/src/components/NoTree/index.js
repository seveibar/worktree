import React from "react"
import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"

const Container = styled("div")({
  fontSize: 32,
  color: colors.grey[800],
  fontWeight: "bold",
  textAlign: "center"
})

const CreateTreeButton = styled(Button)({
  backgroundColor: "#000",
  padding: 32,
  paddingTop: 16,
  paddingBottom: 16,
  margin: 64,
  fontSize: 32,
  color: "#fff",
  textTransform: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: colors.grey[600]
  }
})

export default ({ onCreateTree }) => {
  return (
    <Container>
      There's no tree here
      <div>
        <CreateTreeButton onClick={onCreateTree}>
          Create A Tree
        </CreateTreeButton>
      </div>
    </Container>
  )
}
