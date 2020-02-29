import React, { useState, useEffect } from "react"
import AutoIcon from "../AutoIcon"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import { styled } from "@material-ui/core/styles"
import * as colors from "@material-ui/core/colors"
import classnames from "classnames"
import TreeSquareHoverBox from "../TreeSquareHoverBox"

const Container = styled("div")({
  position: "relative",
  width: 120,
  height: 120,
  margin: 20,
  marginLeft: ({ inEditMode }) => (inEditMode ? 80 : 40),
  marginRight: ({ inEditMode }) => (inEditMode ? 80 : 40),
  marginBottom: 30,
  border: `2px solid ${colors.grey[900]}`,
  borderTop: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 3px 3px rgba(0,0,0,0.2)",
  cursor: "pointer",
  transition:
    "transform 80ms linear, margin-left 200ms ease, margin-right 200ms ease, filter 80ms ease",
  "&:hover": {
    transform: "scale(1.05,1.05)"
  },
  zIndex: 1,
  "&&&.justCompleted": {
    transform: "scale(1.5,1.5)",
    transition: "transform 80ms ease, filter 80ms ease",
    filter: "brightness(150%)"
  }
})

const Title = styled("div")({
  display: "flex",
  width: "100%",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  backgroundColor: colors.grey[900],
  fontSize: 14,
  fontWeight: 500,
  paddingTop: 8,
  paddingBottom: 8
})

const StyledAutoIcon = styled(AutoIcon)({
  width: 64,
  height: 64,
  color: "#fff",
  transform: "translate(0px, 10px) scale(1.8,1.8) rotate(30deg)"
})

const IconContainer = styled("div")({
  flexGrow: 1,
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  background:
    "radial-gradient(circle, rgba(3,155,229,1) 0%, rgba(129,212,250,1) 100%)"
})

const LockContainer = styled("div")({
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  "& .icon": {
    color: "#fff",
    marginTop: 20,
    transform: "rotate(15deg)",
    width: 64,
    height: 64
  }
})

const IncompleteContainer = styled("div")({
  position: "absolute",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  justifyContent: "flex-end",
  alignItems: "flex-end",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex"
})
const ProgressContainer = styled("div")({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  right: 0,
  bottom: 0,
  padding: 8,
  color: "#fff",
  backgroundColor: colors.orange[500],
  boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
  borderTopLeftRadius: 50,
  borderBottomLeftRadius: 50,
  fontWeight: 500,
  textShadow: "0px 0px 3px rgba(0,0,0,0.5)",
  paddingLeft: 10,
  "&.unlockable": {
    backgroundColor: colors.green[500]
  },
  "& .icon": {
    color: "#fff",
    width: 20,
    height: 20,
    marginRight: 4
  }
})

export default props => {
  let {
    name,
    description,
    rewards = [],
    available = true,
    complete = true,
    progress,
    inEditMode,
    onChange
  } = props

  if (inEditMode) {
    available = true
    complete = true
  }

  const [mouseOver, changeMouseOver] = useState()
  const [fullyOpen, changeFullyOpen] = useState(false)
  const [justCompleted, changeJustCompleted] = useState(null)

  useEffect(() => {
    if (mouseOver || !fullyOpen) return
    const timeout = setTimeout(() => {
      changeFullyOpen(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [fullyOpen, mouseOver])

  useEffect(() => {
    if (!complete || inEditMode) return changeJustCompleted(false)
    if (justCompleted === false) {
      changeJustCompleted(true)
      setTimeout(() => {
        changeJustCompleted(false)
      }, 120)
    }
  }, [complete])

  return (
    <Container
      inEditMode={inEditMode}
      onMouseEnter={() => {
        if (!mouseOver) changeMouseOver(true)
      }}
      onMouseLeave={() => {
        if (!mouseOver) return
        changeMouseOver(false)
      }}
      className={{ justCompleted }}
      onClick={() => changeFullyOpen(true)}
    >
      <Title>{name}</Title>
      <IconContainer>
        <StyledAutoIcon name={name} />
      </IconContainer>
      {!available && (
        <LockContainer>
          <LockIcon className="icon" />
        </LockContainer>
      )}
      {available && !complete && (
        <IncompleteContainer>
          <ProgressContainer
            className={classnames({ unlockable: progress >= 100 })}
          >
            <UnlockIcon className="icon" />
            {Math.min(100, Math.floor(progress))}%
          </ProgressContainer>
        </IncompleteContainer>
      )}
      <TreeSquareHoverBox
        {...props}
        inEditMode={inEditMode}
        open={mouseOver || fullyOpen}
        fullyOpen={fullyOpen}
      />
    </Container>
  )
}
