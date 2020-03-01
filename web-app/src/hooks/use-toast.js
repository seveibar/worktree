import { useMemo } from "react"
export default () => {
  return useMemo(
    () => ({
      success: (...args) => console.log(...args),
      info: (...args) => console.log(...args),
      error: (...args) => {
        console.error(...args)
        alert(args[0])
      }
    }),
    []
  )
}
