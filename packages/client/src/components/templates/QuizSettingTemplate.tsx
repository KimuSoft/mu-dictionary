import React, { useEffect, useMemo } from "react"
import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import Header from "../organisms/Header"
import { TagStatItem } from "../pages/Main"
import getTagData from "../../utils/getTagData"
import { motion } from "framer-motion"

const TagItem: React.FC<{
  tag: TagStatItem
  checked?: boolean
  onChange: (value: boolean, tag: string) => void
}> = ({ tag, checked, onChange }) => {
  const [isChecked, setIsChecked] = React.useState<boolean>(!!checked)

  useEffect(() => {
    setIsChecked(!!checked)
  }, [checked])

  const tagData = useMemo(() => {
    return getTagData(tag.tag)
  }, [tag.tag])

  return (
    <HStack
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      userSelect={"none"}
      bg={useColorModeValue(
        isChecked ? `${tagData.color}.400` : "gray.200",
        isChecked ? `${tagData.color}.500` : "gray.900",
      )}
      borderWidth={1}
      borderColor={`${tagData.color}.500`}
      borderRadius={5}
      cursor={"pointer"}
      transition={"background-color 0.2s"}
      _hover={{
        bg: useColorModeValue(
          isChecked ? `${tagData.color}.500` : "gray.300",
          isChecked ? `${tagData.color}.600` : "gray.800",
        ),
      }}
      px={3}
      py={2}
      onClick={() => {
        onChange(!isChecked, tag.tag)
        setIsChecked(!isChecked)
      }}
    >
      {tagData.icon && (
        <tagData.icon
          color={
            isChecked ? "white" : `var(--chakra-colors-${tagData.color}-500)`
          }
        />
      )}
      <Text fontSize={"md"} color={isChecked ? "white" : undefined}>
        {tag.tag}
      </Text>
      <Text
        fontSize={"sm"}
        color={isChecked ? `${tagData.color}.200` : "gray.500"}
      >
        {" "}
        · {tag.count}개
      </Text>
    </HStack>
  )
}

const QuizSettingTemplate: React.FC<{
  tags: TagStatItem[]
  onSelectedTagsChange: (tags: string[]) => void
  selectedTags: string[]
  onQuizStart: () => void
}> = ({ tags, onSelectedTagsChange, selectedTags, onQuizStart }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)")
  const [filterQuery, setFilterQuery] = React.useState("")

  const allCount = useMemo(
    () =>
      selectedTags.reduce((acc, cur) => {
        const tag = tags.find((t) => t.tag === cur)
        if (!tag) return acc
        return acc + tag.count
      }, 0),
    [selectedTags, tags],
  )

  const onTagChange = (value: boolean, tag: string) => {
    if (value) {
      onSelectedTagsChange([...selectedTags, tag])
    } else {
      onSelectedTagsChange(selectedTags.filter((t) => t !== tag))
    }
  }

  return (
    <>
      <Header showLogo />
      <VStack w={"100vw"} h={"100vh"}>
        <Container
          mt={"80px"}
          borderRadius={5}
          maxW={"3xl"}
          flexDir={"column"}
          display={"flex"}
          gap={3}
        >
          <Heading fontSize={"lg"} w={"100%"} textAlign={"center"}>
            도전! 키뮤사전 단어퀴즈
          </Heading>
          <Divider />
          <Input
            size={"sm"}
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderWidth={1}
            placeholder={"검색어를 입력해보세요"}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          <Box h={"65vh"} overflowY={"auto"}>
            <SimpleGrid
              w={"100%"}
              columns={isMobile ? 1 : 3}
              gridColumnGap={3}
              gridRowGap={2}
            >
              {tags.map((t) => {
                if (filterQuery && !t.tag.includes(filterQuery)) return null
                return (
                  <TagItem
                    key={t.tag}
                    checked={selectedTags.includes(t.tag)}
                    onChange={onTagChange}
                    tag={t}
                  />
                )
              })}
            </SimpleGrid>
          </Box>
          <HStack>
            <Button
              size={"sm"}
              w={"100%"}
              onClick={() => onSelectedTagsChange(tags.map((t) => t.tag))}
            >
              모두 선택하기
            </Button>
            <Button
              size={"sm"}
              w={"100%"}
              onClick={() => onSelectedTagsChange([])}
            >
              모두 선택 해제하기
            </Button>
          </HStack>
          <Button
            colorScheme={"green"}
            isDisabled={!selectedTags.length}
            onClick={onQuizStart}
          >
            퀴즈 시작 (최대 {allCount.toLocaleString()}문제)
          </Button>
        </Container>
      </VStack>
    </>
  )
}

export default QuizSettingTemplate
