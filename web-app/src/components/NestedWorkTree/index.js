import React, { useRef, useReducer, useState, useEffect } from "react"
import { useInterval } from "react-use"
import useWindowSize from "../../hooks/use-window-size.js"
import { styled } from "@material-ui/core/styles"
import TreeSquare from "../TreeSquare"
import { default as setIn } from "lodash/set"
import * as colors from "@material-ui/core/colors"
import getTreeProgress from "../../methods/get-tree-progress.js"
import AddSquare from "../AddSquare"
import isEqual from "lodash/isEqual"

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

const getNewAchievement = () => ({
  name: "New Achievement " + Math.floor(Math.random() * 10000)
})

const getElmCoords = elm => {
  const d = elm.getBoundingClientRect()
  d.x += window.pageXOffset
  d.y += window.pageYOffset
  return d
}

const NestedWorkTree = ({
  nestedTree,
  onDrawn,
  available = false,
  meters = {},
  isRoot = true,
  inEditMode = false,
  onChangeFlatTree,
  onChangeMeter,
  onAddChild
}) => {
  let { complete = false, progress } = nestedTree.state || {}
  if (complete) available = true
  if (progress === undefined) progress = complete ? 100 : 0

  const windowSize = useWindowSize()
  const containerRef = useRef()
  const [containerCoords, changeContainerCoords] = useState()
  const childCoordinates = useRef((nestedTree.children || []).map(c => null))
  const changeChildCoordinates = ({ childIndex, coords }) =>
    setIn(childCoordinates.current, childIndex, coords)

  useEffect(() => {
    if (containerRef.current !== null) {
      const myCoords = getElmCoords(containerRef.current)
      changeContainerCoords(myCoords)
      if (onDrawn) onDrawn(myCoords)
    }
    return () => {}
  }, [containerRef, windowSize.width, windowSize.height])

  // This is all to handle children being added
  useInterval(
    () => {
      if (containerRef.current !== null) {
        const newCoords = getElmCoords(containerRef.current)
        if (!isEqual(containerCoords, newCoords)) {
          changeContainerCoords(newCoords)
          if (onDrawn) onDrawn(newCoords)
        }
      }
    },
    inEditMode ? 20 : null
  )

  const [svgPath, changeSVGPath] = useState()

  useEffect(() => {
    if (
      !containerCoords ||
      childCoordinates.current.length === 0 ||
      childCoordinates.current.some(c => c === null)
    )
      return
    const bottomOfRootSquare = [containerCoords.width / 2, 130]
    const bottomSquareConnect = [
      bottomOfRootSquare[0],
      bottomOfRootSquare[1] + 30
    ]
    const childTouchPoints = childCoordinates.current
      .map(({ x, y, width }) => parseFloat(x) - containerCoords.x + width / 2)
      .sort((a, b) => a - b)

    changeSVGPath(
      [
        `M${bottomOfRootSquare.join(" ")}`,
        `L${bottomSquareConnect.join(" ")}`,
        `M${childTouchPoints[0]} ${bottomSquareConnect[1]}`,
        `L${childTouchPoints.slice(-1)[0]} ${bottomSquareConnect[1]}`,
        ...childTouchPoints.map(x => `M${x} ${bottomSquareConnect[1]}l0 40`)
      ].join(" ")
    )
  }, [containerCoords, childCoordinates])

  return (
    <Container ref={containerRef}>
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1
        }}
      >
        {svgPath && (
          <path
            fill="none"
            strokeLinecap="square"
            stroke={complete ? colors.blue[200] : colors.grey[400]}
            strokeWidth="5"
            d={svgPath}
          />
        )}
      </svg>
      {inEditMode && !isRoot && (
        <>
          <AddSquare
            onClick={() => onAddChild("left")}
            style={{
              position: "absolute",
              top: 60,
              left: "calc(50% - 120px)"
            }}
          />
          <AddSquare
            style={{
              position: "absolute",
              top: 60,
              left: "calc(50% + 70px)"
            }}
            onClick={() => onAddChild("right")}
          />
          {(nestedTree.children || []).length === 0 && (
            <AddSquare
              style={{
                position: "absolute",
                top: 150,
                left: "calc(50% - 25px)"
              }}
              onClick={() =>
                onChangeFlatTree(
                  [nestedTree.name, "children"],
                  [getNewAchievement()]
                )
              }
            />
          )}
        </>
      )}
      <TreeSquare
        {...nestedTree}
        inEditMode={inEditMode}
        onChangeMeter={onChangeMeter}
        onChangeFlatTree={onChangeFlatTree}
        meters={meters}
        progress={getTreeProgress(nestedTree, meters)}
        complete={complete}
        available={available}
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
                onChangeMeter={onChangeMeter}
                onDrawn={coords =>
                  changeChildCoordinates({ childIndex, coords })
                }
                onAddChild={leftOrRight => {
                  const addBefore =
                    leftOrRight === "left" ? childIndex : childIndex + 1
                  onChangeFlatTree(
                    [nestedTree.name, "children"],
                    [
                      ...nestedTree.children.slice(0, addBefore),
                      getNewAchievement(),
                      ...nestedTree.children.slice(addBefore)
                    ]
                  )
                }}
              />
            ))}
          </Children>
        </>
      )}
    </Container>
  )
}

export default NestedWorkTree
