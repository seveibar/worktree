import React from "react"
import { styled, makeStyles } from "@material-ui/core/styles"
import AutoIcon, { getAutoColor } from "../AutoIcon"
import TrashIcon from "@material-ui/icons/Delete"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import CheckBoxIcon from "@material-ui/icons/CheckBox"
import CheckBoxOutlineIcon from "@material-ui/icons/CheckBoxOutlineBlank"
import * as colors from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import EditNumber from "../EditNumber"
import classnames from "classnames"

const useStyles = makeStyles({
  iconButton: {
    cursor: "pointer",
    transition: "transform 80ms",
    "&:hover": {
      transform: "scale(1.2, 1.2)"
    },
    marginLeft: 8,
    fontSize: 24,
    fontWeight: 600,
    display: "inline-flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 24
  },
  checkbox: {
    color: "#fff",
    marginLeft: 4,
    width: 18,
    height: 18,
    "&.editable": {
      color: "#fff",
      width: 24,
      height: 24,
      padding: 4,
      border: "4px dashed rgba(255,255,255,0.25)"
    }
  }
})

const CheckBox = ({ checked, onCheck, ...props }) =>
  checked ? (
    <CheckBoxIcon
      {...props}
      onClick={() => {
        if (onCheck) onCheck(false)
      }}
    />
  ) : (
    <CheckBoxOutlineIcon
      {...props}
      onClick={() => {
        if (onCheck) onCheck(true)
      }}
    />
  )

const Container = styled("div")({
  color: "#fff",
  display: "flex",
  alignItems: "center",
  marginTop: 4,
  marginBottom: 4
})
const IconContainer = styled("div")(
  ({ color = colors.purple, editableValue }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color[600],
    padding: 4,
    margin: 4,
    marginLeft: 0,
    marginTop: editableValue ? 12 : 4,
    marginRight: 8,
    "& .icon": {
      width: 24,
      height: 24
    },
    border: "2px solid rgba(0,0,0,0.3)"
  })
)
const RightOfIconContainer = styled("div")({
  flexGrow: 1
})
const TopContent = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: 4
})
const EditContent = styled("div")({
  display: "flex",
  alignItems: "center",
  fontSize: 14
})
const MetricName = styled("div")({})
const ProgressText = styled("div")({
  flexGrow: 1,
  textAlign: "right"
})
const ProgressBar = styled("div")({
  position: "relative",
  height: 4,
  "& .topbar": {
    position: "absolute",
    transition: "width 120ms ease",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    height: 4
  },
  "& .bottombar": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    opacity: 0.5,
    height: 4
  }
})
const NoMeter = styled("div")({
  color: "rgba(255,255,255,0.5)",
  fontWeight: "bold",
  backgroundColor: "rgba(0,0,0,0.5)",
  padding: 8,
  marginTop: 8,
  marginBottom: 8,
  display: "flex",
  alignItems: "center"
})

const EditRequirement = ({
  meter,
  requirement,
  onChangeRequirement,
  onDeleteRequirement
}) => {
  const c = useStyles()
  return (
    <Container>
      <IconContainer color={getAutoColor(meter.name)}>
        <AutoIcon className="icon" name={meter.name} />
      </IconContainer>
      <RightOfIconContainer>
        <EditContent>
          <MetricName>{meter.name}</MetricName>
          <div style={{ flexGrow: 1 }} />
          {meter.outputType === "boolean" ? (
            <CheckBoxIcon className={c.iconButton} />
          ) : (
            <>
              {requirement.mustIncreaseBy !== undefined ? (
                <ArrowUpwardIcon
                  className={c.iconButton}
                  onClick={() => {
                    const { mustIncreaseBy, ...res } = requirement
                    onChangeRequirement({
                      ...res,
                      mustBeAtleast: mustIncreaseBy
                    })
                  }}
                />
              ) : requirement.mustBeAtleast ? (
                <div
                  className={c.iconButton}
                  onClick={() => {
                    const { mustBeAtleast, ...res } = requirement
                    onChangeRequirement({
                      ...res,
                      mustIncreaseBy: mustBeAtleast
                    })
                  }}
                >
                  {">"}
                </div>
              ) : requirement.mustBe ? (
                <div className={c.iconButton}>{"="}</div>
              ) : (
                "?"
              )}
              <EditNumber
                style={{
                  minWidth: 60,
                  textAlign: "center"
                }}
                onChange={value => {
                  const key = Object.keys(requirement)
                    .filter(k => requirement[k] !== undefined)
                    .filter(k =>
                      ["mustBeAtleast", "mustBe", "mustIncreaseBy"].includes(k)
                    )[0]
                  onChangeRequirement({ ...requirement, [key]: value })
                }}
                value={
                  requirement.mustBeAtleast ||
                  requirement.mustBe ||
                  requirement.mustIncreaseBy ||
                  0
                }
              />
            </>
          )}
          <TrashIcon onClick={onDeleteRequirement} className={c.iconButton} />
        </EditContent>
      </RightOfIconContainer>
    </Container>
  )
}

export default ({
  requirement,
  meter,
  meterKey,
  state = {},
  inEditMode,
  editableValue,
  onChangeRequirement,
  onChangeMeter,
  onDeleteRequirement
}) => {
  const c = useStyles()
  if (!meter)
    return (
      <NoMeter>
        <div>Missing Meter "{meterKey}"</div>
        <div style={{ flexGrow: 1 }} />
        {inEditMode && (
          <TrashIcon className={c.iconButton} onClick={onDeleteRequirement} />
        )}
      </NoMeter>
    )

  if (inEditMode)
    return (
      <EditRequirement
        onChangeRequirement={onChangeRequirement}
        onDeleteRequirement={onDeleteRequirement}
        meter={meter}
        requirement={requirement}
      />
    )

  const startValue = (state.startValues || {})[meter.meterKey] || 0
  const endValue = (state.endValues || {})[meter.meterKey] || meter.value
  let absoluteGoal, distanceToGoal, goalSize, progress
  if (
    meter.outputType === "integer" ||
    meter.outputType === "float" ||
    meter.outputType === "percent"
  ) {
    absoluteGoal =
      requirement.mustBeAtleast || startValue + requirement.mustIncreaseBy
    distanceToGoal = endValue - startValue
    goalSize = absoluteGoal - startValue
    progress = (distanceToGoal / goalSize) * 100
  } else if (meter.outputType === "boolean") {
    progress = requirement.mustBe === endValue ? 100 : 0
  }
  const progressText =
    meter.outputType === "boolean"
      ? ""
      : requirement.mustIncreaseBy
      ? `${Math.min(distanceToGoal, goalSize)}/${goalSize}`
      : `${Math.min(endValue, absoluteGoal)}/${absoluteGoal}`

  return (
    <Container>
      <IconContainer
        color={getAutoColor(meter.name)}
        editableValue={editableValue}
      >
        <AutoIcon className="icon" name={meter.name} />
      </IconContainer>
      <RightOfIconContainer>
        <TopContent>
          <MetricName>{meter.name}</MetricName>
          {editableValue && meter.outputType !== "boolean" ? (
            <>
              <div style={{ flexGrow: 1 }} />
              <EditNumber
                style={{
                  minWidth: 60,
                  textAlign: "center",
                  marginLeft: 8
                }}
                adderDistance={34}
                onChange={value => onChangeMeter({ ...meter, value })}
                value={meter.value}
                notEditingText={progressText}
              />
            </>
          ) : (
            <ProgressText>{progressText}</ProgressText>
          )}
          {editableValue && meter.outputType === "boolean" && (
            <CheckBox
              className={classnames(c.checkbox, c.iconButton, "editable")}
              onCheck={value => onChangeMeter({ ...meter, value })}
              checked={meter.value}
            />
          )}
          <CheckBox className={c.checkbox} checked={progress >= 100} />
        </TopContent>
        <ProgressBar>
          <div
            className="topbar"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
          <div className="bottombar" />
        </ProgressBar>
      </RightOfIconContainer>
    </Container>
  )
}
