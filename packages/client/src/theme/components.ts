import { defineStyleConfig } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"

const components = {
  Input: defineStyleConfig({
    baseStyle: (props) => ({
      field: {
        bg: mode("gray.100", "gray.800")(props),
        borderWidth: "2px",
        borderColor: mode("gray.100", "gray.800")(props),
        borderRadius: 10,
        ":focus": {
          borderWidth: "2px",
          borderColor: mode("green.500", "green.400")(props),
        },
      },
    }),
    defaultProps: {
      variant: "custom",
    },
  }),
  Textarea: defineStyleConfig({
    baseStyle: (props) => ({
      borderRadius: 10,
      bg: mode("gray.100", "gray.800")(props),
    }),
    defaultProps: {
      variant: "custom",
    },
  }),
}

export default components
