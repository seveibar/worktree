import React, { useRef, useState, useEffect } from "react"
import { useWindowSize } from "react-hooks-window-size"
import { createPortal } from "react-dom"
import { styled } from "@material-ui/core/styles"
import AutoIcon from "../AutoIcon"
import * as colors from "@material-ui/core/colors"
import Color from "color"

const WIDTH = 320
const HEIGHT = 300

const TrackingContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: "110%"
})

const Container = styled("div")({
  position: "absolute",
  transition: "opacity 60ms ease, transform 120ms ease",
  height: HEIGHT,
  width: WIDTH,
  backgroundColor: "#000",
  zIndex: 10,
  boxShadow: "0px 3px 5px rgba(0,0,0,0.3)"
})

const Title = styled("div")({
  color: "#fff",
  display: "flex",
  boxShadow: "0px 2px 3px rgba(0,0,0,0.1)",
  "& .icon-container": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 50
  },
  "& .icon": {
    width: 32,
    height: 32
  },
  "& .text": {
    fontSize: 22,
    fontWeight: 700,
    textShadow: "0px 2px 3px rgba(0,0,0,0.1)",
    flexGrow: 1,
    padding: 12
  }
})

export default ({ open, fullyOpen, name }) => {
  const trackingElmRef = useRef()
  const windowSize = useWindowSize()
  const color = colors.blue

  const [position, changePosition] = useState({})

  useEffect(() => {
    if (!trackingElmRef.current) return
    let { x: tx, y: ty } = trackingElmRef.current.getBoundingClientRect()
    if (tx > (windowSize.width * 3) / 4) {
      tx -= 145 + WIDTH
    }
    // TODO possibly add in window.pageX and window.pageY
    changePosition({
      left: Math.min(Math.max(15, tx), windowSize.width - WIDTH - 40),
      top: Math.max(ty - HEIGHT + 50, 10)
    })
  }, [windowSize.width, windowSize.height, trackingElmRef.current, open])

  const portaledElm = createPortal(
    <Container
      style={{
        opacity: open ? 1 : 0,
        transform: open ? "scale(1,1)" : "scale(0.9, 0.9)",
        pointerEvents: "none",
        backgroundColor: Color(color[800])
          .alpha(0.98)
          .string(),
        ...position
      }}
    >
      <Title>
        <div className="icon-container" style={{ backgroundColor: color[500] }}>
          <AutoIcon name={name} className="icon" />
        </div>
        <div style={{ backgroundColor: color[400] }} className="text">
          {name}
        </div>
      </Title>
    </Container>,
    window.document.body
  )

  return (
    <TrackingContainer ref={trackingElmRef}>{portaledElm}</TrackingContainer>
  )
}
