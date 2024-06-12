import { extendTheme } from "@chakra-ui/react"

import colors from "./colors"
import components from "./components"

export default extendTheme({
  colors,
  components,
  initialColorMode: "dark",
  useSystemColorMode: false,
  config: {
    disableTransitionOnChange: false,
  },
})
