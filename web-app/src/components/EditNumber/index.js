import React, { useState, useRef, useCallback, useEffect } from "react"
import * as colors from "@material-ui/core/colors"
import { useClickAway, useKey } from "react-use"
import { styled } from "@material-ui/core/styles"
import AddIcon from "@material-ui/icons/Add"
import Button from "@material-ui/core/Button"
import "./arrow_box.css"

const Container = styled("div")({
  display: "inline",
  position: "relative"
})
const Adders = styled("div")(({ open, adderDistance = 12 }) => ({
  // border: "1px solid rgba(255,255,255,0.25)",
  pointerEvents: open ? "auto" : "none",
  position: "absolute",
  transition: "opacity 80ms",
  opacity: open ? 0.5 : 0,
  left: `calc(100% + ${adderDistance}px)`,
  margin: 0,
  top: -50,
  "& .icon": { color: "#fff" },
  backgroundColor: "#fff",
  transform: "scale(0.9,0.95) translate(4px, 0px)",
  transition: "opacity 120ms, box-shadow 120ms, transform 120ms",
  "&:hover": {
    opacity: 1,
    transform: "scale(1,1)",
    boxShadow: "0px 3px 5px rgba(0,0,0,0.2)"
  },
  border: `4px solid #fff`
}))
const Adder = styled(Button)({
  fontWeight: "bold",
  // backgroundColor: colors.blue[700],
  color: colors.blue[800],
  // color: "#fff",
  margin: 4
})
const NumberContainer = styled("div")(({ justAdded }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box",
  padding: "0.25em",
  paddingTop: "0.5em",
  paddingBottom: "0.5em",
  textAlign: "center",
  border: "4px dashed rgba(255,255,255,0.25)",
  // textDecoration: "underline",
  transform: justAdded ? "scale(1.2,1.2)" : "none",
  transition: "transform 120ms",
  "&:hover": {
    transform: "scale(1.1, 1.1)"
  },
  cursor: "pointer"
}))

export default ({
  value,
  notEditingText,
  onChange,
  adderDistance,
  ...props
}) => {
  const containerRef = useRef()
  const numberContainerRef = useRef()
  const [open, changeOpen] = useState(false)
  const [mouseOver, changeMouseOver] = useState(false)
  const [manualEdit, changeManualEdit] = useState(false)
  const [justAdded, changeJustAdded] = useState(false)

  useEffect(() => {
    if (manualEdit) return
    if (mouseOver) {
      changeOpen(true)
      return
    }
    const timeout = setTimeout(() => changeOpen(false), 200)
    return () => clearTimeout(timeout)
  }, [mouseOver])

  useEffect(() => {
    changeJustAdded(true)
    const timeout = setTimeout(() => {
      changeJustAdded(false)
    }, 120)
    return () => clearTimeout(timeout)
  }, [value])

  const exit = useCallback(() => {
    if (!open || !manualEdit) return
    if (manualEdit && numberContainerRef.current) {
      onChange(
        parseFloat(numberContainerRef.current.innerText.replace(/,/g, "")) || 0
      )
    }
    if (manualEdit) changeManualEdit(false)
    changeOpen(false)
  }, [manualEdit, open, numberContainerRef.current])

  useClickAway(containerRef, exit)
  useKey("Enter", exit, {}, [exit])

  return (
    <Container
      {...props}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      onClick={() => {
        if (!open) return changeOpen(true)
        return changeManualEdit(true)
      }}
      ref={containerRef}
    >
      <Adders
        open={open}
        adderDistance={adderDistance}
        className="number_arrow_box"
      >
        <Adder onClick={() => onChange(value + 100)}>+100</Adder>
        <Adder onClick={() => onChange(value + 10)}>+10</Adder>
        <Adder onClick={() => onChange(value + 1)}>+1</Adder>
      </Adders>
      <NumberContainer
        key={manualEdit}
        contentEditable={manualEdit}
        ref={numberContainerRef}
        justAdded={justAdded}
        suppressContentEditableWarning
      >
        {notEditingText !== undefined && !open
          ? notEditingText
          : value.toLocaleString()}
      </NumberContainer>
    </Container>
  )
}
