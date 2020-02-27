import React from "react"
import * as Icons from "@material-ui/icons"
import * as colors from "@material-ui/core/colors"
import { GoMarkGithub as GithubIcon } from "react-icons/go"
import { FaTwitter as TwitterIcon } from "react-icons/fa"

const colorKeys = Object.keys(colors)

const iconIds = Object.keys(Icons)
const hashCode = s => {
  const v = (s || "")
    .split("")
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
  return v * Math.sign(v)
}

export const getAutoColor = s =>
  colors[colorKeys[hashCode(s) % colorKeys.length]]

export default props => {
  // TODO do an icon search
  // const Icon = Icons["Help"]
  const n = (props.name || "").toLowerCase()
  switch (n) {
    case "github":
      return <GithubIcon {...props} />
    case "twitter":
      return <TwitterIcon {...props} />
  }

  const Icon = n ? Icons[iconIds[hashCode(n) % iconIds.length]] : Icons["Help"]
  return <Icon {...props} />
}
