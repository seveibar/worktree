import React, { useRef, useReducer, useState, useEffect, useMemo } from "react"
import { useInterval } from "react-use"
import useWindowSize from "../../hooks/use-window-size.js"
import { styled } from "@material-ui/core/styles"
import TreeSquare from "../TreeSquare"
import { default as setIn } from "lodash/set"
import * as colors from "@material-ui/core/colors"
import getTreeProgress from "../../methods/get-tree-progress.js"
import useEventCallback from "../../hooks/use-event-callback.js"
import AddSquare from "../AddSquare"
import isEqual from "lodash/isEqual"

const emptyObj = {}

const Container = styled("div")({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
})

const Children = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center"
})

const LeftAddSquare = styled(AddSquare)({
  position: "absolute",
  top: 60,
  left: "calc(50% - 120px)"
})
const RightAddSquare = styled(AddSquare)({
  position: "absolute",
  top: 60,
  left: "calc(50% + 70px)"
})
const BottomAddSquare = styled(AddSquare)({
  position: "absolute",
  top: 150,
  left: "calc(50% - 25px)"
})

const getNewAchievement = parent => ({
  name: "New Achievement " + Math.floor(Math.random() * 10000),
  parent
})

const NestedWorkTree = ({
  nestedTree,
  available = false,
  meters = emptyObj,
  isRoot = true,
  inEditMode = false,
  onChangeFlatTree,
  onDeleteTree,
  onChangeMeter,
  onUnlockTree,
  leftMost = false,
  rightMost = false,
  singleChild = false,
  onAddChild
}) => {
  let { complete = false } = nestedTree.state || emptyObj
  if (complete || !nestedTree.parent) available = true
  if (isRoot) singleChild = true

  const onAddChildOnLeft = useEventCallback(() => onAddChild("left"))
  const onAddChildOnRight = useEventCallback(() => onAddChild("right"))
  const onAddChildBelow = useEventCallback(() => {
    onChangeFlatTree(
      [nestedTree.name, "children"],
      [getNewAchievement(nestedTree.name)]
    )
  })

  const onAddChildHandlers = (nestedTree.children || []).map(
    (child, childIndex) => leftOrRight => {
      const addBefore = leftOrRight === "left" ? childIndex : childIndex + 1
      onChangeFlatTree(
        [nestedTree.name, "children"],
        [
          ...nestedTree.children.slice(0, addBefore),
          getNewAchievement(),
          ...nestedTree.children.slice(addBefore)
        ]
      )
    }
  )

  return (
    <Container>
      {!singleChild && (
        <div
          style={{
            position: "absolute",
            height: 5,
            backgroundColor: available ? colors.blue[200] : colors.grey[400],
            left: rightMost ? 0 : leftMost ? "50%" : 0,
            right: rightMost ? "50%" : 0,
            top: -5
          }}
        />
      )}
      {!isRoot && (
        <div
          style={{
            position: "absolute",
            height: 50,
            backgroundColor: available ? colors.blue[200] : colors.grey[400],
            left: "calc(50% - 2.5px)",
            width: 5,
            top: -5
          }}
        />
      )}
      {(nestedTree.children || []).length !== 0 && (
        <div
          style={{
            position: "absolute",
            height: 30,
            backgroundColor: complete ? colors.blue[200] : colors.grey[400],
            left: "calc(50% - 2.5px)",
            width: 5,
            top: 140
          }}
        />
      )}
      {inEditMode && (
        <>
          {!isRoot && (
            <>
              <LeftAddSquare onClick={onAddChildOnLeft} />
              <RightAddSquare onClick={onAddChildOnRight} />
            </>
          )}
          {(nestedTree.children || []).length === 0 && (
            <BottomAddSquare onClick={onAddChildBelow} />
          )}
        </>
      )}
      <TreeSquare
        {...nestedTree}
        inEditMode={inEditMode}
        onChangeMeter={onChangeMeter}
        onChangeFlatTree={onChangeFlatTree}
        onUnlockTree={onUnlockTree}
        onDeleteTree={onDeleteTree}
        meters={meters}
        progress={getTreeProgress(nestedTree, meters)}
        complete={complete}
        available={available}
        isRoot={isRoot}
      />
      {(nestedTree.children || []).length > 0 && (
        <>
          <Children>
            {(nestedTree.children || []).map((child, childIndex) => (
              <NestedWorkTree
                key={child.name}
                isRoot={false}
                nestedTree={child}
                meters={meters}
                available={complete}
                inEditMode={inEditMode}
                onChangeFlatTree={onChangeFlatTree}
                onUnlockTree={onUnlockTree}
                onDeleteTree={onDeleteTree}
                onChangeMeter={onChangeMeter}
                leftMost={childIndex === 0 && nestedTree.children.length > 1}
                rightMost={
                  childIndex === nestedTree.children.length - 1 &&
                  nestedTree.children.length > 1
                }
                singleChild={
                  childIndex === 0 && nestedTree.children.length === 1
                }
                onAddChild={onAddChildHandlers[childIndex]}
              />
            ))}
          </Children>
        </>
      )}
    </Container>
  )
}

export default NestedWorkTree
