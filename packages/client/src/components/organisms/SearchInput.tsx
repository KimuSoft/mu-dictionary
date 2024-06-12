import React from "react"
import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiSearch } from "react-icons/bi"

const SearchInput: React.FC<
  {
    onChange?: (value: string) => unknown
    onSubmit?: (value: string) => unknown
  } & Omit<InputProps, "onChange" | "onSubmit">
> = ({ onChange, onSubmit, ...props }) => {
  const [searchQuery, setSearchQuery] = React.useState("")

  const _onChange = (value: string) => {
    setSearchQuery(value)
    onChange?.(value)
  }

  return (
    <InputGroup w={props.w || props.width || "100%"} size={props.size}>
      <Input
        bgColor={useColorModeValue("gray.200", "gray.700")}
        borderColor={useColorModeValue("gray.200", "gray.700")}
        onChange={(e) => _onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit?.(searchQuery)
          }
        }}
        {...props}
      />
      <InputRightElement>
        <BiSearch />
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput
