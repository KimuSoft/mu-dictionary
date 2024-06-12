import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Router from "./router"
import { ChakraProvider } from "@chakra-ui/react"
import customTheme from "./theme/customTheme"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={customTheme}>
      <Router />
    </ChakraProvider>
  </React.StrictMode>,
)
