import React from "react"
import {
  Heading,
  HStack,
  InputProps,
  Spacer,
  StackProps,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react"
import ToggleColorModeButton from "../molecules/ToggleColorModeButton"
import SearchInput from "./SearchInput"
import NextLink from "next/link"

const Header: React.FC<
  StackProps & {
    showLogo?: boolean
    showSearch?: boolean
    searchProps?: Omit<InputProps, "onChange" | "onSubmit">
  }
> = ({ showLogo, showSearch, searchProps, ...props }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  return (
    <HStack
      w={"100vw"}
      position={"fixed"}
      px={isMobile ? 3 : 9}
      py={3}
      bgColor={useColorModeValue("white", "gray.800")}
      zIndex={100}
      {...props}
    >
      {showLogo ? (
        <Heading
          as={NextLink}
          size={"lg"}
          userSelect={"none"}
          cursor={"pointer"}
          ml={3}
          href={"/"}
        >
          {isMobile ? "μD" : "μDict"}
        </Heading>
      ) : null}
      <Spacer />
      {showSearch && (
        <SearchInput
          size={"sm"}
          w={isMobile ? "100%" : "300px"}
          placeholder={"단어 무더기에서 원하는 거 찾기"}
          {...searchProps}
        />
      )}
      <ToggleColorModeButton />
    </HStack>
  )
}

export default Header
