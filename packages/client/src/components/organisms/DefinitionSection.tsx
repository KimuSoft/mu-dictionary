import DetailSection from "@/components/molecules/DetailSection"
import { FaRegQuestionCircle } from "react-icons/fa"
import { Text } from "@chakra-ui/react"
import { removeHTMLTags } from "@/utils/removeHTMLTags"
import React from "react"

const DefinitionSection: React.FC<{
  definition: string
  colorScheme?: string
}> = ({ definition, colorScheme = "gray" }) => {
  if (!definition) return null

  return (
    <DetailSection
      title={"정의"}
      icon={<FaRegQuestionCircle />}
      colorScheme={colorScheme}
    >
      <Text fontSize={"md"} textIndent={"15px"}>
        {removeHTMLTags(definition)}
      </Text>
    </DetailSection>
  )
}

export default DefinitionSection
