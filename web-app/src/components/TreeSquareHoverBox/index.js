import React, { useRef, useState, useEffect } from "react"
import { useWindowSize } from "react-hooks-window-size"
import { createPortal } from "react-dom"
import { styled } from "@material-ui/core/styles"
import AutoIcon from "../AutoIcon"
import * as colors from "@material-ui/core/colors"
import Color from "color"
import ReactMarkdown from "react-markdown"
import MeterProgress from "../MeterProgress"
import TrophyIcon from "@material-ui/icons/EmojiEvents"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import SmileIcon from "@material-ui/icons/EmojiEmotions"

const WIDTH = 360
const HEIGHT = 300

const TrackingContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: "110%"
})

const Container = styled("div")({
  position: "absolute",
  transition: "opacity 60ms ease, transform 120ms ease",
  minHeight: HEIGHT,
  width: WIDTH,
  backgroundColor: "#000",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
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

const DescriptionContainer = styled("div")({
  color: "#fff",
  padding: 16,
  paddingTop: 8,
  paddingBottom: 0,
  minHeight: 100
})
const Sep = styled("div")({
  display: "inline-flex",
  width: "calc(100% - 32px)",
  marginLeft: 16,
  borderBottom: "2px solid rgba(255,255,255,0.2)"
})
const RequirementsText = styled("div")({
  color: "#fff",
  marginTop: 8,
  paddingLeft: 16,
  // textTransform: "uppercase",
  fontWeight: 800,
  fontSize: 12
})
const MeterProgressContainer = styled("div")({
  padding: 8,
  paddingLeft: 32,
  paddingRight: 32
})
const RewardsContainer = styled("div")({
  padding: 8,
  paddingLeft: 32,
  paddingRight: 32
})
const Reward = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: 8,
  marginBottom: 8,
  "& .icon-container": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  "& .icon": {
    color: "#fff",
    marginRight: 8,
    opacity: 0.8,
    fontSize: 18
  },
  "& .text": {
    color: "#fff",
    fontWeight: 600
  }
})
const ActionableText = styled("div")({
  display: "flex",
  padding: 16,
  fontSize: 16,
  color: "#fff",
  fontWeight: 600,
  alignItems: "center",
  "& > *": { display: "inline" },
  marginBottom: 8,
  "& .icon": {
    marginRight: 8
  },
  "& .action": {
    marginLeft: 8,
    opacity: 0.8
  }
})

export default ({
  open,
  fullyOpen,
  complete,
  name,
  description,
  rewards = [],
  requirements = [],
  meters,
  state,
  progress
}) => {
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
        <div className="icon-container" style={{ backgroundColor: color[300] }}>
          <AutoIcon name={name} className="icon" />
        </div>
        <div style={{ backgroundColor: color[500] }} className="text">
          {name}
        </div>
      </Title>
      <DescriptionContainer>
        <ReactMarkdown
          source={
            description || "No Description! How will you know what to do?"
          }
        />
      </DescriptionContainer>
      {Object.keys(requirements).length > 0 && (
        <>
          <Sep />
          <RequirementsText>Requirements</RequirementsText>
          <MeterProgressContainer>
            {Object.entries(requirements).map(([meterKey, requirement]) => (
              <MeterProgress
                key={meterKey}
                meter={meters[meterKey]}
                requirement={requirement}
                state={state}
              />
            ))}
          </MeterProgressContainer>
        </>
      )}
      {rewards.length > 0 && (
        <>
          {/* <Sep /> */}
          <RequirementsText>Unlocks</RequirementsText>
          <RewardsContainer>
            {rewards.map(r => (
              <Reward key={r}>
                <div className="icon-container">
                  <TrophyIcon className="icon" />
                </div>
                <div className="text">{r}</div>
              </Reward>
            ))}
          </RewardsContainer>
        </>
      )}
      <div style={{ flexGrow: 1 }} />
      <Sep />
      <ActionableText>
        {complete ? (
          <>
            <SmileIcon className="icon" />
            <div>Unlocked!</div>
          </>
        ) : (
          <>
            {progress < 1 ? (
              <LockIcon className="icon" />
            ) : (
              <UnlockIcon className="icon" />
            )}
            <div>
              {progress < 1
                ? "Complete Requirements to Unlock"
                : "Ready to Unlock!"}
            </div>
            {progress >= 1 && (
              <div className="action">{"(Click and Hold)"}</div>
            )}
          </>
        )}
      </ActionableText>
    </Container>,
    window.document.body
  )

  return (
    <TrackingContainer ref={trackingElmRef}>{portaledElm}</TrackingContainer>
  )
}
