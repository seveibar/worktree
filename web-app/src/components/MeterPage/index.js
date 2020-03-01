import React from "react"
import useAPI from "../../hooks/use-api.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"

export default () => {
  const api = useAPI()

  return (
    <Page>
      <h1>Meters</h1>
    </Page>
  )
}
