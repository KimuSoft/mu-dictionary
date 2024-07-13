import DetailSection from "@/components/molecules/DetailSection"
import { Textarea } from "@chakra-ui/react"
import React from "react"
import { Word } from "mudict-api-types"
import { LuFileJson2 } from "react-icons/lu"

const MetadataSection: React.FC<{
  word: Word
  colorScheme?: string
}> = ({ word, colorScheme = "gray" }) => {
  return (
    <DetailSection
      title={"메타데이터"}
      icon={<LuFileJson2 />}
      colorScheme={colorScheme}
    >
      <Textarea h={"400px"} defaultValue={JSON.stringify(word, null, 2)} />
    </DetailSection>
  )
}

export default MetadataSection
