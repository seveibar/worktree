import React, { useRef, useState, useEffect } from "react"
import * as colors from "@material-ui/core/colors"
import { styled } from "@material-ui/core/styles"
import Add from "@material-ui/icons/Add"
import AutoIcon, { getAutoColor } from "../AutoIcon"
import SubdirectoryArrowRightIcon from "@material-ui/icons/SubdirectoryArrowRight"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder"
import Button from "@material-ui/core/Button"

const Container = styled("div")(({ baseColor }) => ({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10
}))

const PlusHover = styled("div")(({ baseColor, open }) => ({
  color: "#fff",
  padding: 4,
  height: 32,
  width: 32,
  transform: open ? "translate(8px, 4px) rotate(-45deg)" : "none",
  transition: "transform 120ms, background-color 120ms",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "& .icon": {
    transition: "transform 500ms ease, margin-right 120ms, margin-bottom 120ms",
    transform: open ? "rotate(-135deg)" : "none"
  },
  backgroundColor: open ? baseColor[500] : baseColor[600]
}))

const Menu = styled("div")(({ baseColor, open }) => ({
  position: "absolute",
  pointerEvents: open ? "auto" : "none",
  left: -20,
  // top: open ? 40 : 0,
  top: 24,
  width: 300,
  opacity: open ? 1 : 0,
  transition: "opacity 120ms",
  height: 200,
  backgroundColor: baseColor[600],
  justifyContent: "center",
  padding: 16,
  paddingTop: 40,
  flexWrap: "wrap",
  boxShadow: open ? "0px 3px 5px rgba(0,0,0,0.3)" : "none",
  overflowY: "scroll",
  overflowX: "hidden"
}))

const TopCover = styled("div")(({ baseColor, open }) => ({
  position: "absolute",
  left: -20,
  top: 34,
  height: 20,
  pointerEvents: "none",
  transition: "opacity 120ms",
  opacity: open ? 1 : 0,
  boxShadow: `0px 3px 1px ${baseColor[700]}`,
  width: 316,
  backgroundColor: baseColor[500],
  "& .cover1": {
    position: "absolute",
    left: 0,
    top: -10,
    backgroundColor: baseColor[500],
    width: 32,
    height: 16
  },
  "& .cover2": {
    position: "absolute",
    left: 60,
    top: -10,
    backgroundColor: baseColor[500],
    width: 316 - 60,
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
    transform: "scale(1.02, 1.05)"
  },
  cursor: "pointer",
  "&.small": {
    width: 32,
    height: 32,
    marginTop: 20,
    display: "inline-flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "center",
    "& .icon": { width: 24, height: 24, marginRight: 0 },
    "& .text": {
      fontSize: 12,
      pointerEvents: "none",
      position: "absolute",
      opacity: 0,
      left: "calc(50% - 75px)",
      textAlign: "center",
      top: -20,
      width: 150,
      textAlign: "center"
    },
    "&:hover .text": {
      opacity: 1
    }
  }
}))

const NewMeterInput = styled("input")(({ value }) => ({
  display: "inline-flex",
  marginLeft: 8,
  width: "calc(100% - 16px)",
  boxSizing: "border-box",
  border: "2px solid rgba(0,0,0,0.75)",
  backgroundColor: "#fff",
  fontSize: 14,
  padding: 8,
  color: colors.grey[900],
  paddingTop: 12,
  paddingBottom: 12,
  marginTop: value ? 0 : 40,
  opacity: value ? 1 : 0.5,
  transition: "opacity 120ms, transform 120ms, margin-top 250ms",
  "&:hover": {
    opacity: 1,
    transform: "scale(1.02, 1.05)"
  }
}))

const NewMeterFinish = styled("div")(({ baseColor, show }) => ({
  display: "flex",
  color: "#fff",
  opacity: show ? 1 : 0,
  marginTop: !show ? -40 : 0,
  pointerEvents: !show ? "none" : "auto",
  transition: "opacity 250ms, margin-top 250ms",
  justifyContent: "flex-end",
  alignItems: "center",
  "& > *": { margin: 4 },
  "& .arrow": {},
  "& .button": {
    color: "#fff",
    textTransform: "none",
    border: "1px solid rgba(255,255,255,0.5)"
  }
}))

const NoMeters = styled("div")({
  color: "rgba(255,255,255,0.8)",
  textAlign: "center",
  padding: 16,
  fontWeight: "bold"
})

export default ({ baseColor = colors.blue, meters, onAdd, onChangeMeter }) => {
  const [mouseOverNow, changeMouseOverNow] = useState(false)
  const [mouseOver, changeMouseOver] = useState(false)
  const [selectedCategory, changeSelectedCategory] = useState()
  const [newMeterName, changeNewMeterName] = useState("")
  const [newCategoryName, changeNewCategoryName] = useState("")

  const meterCategories = Array.from(
    new Set(
      Object.values(meters)
        .filter(Boolean)
        .map(m => m.endpointName)
    )
  )

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

  useEffect(() => {
    if (mouseOver) return
    // give time for animations to finish before reseting state
    const timeout = setTimeout(() => {
      if (selectedCategory) changeSelectedCategory(null)
      if (newMeterName) changeNewMeterName("")
      if (newCategoryName) changeNewCategoryName("")
    }, 200)
    return () => clearTimeout(timeout)
  }, [mouseOver])

  const close = () => {
    changeMouseOver(false)
    changeMouseOverNow(false)
  }

  const handleCreateMeter = outputType => () => {
    const meterKey = `${selectedCategory}.${newMeterName
      .toLowerCase()
      .replace(/ /g, "_")}`
    onChangeMeter({
      name: newMeterName,
      meterKey,
      endpointName: selectedCategory,
      value: outputType === "boolean" ? false : 0,
      outputType,
      description: ""
    })
    onAdd(
      meterKey,
      outputType === "boolean" ? { mustBe: true } : { mustIncreaseBy: 100 }
    )
    close()
  }

  const selectedCategoryMeters = Object.values(meters)
    .filter(Boolean)
    .filter(m => m.endpointName === selectedCategory)

  return (
    <Container
      onMouseEnter={() => changeMouseOverNow(true)}
      onMouseLeave={() => changeMouseOverNow(false)}
    >
      <Menu baseColor={baseColor} open={mouseOver}>
        {!selectedCategory ? (
          <>
            {meterCategories.map(category => (
              <MenuItem
                key={category}
                color={getAutoColor(category)}
                baseColor={baseColor}
                className="small"
                onClick={() => changeSelectedCategory(category)}
              >
                <AutoIcon className="icon" name={category} />
                <div className="text">{category}</div>
              </MenuItem>
            ))}
            <NewMeterInput
              baseColor={baseColor}
              placeholder="New Category"
              value={newCategoryName}
              onChange={e => changeNewCategoryName(e.target.value)}
            />
            <NewMeterFinish show={newCategoryName}>
              <SubdirectoryArrowRightIcon className="arrow" />
              <Button
                onClick={() => changeSelectedCategory(newCategoryName)}
                className="button"
              >
                <CreateNewFolderIcon />
              </Button>
            </NewMeterFinish>
          </>
        ) : (
          <>
            {selectedCategoryMeters.length === 0 ? (
              <NoMeters>No Meters, Create One Below</NoMeters>
            ) : (
              selectedCategoryMeters.map(m => (
                <MenuItem
                  key={m.name}
                  color={getAutoColor(m.name)}
                  baseColor={baseColor}
                  onClick={() => {
                    onAdd(
                      m.meterKey,
                      m.outputType === "boolean"
                        ? {
                            mustBe: true
                          }
                        : {
                            mustIncreaseBy: 100
                          }
                    )
                    close()
                  }}
                >
                  <AutoIcon className="icon" name={m.name} />
                  <div className="text">{m.name}</div>
                </MenuItem>
              ))
            )}
            <NewMeterInput
              baseColor={baseColor}
              placeholder="New Meter"
              value={newMeterName}
              onChange={e => changeNewMeterName(e.target.value)}
            />
            <NewMeterFinish show={newMeterName}>
              <SubdirectoryArrowRightIcon className="arrow" />
              <Button onClick={handleCreateMeter("boolean")} className="button">
                <CheckBoxIcon />
              </Button>
              <Button onClick={handleCreateMeter("integer")} className="button">
                123
              </Button>
              <Button onClick={handleCreateMeter("number")} className="button">
                3.14
              </Button>
            </NewMeterFinish>
          </>
        )}
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
