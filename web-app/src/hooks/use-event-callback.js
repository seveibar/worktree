// @flow

import { useRef, useCallback, useLayoutEffect } from "react"

export default fn => {
  let ref = useRef()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args) => (0, ref.current)(...args), [])
}
