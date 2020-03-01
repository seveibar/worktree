import React from "react"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles"

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    button: {
      textTransform: "none"
    }
  }
})

export default ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
