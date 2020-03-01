// @flow

import { useState, useEffect, useMemo } from "react"
import useAPI from "./use-api.js"

export default endpointNames => {
  const api = useAPI()
  const [endpoints, changeEndpoints] = useState()

  useEffect(() => {
    if (!api.isLoggedIn) return
    async function load() {
      const res = await api.get(
        `endpoint?endpoint_name=in.(${endpointNames
          .map(n => `"${n}"`)
          .join(",")})`
      )
      changeEndpoints(res.data)
    }
    load()
  }, [api, endpointNames])

  return useMemo(() => ({ endpoints }), [endpoints])
}
