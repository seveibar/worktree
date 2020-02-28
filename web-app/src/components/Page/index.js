import React, { useRef, useState } from "react"
import { styled } from "@material-ui/core/styles"
import { useMouse, useLocalStorage } from "react-use"
import AutoIcon from "../AutoIcon"
import EditIcon from "@material-ui/icons/Edit"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"

const emptyObj = {}
const EXTEND_AMOUNT = 1.2

const Page = styled("div")({
  position: "relative",
  overflow: "hidden",
  width: "100vw",
  height: "100vh"
})
const Header = styled("div")({
  position: "absolute",
  left: 20,
  top: 20,
  zIndex: 1,
  opacity: 0.2,
  "&:hover": {
    opacity: 0.75
  },
  transition: "top linear 30ms, left linear 30ms, opacity 1s ease"
})
const Title = styled("div")({
  fontSize: 32,
  fontWeight: "bold",
  backgroundColor: "#000",
  padding: 16,
  color: "#fff"
})
const Details = styled("div")({
  display: "flex",
  "& > *": {
    backgroundColor: "#000",
    padding: 8,
    margin: 8,
    marginLeft: 0,
    marginBottom: 0
  },
  color: "#fff"
})
const EditableText = styled("input")({
  color: "inherit",
  backgroundColor: "inherit",
  fontWeight: "inherit",
  fontSize: "inherit",
  fontFamily: "inherit",
  border: "none"
})
const ClickableText = styled("div")({
  backgroundColor: "#000",
  cursor: "pointer",
  transition: "transform 120ms",
  "&:hover": {
    transform: "scale(1.1,1.1)"
  },
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center"
})
const Detail = styled("div")({
  backgroundColor: "#000",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center"
})
const RightSide = styled("div")({
  position: "absolute",
  right: 20,
  top: 20,
  zIndex: 1,
  opacity: 0.2,
  justifyContent: "flex-end",
  textAlign: "right",
  "&:hover": {
    opacity: 0.75
  },
  transition: "top linear 30ms, right linear 30ms, opacity 1s ease"
})

const Content = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  transition: "top linear 30ms, left linear 30ms"
})

const Href = styled("a")({
  textDecoration: "none",
  color: "inherit"
})

const possibleVisibilities = ["private", "public"]

export default ({
  children,
  onChangeVisibility,
  visibility,
  onChangeTitle,
  onChangeId,
  onCreateNew,
  onClone,
  id,
  title,
  treeOwnerName,
  currentUserAccountName,
  onLogOut
}) => {
  const contentRef = useRef()
  const [headerFocus, changeHeaderFocus] = useState(false)
  const [extendMode, changeExtendMode] = useLocalStorage("extendMode", false)
  let contentStyle = emptyObj
  let bgStyle = emptyObj
  let invBGStyle = emptyObj

  // TODO don't cause rerenders for mouse at top level
  const { docX = 0, docY = 0 } = useMouse(contentRef)

  const affX = -(docX - window.innerWidth / 2) * (EXTEND_AMOUNT - 1)
  const affY = -(docY - 50) * (EXTEND_AMOUNT - 1)

  if (extendMode) {
    contentStyle = { left: affX, top: affY }
    bgStyle = { left: affX * 0.5, top: 50 + affY * 0.5 }
    invBGStyle = { right: bgStyle.left * -1, top: bgStyle.top }
  }
  return (
    <Page>
      <Header
        onClick={() => changeHeaderFocus(true)}
        onMouseLeave={() => changeHeaderFocus(false)}
        style={!headerFocus ? bgStyle : { ...bgStyle, zIndex: 100, opacity: 1 }}
      >
        <Title>
          <EditableText value={title} />
        </Title>
        <Details>
          <div>
            {treeOwnerName} /{" "}
            <EditableText
              onChange={e => onChangeId(e.target.value)}
              value={id}
            />
          </div>
          <ClickableText
            onClick={() =>
              onChangeVisibility(
                possibleVisibilities[
                  (possibleVisibilities.indexOf(visibility) + 1) %
                    possibleVisibilities.length
                ]
              )
            }
          >
            {visibility}
          </ClickableText>
          <ClickableText onClick={onClone}>clone</ClickableText>
        </Details>
        <Details>
          <ClickableText onClick={() => changeExtendMode(!extendMode)}>
            extended: {extendMode ? "on" : "off"}
          </ClickableText>
        </Details>
      </Header>
      <RightSide
        onClick={() => changeHeaderFocus(true)}
        onMouseLeave={() => changeHeaderFocus(false)}
        style={
          !headerFocus ? invBGStyle : { ...invBGStyle, zIndex: 100, opacity: 1 }
        }
      >
        <Details style={{ fontSize: 18 }}>
          <ClickableText>
            <Href
              href="https://github.com/seveibar/worktree"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AutoIcon style={{ marginRight: 8 }} name="Github" />
              <b>Work Tree</b>
            </Href>
          </ClickableText>
          <ClickableText>
            <Href
              href="https://twitter.com/seveibar"
              style={{ display: "flex", alignItems: "center" }}
            >
              <AutoIcon style={{ marginRight: 8 }} name="Twitter" />
              <b>Updates</b>
            </Href>
          </ClickableText>
          {currentUserAccountName && (
            <>
              <Detail>@{currentUserAccountName}</Detail>
              <ClickableText onClick={onLogOut}>
                <ExitToAppIcon style={{}} />
              </ClickableText>
            </>
          )}
        </Details>
        <Details style={{ justifyContent: "flex-end" }}>
          <ClickableText onClick={onCreateNew}>
            <EditIcon style={{ marginRight: 8 }} />
            Edit
          </ClickableText>
          <ClickableText onClick={onCreateNew}>Create New</ClickableText>
        </Details>
      </RightSide>
      <Content id="page-content" style={contentStyle} ref={contentRef}>
        {children}
      </Content>
    </Page>
  )
}
