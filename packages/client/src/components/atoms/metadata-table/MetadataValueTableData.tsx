import React, { useMemo } from "react"
import { Td } from "@chakra-ui/react"

const MetadataValueTableData: React.FC<{ value: any }> = ({ value }) => {
  const displayValue = useMemo(() => {
    if (Array.isArray(value)) return value.join(", ")
    if (typeof value === "number") return value.toString()
    if (value instanceof Date)
      return `${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`
    if (typeof value === "string") return value
    if (typeof value === "object") return JSON.stringify(value, null, 2)
    return value?.toString()
  }, [value])

  return <Td w={"100%"}>{displayValue}</Td>
}

export default MetadataValueTableData
