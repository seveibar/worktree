import React, { useMemo } from "react"
import useAPI from "../../hooks/use-api.js"
import useMeters from "../../hooks/use-meters.js"
import { styled } from "@material-ui/core/styles"
import Page from "../Page"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import useEndpoints from "../../hooks/use-endpoints.js"
import useOfficialEndpoints from "../../hooks/use-official-endpoints.js"

const EndpointInfoContainer = styled("div")({
  border: "2px solid #ccc",
  padding: 32
})

const EndpointButton = styled(Button)({})

export default () => {
  const api = useAPI()
  const { meters } = useMeters()

  const endpointNames = useMemo(
    () =>
      Array.from(
        new Set(
          Object.values(meters)
            .map(m => m.endpointName)
            .filter(Boolean)
        )
      ),
    [meters]
  )
  const { endpoints = null } = useEndpoints(endpointNames)
  const { endpoints: officialEndpoints = null } = useOfficialEndpoints()

  return (
    <Page>
      <h1>Meters</h1>
      <h1>Add New Automated Meter</h1>
      <p>
        Automated meters will automatically update regularly, so you don't have
        to track the stats.
      </p>
      {officialEndpoints !== null &&
        officialEndpoints.map(officialEndpoint => (
          <EndpointButton key={officialEndpoint.endpoint_id}>
            <div className="name">{officialEndpoint.endpoint_name}</div>
          </EndpointButton>
        ))}
      <h1>My Meters</h1>
      {endpointNames.map(endpointName => (
        <EndpointInfoContainer key={endpointName}>
          <TextField variant="outlined" label="Endpoint" value={endpointName} />
          <h2>Parameters</h2>
          <h2>Values</h2>
          {Object.values(meters)
            .filter(m => m.endpointName === endpointName)
            .map(m => (
              <div key={m.meterKey}>
                <TextField
                  variant="outlined"
                  label="Meter Name"
                  value={m.name}
                />
                <TextField
                  variant="outlined"
                  label="Meter Key"
                  value={m.meterKey}
                />
                <TextField variant="outlined" label="Value" value={m.value} />
              </div>
            ))}
        </EndpointInfoContainer>
      ))}
    </Page>
  )
}
