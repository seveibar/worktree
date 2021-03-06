import React, { useRef, useState, useEffect } from "react"
import useWindowSize from "../../hooks/use-window-size.js"
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
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import TrashIcon from "@material-ui/icons/Delete"
import AddRequirementBox from "../AddRequirementBox"
import classnames from "classnames"

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

const editStripes = {
  backgroundImage:
    "linear-gradient(45deg, rgba(0, 0, 0, 0.1) 16.67%, rgba(0, 0, 0, 0) 16.67%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 66.67%, rgba(0, 0, 0, 0) 66.67%, rgba(0, 0, 0, 0) 100%)",
  backgroundSize: "16.97px 16.97px"
}

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
    padding: 12,
    "&.editable": editStripes
  }
})

const DescriptionContainer = styled("div")({
  color: "#fff",
  padding: 16,
  whiteSpace: "prewrap",
  minHeight: 50,
  "&.editable": editStripes
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
  paddingLeft: 16,
  paddingRight: 16
})
const RewardsContainer = styled("div")({
  padding: 8
  // paddingLeft: 32,
  // paddingRight: 32
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
  padding: 8,
  fontSize: 16,
  color: "#fff",
  "&& .MuiButton-label": { color: "#fff" },
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

const ActionableButton = styled(Button)({
  justifyContent: "flex-start",
  display: "flex",
  marginLeft: 8,
  flexDirection: "row",
  color: "#fff",
  textTransform: "none",
  fontSize: 16,
  fontWeight: 600
})

const StyledTrashIcon = styled(TrashIcon)({
  color: "#fff",
  cursor: "pointer",
  // marginRight: 8,
  marginLeft: 8,
  transition: "transform 80ms ease",
  "&:hover": {
    transform: "scale(1.2,1.2)"
  }
})

const defaultDescription = "No Description."

export default ({
  open,
  fullyOpen,
  complete,
  available,
  name,
  description,
  rewards = [],
  requirements = [],
  meters,
  inEditMode,
  isRoot,
  state,
  progress,
  onChangeFlatTree,
  onDeleteTree,
  onUnlockTree,
  onChangeMeter
}) => {
  const trackingElmRef = useRef()
  const windowSize = useWindowSize()
  const color = colors.blue

  const titleElm = useRef()
  const descriptionElm = useRef()
  useEffect(() => {
    if (!fullyOpen && titleElm.current) {
      // Save any changes
      const modifications = {}
      const newName = titleElm.current.innerText
      if (newName !== name && newName) modifications.name = newName

      const newDescription = descriptionElm.current.innerText
      if (
        newDescription &&
        newDescription !== description &&
        newDescription !== defaultDescription
      )
        modifications.description = newDescription

      if (Object.keys(modifications).length > 0) {
        onChangeFlatTree(name, modifications)
      }
    }
  }, [fullyOpen])

  const [position, changePosition] = useState({})

  const containerElm = window.document.body

  useEffect(() => {
    if (!trackingElmRef.current) return
    let { x: tx, y: ty } = trackingElmRef.current.getBoundingClientRect()
    tx += window.pageXOffset
    ty += window.pageYOffset
    if (tx > (windowSize.width * 3) / 4) {
      tx -= 145 + WIDTH
    }
    // TODO possibly add in window.pageX and window.pageY
    changePosition({
      left: Math.min(Math.max(15, tx), windowSize.width - WIDTH - 80),
      top: Math.max(ty - HEIGHT + 50, 10)
    })
  }, [windowSize.width, windowSize.height, trackingElmRef.current, open])

  const portaledElm = createPortal(
    <Container
      style={{
        opacity: fullyOpen ? 1 : open ? 0.95 : 0,
        transform: fullyOpen
          ? "scale(1,1)"
          : open
          ? "scale(0.95,0.95)"
          : "scale(0.85, 0.85)",
        pointerEvents: !fullyOpen ? "none" : "inherit",
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
        <div
          suppressContentEditableWarning={true}
          contentEditable={inEditMode && fullyOpen}
          onKeyPress={e =>
            e.key === "Enter" && window.document.activeElement.blur()
          }
          ref={titleElm}
          style={{ backgroundColor: color[500] }}
          className={classnames("text", inEditMode && fullyOpen && "editable")}
        >
          {name || " "}
        </div>
      </Title>
      <DescriptionContainer
        ref={descriptionElm}
        contentEditable={inEditMode && fullyOpen}
        suppressContentEditableWarning={true}
        className={classnames({ editable: fullyOpen && inEditMode })}
      >
        {description || defaultDescription}
      </DescriptionContainer>
      {(Object.keys(requirements).length > 0 || (inEditMode && fullyOpen)) && (
        <>
          <Sep />
          <RequirementsText>Requirements</RequirementsText>
          <MeterProgressContainer>
            {Object.entries(requirements).map(([meterKey, requirement]) => (
              <MeterProgress
                inEditMode={inEditMode}
                editableValue={fullyOpen}
                key={meterKey}
                meterKey={meterKey}
                meter={meters[meterKey]}
                requirement={requirement}
                onChangeRequirement={newRequirement => {
                  onChangeFlatTree(
                    [name, "requirements", meterKey],
                    newRequirement
                  )
                }}
                onDeleteRequirement={() => {
                  const newRequirements = { ...requirements }
                  delete newRequirements[meterKey]
                  onChangeFlatTree([name, "requirements"], newRequirements)
                }}
                onChangeMeter={onChangeMeter}
                state={state}
              />
            ))}
            {inEditMode && fullyOpen && (
              <AddRequirementBox
                onAdd={(meterKey, requirement) => {
                  onChangeFlatTree([name, "requirements"], {
                    ...requirements,
                    [meterKey]: requirement
                  })
                }}
                onChangeMeter={onChangeMeter}
                meters={meters}
              />
            )}
          </MeterProgressContainer>
        </>
      )}
      {/* Disabling Rewards for Now */}
      {false && (rewards.length > 0 || (inEditMode && fullyOpen)) && (
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
            {inEditMode && fullyOpen && "+"}
          </RewardsContainer>
        </>
      )}
      <div style={{ flexGrow: 1 }} />
      <Sep />
      <ActionableText>
        {!inEditMode || !fullyOpen ? (
          complete ? (
            <>
              <SmileIcon className="icon" style={{ margin: 8 }} />
              <div>Unlocked!</div>
            </>
          ) : (
            <ActionableButton
              onClick={() => onUnlockTree(name)}
              disabled={progress < 100 || !available}
            >
              {progress < 100 || !available ? (
                <LockIcon className="icon" />
              ) : (
                <UnlockIcon className="icon" />
              )}
              <div>
                {progress < 100 || !available
                  ? "Complete Requirements to Unlock"
                  : "Ready to Unlock!"}
              </div>
              {progress >= 100 && available && (
                <div className="action">{"(Click Here)"}</div>
              )}
            </ActionableButton>
          )
        ) : (
          // when inEditMode...
          <>
            <Box display="flex" flexGrow={1} />
            {!isRoot && <StyledTrashIcon onClick={() => onDeleteTree(name)} />}
          </>
        )}
      </ActionableText>
    </Container>,
    containerElm
  )

  return (
    <TrackingContainer ref={trackingElmRef}>{portaledElm}</TrackingContainer>
  )
}
