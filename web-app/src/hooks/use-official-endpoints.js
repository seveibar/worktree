// @flow

import { useState, useEffect, useMemo } from "react"
import useAPI from "./use-api.js"

export default () => {
  const api = useAPI()
  const [endpoints, changeEndpoints] = useState()

  useEffect(() => {
    if (!api.isLoggedIn) return
    async function load() {
      const res = await api.get(`endpoint?official=eq.true&public=eq.true`)
      changeEndpoints(res.data)
    }
    load()
  }, [api])

  return useMemo(() => ({ endpoints }), [endpoints])
}
