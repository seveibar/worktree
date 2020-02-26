import React, { useState, useRef, useCallback, useEffect } from "react"
import { useClickAway, useKey } from "react-use"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({ display: "inline" })
const NumberContainer = styled("div")({
  display: "inline",
  padding: "0.25em",
  textDecoration: "underline",
  transition: "transform 120ms",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.1, 1.1)"
  }
})

export default ({ value, onChange, ...props }) => {
  const containerRef = useRef()
  const numberContainerRef = useRef()
  const [open, changeOpen] = useState(false)
  const [mouseOver, changeMouseOver] = useState(false)
  const [manualEdit, changeManualEdit] = useState(false)

  useEffect(() => {
    if (manualEdit) return
    if (mouseOver) {
      changeOpen(true)
      return
    }
    const timeout = setTimeout(() => changeOpen(false), 300)
    return () => clearTimeout(timeout)
  }, [mouseOver])

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
      style={{
        fontWeight: open ? 600 : "inherit",
        ...props.style
      }}
      ref={containerRef}
    >
      <NumberContainer
        key={manualEdit}
        contentEditable={manualEdit}
        ref={numberContainerRef}
        suppressContentEditableWarning
        onClick={() => {
          if (!open) return changeOpen(true)
          return changeManualEdit(true)
        }}
      >
        {value.toLocaleString()}
      </NumberContainer>
    </Container>
  )
}
