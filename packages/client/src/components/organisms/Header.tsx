import React from "react"
import {
  Heading,
  HStack,
  InputProps,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react"
import ToggleColorModeButton from "../molecules/ToggleColorModeButton"
import { useNavigate } from "react-router-dom"
import SearchInput from "./SearchInput"

const Header: React.FC<{
  showLogo?: boolean
  showSearch?: boolean
  searchProps?: Omit<InputProps, "onChange" | "onSubmit">
}> = ({ showLogo, showSearch, searchProps }) => {
  const navigate = useNavigate()

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search?q=" + encodeURIComponent(keyword))
  }

  return (
    <HStack
      w={"100%"}
      position={"fixed"}
      px={12}
      py={3}
      bgColor={useColorModeValue("white", "gray.800")}
      zIndex={100}
      // borderColor={useColorModeValue("gray.200", "gray.700")}
      // borderBottom={"1px solid"}
    >
      {showLogo && (
        <Heading
          size={"lg"}
          userSelect={"none"}
          cursor={"pointer"}
          onClick={() => navigate("/")}
          mr={5}
        >
          μDict
        </Heading>
      )}
      <Spacer />
      {showSearch && (
        <SearchInput
          size={"sm"}
          w={"300px"}
          placeholder={"단어 무더기에서 원하는 거 찾기"}
          onSubmit={onSearch}
          {...searchProps}
        />
      )}
      <ToggleColorModeButton />
    </HStack>
  )
}

export default Header
