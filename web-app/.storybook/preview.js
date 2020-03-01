import React from "react"
import { addDecorator } from "@storybook/react"

console.log("this is being run")

import ThemeProvider from "../src/components/ThemeProvider"

addDecorator(storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>)
