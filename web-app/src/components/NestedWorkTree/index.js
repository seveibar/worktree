import React, { useRef, useReducer, useState, useEffect } from "react"
import { useWindowSize } from "react-hooks-window-size"
import { styled } from "@material-ui/core/styles"
import TreeSquare from "../TreeSquare"
import { default as setIn } from "lodash/set"
import * as colors from "@material-ui/core/colors"

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

const NestedWorkTree = ({ nestedTree, onDrawn, unlocked = true }) => {
  let { complete, progress } = nestedTree.state || {}
  if (progress === undefined) progress = complete ? 100 : 0

  const windowSize = useWindowSize()
  const containerRef = useRef()
  const [containerCoords, changeContainerCoords] = useState()
  const childCoordinates = useRef((nestedTree.children || []).map(c => null))
  const changeChildCoordinates = ({ childIndex, coords }) =>
    setIn(childCoordinates.current, childIndex, coords)

  useEffect(() => {
    if (containerRef.current !== null) {
      const myCoords = containerRef.current.getBoundingClientRect()
      changeContainerCoords(myCoords)
      if (onDrawn) onDrawn(myCoords)
    }
    return () => {}
  }, [containerRef, windowSize.width, windowSize.height])

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
      .map(({ x, y, width }) => x - containerCoords.x + width / 2)
      .sort()

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
      <TreeSquare
        name={nestedTree.name}
        description={nestedTree.description}
        complete={complete}
        unlocked={unlocked}
        progress={progress}
        rewards={nestedTree.rewards}
      />
      {(nestedTree.children || []).length > 0 && (
        <>
          <Children>
            {(nestedTree.children || []).map((child, childIndex) => (
              <NestedWorkTree
                key={child.name}
                nestedTree={child}
                unlocked={complete}
                onDrawn={coords =>
                  changeChildCoordinates({ childIndex, coords })
                }
              />
            ))}
          </Children>
        </>
      )}
    </Container>
  )
}

export default NestedWorkTree
