import React, { useMemo } from "react"
import MetadataKeyTableData from "@/components/atoms/metadata-table/MetadataKeyTableData"
import { Td, Text, Tr } from "@chakra-ui/react"
import { Metadata } from "mudict-api-types"

const MetadataBirthdayRow: React.FC<{
  metadata: Metadata
  colorScheme: string
}> = ({ colorScheme, metadata }) => {
  if (
    !metadata.birthDate &&
    !metadata.birthMonth &&
    !metadata.birthYear &&
    !metadata.birthDay
  )
    return null

  const birthDayText = useMemo(() => {
    const texts: string[] = []

    // Date가 있다면 그걸 '~년 ~월 ~일' 형태로 그냥 변환해서 리턴
    if (metadata.birthDate) {
      const date = new Date(metadata.birthDate)
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    }

    if (metadata.birthYear) texts.push(`${metadata.birthYear}년`)
    if (metadata.birthMonth) texts.push(`${metadata.birthMonth}월`)
    if (metadata.birthDay) texts.push(`${metadata.birthDay}일`)

    return texts.join(" ")
  }, [metadata])

  return (
    <Tr>
      <MetadataKeyTableData colorScheme={colorScheme} metadataKey={"생일"} />
      <Td w={"100%"}>
        <Text>{birthDayText}</Text>
      </Td>
    </Tr>
  )
}

export default MetadataBirthdayRow
