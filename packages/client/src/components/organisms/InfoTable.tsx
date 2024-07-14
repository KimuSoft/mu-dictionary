import React, { useMemo } from "react"
import { Metadata, Word } from "mudict-api-types"
import {
  Center,
  Heading,
  Image,
  Table,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Text,
  Tr,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { getMetadataKeyData } from "@/utils/getMetadataKeyString"
import { StaticMap } from "react-kakao-maps-sdk"
import MetadataKeyTableData from "@/components/atoms/metadata-table/MetadataKeyTableData"
import MetadataValueTableData from "@/components/atoms/metadata-table/MetadataValueTableData"
import MetadataBirthdayRow from "@/components/molecules/table/MetadataBirthdayRow"

const InfoTable: React.FC<
  TableContainerProps & { word: Word; colorScheme: string }
> = ({ word, colorScheme, ...props }) => {
  const { colorMode } = useColorMode()

  const keyBgColor = useMemo(
    () => (colorMode === "light" ? `${colorScheme}.100` : `${colorScheme}.600`),
    [colorMode, colorScheme],
  )

  const getRow = (key: string, value: Metadata[keyof Metadata]) => {
    const keyData = getMetadataKeyData(key)
    if (keyData?.hidden) return null

    return (
      <Tr key={key}>
        <MetadataKeyTableData metadataKey={key} colorScheme={colorScheme} />
        <MetadataValueTableData value={value} />
      </Tr>
    )
  }

  return (
    word.metadata && (
      <TableContainer
        flexShrink={0}
        borderRadius={5}
        overflow={"hidden"}
        {...props}
      >
        <Table size={"sm"} w={"100%"}>
          <Tbody>
            <Tr>
              <Td bgColor={keyBgColor} colSpan={2} py={2}>
                <VStack gap={1}>
                  <Heading fontSize={"lg"}>{word.name}</Heading>
                  {word.metadata.englishName && (
                    <Text fontSize={"sm"}>{word.metadata.englishName}</Text>
                  )}
                  {word.metadata.japaneseName && (
                    <Text fontSize={"sm"}>{word.metadata.japaneseName}</Text>
                  )}
                  {word.metadata.chineseName && (
                    <Text fontSize={"sm"}>{word.metadata.chineseName}</Text>
                  )}
                </VStack>
              </Td>
            </Tr>

            {word.thumbnail && (
              <Tr>
                <Td colSpan={2}>
                  <Center w={"100%"}>
                    <Image
                      src={word.thumbnail}
                      maxW={"100%"}
                      alt={word.name + " 이미지"}
                    />
                  </Center>
                </Td>
              </Tr>
            )}

            {word.metadata.longitude && word.metadata.latitude && (
              <Tr>
                <Td colSpan={2} p={0}>
                  <StaticMap
                    center={{
                      lat: word.metadata.latitude,
                      lng: word.metadata.longitude,
                    }}
                    marker={{
                      text: word.origin,
                      position: {
                        lat: word.metadata.latitude,
                        lng: word.metadata.longitude,
                      },
                    }}
                    style={{ width: "100%", height: "200px" }}
                    level={5}
                  />
                </Td>
              </Tr>
            )}

            <MetadataBirthdayRow
              colorScheme={colorScheme}
              metadata={word.metadata}
            />

            {/* metadata object (Record)를 Row로 변환 */}
            {Object.entries(word.metadata).map(([key, value]) =>
              getRow(key, value),
            )}
          </Tbody>
        </Table>
      </TableContainer>
    )
  )
}

export default InfoTable
