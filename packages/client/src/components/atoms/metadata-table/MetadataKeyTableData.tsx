import { Td, useColorMode } from "@chakra-ui/react"
import { getMetadataKeyString } from "@/utils/getMetadataKeyString"
import React, { useMemo } from "react"

const MetadataKeyTableData: React.FC<{
  colorScheme: string
  metadataKey: string
}> = ({ colorScheme, metadataKey }) => {
  const { colorMode } = useColorMode()

  const keyBgColor = useMemo(
    () => (colorMode === "light" ? `${colorScheme}.100` : `${colorScheme}.600`),
    [colorMode, colorScheme],
  )

  return (
    <Td
      w={"160px"}
      fontWeight={"600"}
      bgColor={keyBgColor}
      textAlign={"center"}
    >
      {getMetadataKeyString(metadataKey)}
    </Td>
  )
}

export default MetadataKeyTableData
