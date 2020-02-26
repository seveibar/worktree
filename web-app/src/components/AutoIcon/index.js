import React from "react"
import * as Icons from "@material-ui/icons"
import * as colors from "@material-ui/core/colors"

const colorKeys = Object.keys(colors)

const iconIds = Object.keys(Icons)
const hashCode = s => {
  const v = s
    .split("")
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  return v * Math.sign(v)
}

export const getAutoColor = s =>
  colors[colorKeys[hashCode(s) % colorKeys.length]]

const SEED = Math.round(new Date().getMinutes() / 5) * 1723

export default props => {
  // TODO do an icon search
  // const Icon = Icons["Help"]
  const Icon = props.name
    ? Icons[iconIds[(SEED + hashCode(props.name)) % iconIds.length]]
    : Icons["Help"]
  return <Icon {...props} />
}
