import React from "react"
import { styled } from "@material-ui/core/styles"
import logoSrc from "../../logo.svg"
import { GoMarkGithub as GithubIcon } from "react-icons/go"
import { FaTwitter as TwitterIcon } from "react-icons/fa"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"

const Container = styled("div")({})
const Header = styled("div")({
  padding: 16,
  display: "flex",
  alignItems: "center",
  borderBottom: "4px solid #000"
})
const WorkTree = styled("div")({
  fontSize: 24,
  fontWeight: 900,
  color: "#000"
})
const HeaderIconButton = styled(IconButton)({})
const StyledButton = styled(Button)({
  textTransform: "none",
  fontWeight: 700,
  marginLeft: 8,
  marginRight: 8
})
const NavButtons = styled("div")({
  "& > *": {
    marginLeft: 8,
    marginRight: 8
  }
})
const ChildContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  padding: 32,
  "& h1": {},
  "& h2": {},
  "& p": {
    fontSize: 18
  }
})
const CenteredChildren = styled("div")({
  boxSizing: "border-box",
  width: "100%",
  maxWidth: 1200,
  minHeight: "80vh"
})
const Footer = styled("div")({
  fontSize: 12,
  marginTop: 40,
  color: "#888",
  textAlign: "center"
})

export default ({ children }) => {
  return (
    <Container>
      <Header>
        <img src={logoSrc} height={30} />
        <StyledButton href="/">
          <WorkTree>worktree.sh</WorkTree>
        </StyledButton>
        <div style={{ flexGrow: 1 }} />
        <NavButtons>
          <StyledButton href="/meters">Meters</StyledButton>
          <StyledButton href="/account">Account</StyledButton>
        </NavButtons>
        <HeaderIconButton href="https://github.com/seveibar/worktree">
          <GithubIcon />
        </HeaderIconButton>
        <HeaderIconButton href="https://twitter.com/seveibar">
          <TwitterIcon />
        </HeaderIconButton>
      </Header>
      <ChildContainer>
        <CenteredChildren>{children}</CenteredChildren>
        <Footer>
          By using this site, you agree to the{" "}
          <a style={{ color: "#888" }} href="/legal">
            Terms of Use
          </a>
          .
        </Footer>
      </ChildContainer>
    </Container>
  )
}
