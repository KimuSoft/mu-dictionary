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
import { useNavigate } from "react-router-dom"
import SearchInput from "./SearchInput"

const Header: React.FC<
  StackProps & {
    showLogo?: boolean
    showSearch?: boolean
    searchProps?: Omit<InputProps, "onChange" | "onSubmit">
  }
> = ({ showLogo, showSearch, searchProps, ...props }) => {
  // 세로화면인지 확인ㅇ
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const navigate = useNavigate()

  const onSearch = async (keyword: string) => {
    if (!keyword) return
    navigate("/search?q=" + encodeURIComponent(keyword))
  }

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
          size={"lg"}
          userSelect={"none"}
          cursor={"pointer"}
          ml={3}
          onClick={() => navigate("/")}
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
          onSubmit={onSearch}
          {...searchProps}
        />
      )}
      <ToggleColorModeButton />
    </HStack>
  )
}

export default Header
