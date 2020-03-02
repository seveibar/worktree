import { useMemo, useState, useReducer, useEffect, useCallback } from "react"
import useAPI from "./use-api"

export default ownerMeters => {
  const api = useAPI()
  const [meters, changeMeters] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {}
  )

  const onChangeMeter = useCallback(
    async meter => {
      const changes = {
        meter_name: meter.name,
        meter_key: meter.meterKey || meter.key,
        endpoint_name: meter.endpointName,
        description: meter.description,
        output_type: meter.outputType,
        output: meter.value,
        account_id: api.accountId
      }
      Object.keys(changes).forEach(
        key => changes[key] === undefined && delete changes[key]
      )
      changeMeters({ [changes.meter_key]: meter })
      const response = await api.post(
        `meter?meter_key=eq.${meter.meterKey}`,
        changes
      )
    },
    [api]
  )

  useEffect(() => {
    if (!api.accountId) return
    async function loadMeters() {
      const { data: meterAr } = await api.get("meter")
      const meterObj = {}
      for (const meter of meterAr) {
        meterObj[meter.meter_key] = {
          name: meter.meter_name,
          meterKey: meter.meter_key,
          endpointName: meter.endpoint_name,
          description: meter.description,
          outputType: meter.output_type,
          value: meter.output
        }
      }
      changeMeters(meterObj)
    }
    loadMeters()
  }, [api.accountId])

  return useMemo(
    () => ({
      meters: { ...ownerMeters, ...meters },
      onChangeMeter
    }),
    [meters, onChangeMeter, ownerMeters]
  )
}
