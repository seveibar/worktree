import React, { useState } from "react"
import TreePage from "./components/TreePage"
import ThemeProvider from "./components/ThemeProvider"
import { APIProvider } from "./hooks/use-api.js"
import { AccountProvider } from "./hooks/use-account.js"
import HomePage from "./components/HomePage"
import MeterPage from "./components/MeterPage"
import AccountPage from "./components/AccountPage"
import TermsPage from "./components/TermsPage"

const titles = {
  "/": "Work Tree",
  "/meters": "Work Tree Meters",
  "/account": "Work Tree Account",
  "/legal": "Work Tree Terms of Use"
}

function App() {
  const [route, changeRouteState] = useState(window.location.pathname)
  const changeRoute = (newRoute, title) => {
    changeRouteState(newRoute)
    window.history.pushState(
      {},
      title || titles[newRoute] || `${newRoute.slice(1)}`,
      newRoute
    )
  }

  if (route === "/") {
    return <HomePage onChangeRoute={changeRoute} />
  } else if (route === "/meters") {
    return <MeterPage onChangeRoute={changeRoute} />
  } else if (route === "/account") {
    return <AccountPage onChangeRoute={changeRoute} />
  } else if (route === "/legal") {
    return <TermsPage onChangeRoute={changeRoute} />
  }

  return <TreePage route={route} onChangeRoute={changeRoute} />
}

export default () => (
  <ThemeProvider>
    <APIProvider>
      <AccountProvider>
        <App />
      </AccountProvider>
    </APIProvider>
  </ThemeProvider>
)
