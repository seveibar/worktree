import React, { useRef, useState, useEffect } from "react"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import Add from "@material-ui/icons/Add"
import AutoIcon, { getAutoColor } from "../AutoIcon"

const Container = styled("div")(({ baseColor }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center"
}))

const PlusHover = styled("div")(({ baseColor, open }) => ({
  color: "#fff",
  padding: 4,
  height: 32,
  width: 32,
  // marginLeft: open ? -40 : 0,
  transform: open ? "translate(8px, 4px) rotate(-45deg)" : "none",
  transition: "transform 120ms, background-color 120ms",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "& .icon": {
    transition: "transform 500ms ease, margin-right 120ms, margin-bottom 120ms",
    // marginRight: open ? 12 : 0,
    // marginBottom: open ? 12 : 0,
    transform: open ? "rotate(-135deg)" : "none"
  },
  backgroundColor: open ? baseColor[500] : baseColor[600]
}))

const Menu = styled("div")(({ baseColor, open }) => ({
  position: "absolute",
  pointerEvents: open ? "auto" : "none",
  left: 0,
  // top: open ? 40 : 0,
  top: 24,
  width: 280,
  opacity: open ? 1 : 0,
  transition: "opacity 120ms",
  height: 200,
  backgroundColor: baseColor[600],
  padding: 16,
  paddingTop: 40,
  flexWrap: "wrap",
  boxShadow: open ? "0px 3px 5px rgba(0,0,0,0.3)" : "none",
  overflowY: "auto"
}))

const TopCover = styled("div")(({ baseColor, open }) => ({
  position: "absolute",
  left: 0,
  top: 34,
  height: 20,
  pointerEvents: "none",
  transition: "opacity 120ms",
  opacity: open ? 1 : 0,
  boxShadow: `0px 3px 1px ${baseColor[700]}`,
  width: 296,
  backgroundColor: baseColor[500],
  "& .cover1": {
    position: "absolute",
    left: 0,
    top: -10,
    backgroundColor: baseColor[500],
    width: 16,
    height: 16
  },
  "& .cover2": {
    position: "absolute",
    left: 40,
    top: -10,
    backgroundColor: baseColor[500],
    width: 296 - 40,
    height: 12
  }
}))

const MenuItem = styled("div")(({ baseColor, color }) => ({
  color: "#fff",
  display: "flex",
  fontSize: 14,
  margin: 8,
  padding: 8,
  backgroundColor: color[800],
  alignItems: "center",
  "& .icon": {
    marginRight: 8
  },
  border: "2px solid rgba(0,0,0,0.5)",
  transition: "transform 80ms",
  "&:hover": {
    transform: "scale(1.05, 1.05)"
  },
  cursor: "pointer"
}))

export default ({ baseColor = colors.blue }) => {
  const [mouseOverNow, changeMouseOverNow] = useState(true)
  const [mouseOver, changeMouseOver] = useState(true)

  const meterCategories = [
    "Github",
    "Fitness",
    "Custom Github Meter",
    "Twitter",
    "Facebook",
    "Custom Fitness Meter"
  ]

  useEffect(() => {
    if (mouseOverNow) {
      changeMouseOver(true)
      return
    }
    const timeout = setTimeout(() => {
      changeMouseOver(mouseOverNow)
    }, 250)
    return () => clearTimeout(timeout)
  }, [mouseOverNow])

  return (
    <Container
      onMouseEnter={() => changeMouseOverNow(true)}
      onMouseLeave={() => changeMouseOverNow(false)}
    >
      <Menu baseColor={baseColor} open={mouseOver}>
        {meterCategories.map(category => (
          <MenuItem
            key={category}
            color={getAutoColor(category)}
            baseColor={baseColor}
          >
            <AutoIcon className="icon" name={category} />
            <div className="text">{category}</div>
          </MenuItem>
        ))}
      </Menu>
      <PlusHover baseColor={baseColor} open={mouseOver}>
        <Add className="icon" />
      </PlusHover>
      <TopCover baseColor={baseColor} open={mouseOver}>
        <div className="cover1" />
        <div className="cover2" />
      </TopCover>
    </Container>
  )
}
