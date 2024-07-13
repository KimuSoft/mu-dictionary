import React from "react"
import {
  Divider,
  Heading,
  HStack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"

const DetailSection: React.FC<
  StackProps & {
    title: string
    colorScheme?: string
    icon?: React.ReactElement
  }
> = ({ title, colorScheme = "gray", icon, children, ...props }) => {
  return (
    <VStack gap={3} w={"100%"} alignItems={"flex-start"} {...props}>
      <HStack ml={"15px"} gap={3}>
        <Text
          fontSize={"18px"}
          color={`var(--chakra-colors-${colorScheme}-400)`}
        >
          {icon}
        </Text>
        <Heading fontSize={"xl"}>{title}</Heading>
      </HStack>
      <Divider />
      {children}
    </VStack>
  )
}

export default DetailSection
