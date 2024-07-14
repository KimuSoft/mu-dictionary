import DetailSection from "@/components/molecules/DetailSection"
import { VStack } from "@chakra-ui/react"
import React from "react"
import { Word } from "mudict-api-types"
import WordItem from "@/components/organisms/WordItem"
import { PiApproximateEqualsFill } from "react-icons/pi"

const HomonymSection: React.FC<{
  homonyms: Word[]
  colorScheme?: string
}> = ({ homonyms, colorScheme = "gray" }) => {
  if (!homonyms.length) return null

  return (
    <DetailSection
      title={"동음이의어 · 다의어"}
      icon={<PiApproximateEqualsFill />}
      colorScheme={colorScheme}
    >
      <VStack gap={0} mt={5} w={"100%"} px={3}>
        {homonyms.map((h) => (
          <WordItem key={h.id} word={h} keyword={""} />
        ))}
      </VStack>
    </DetailSection>
  )
}

export default HomonymSection
