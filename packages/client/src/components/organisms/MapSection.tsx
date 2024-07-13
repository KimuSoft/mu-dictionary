import DetailSection from "@/components/molecules/DetailSection"
import { FaCloud, FaMap, FaRoad } from "react-icons/fa"
import React from "react"
import { Word } from "mudict-api-types"
import {
  CustomOverlayMap,
  Map,
  MapTypeId,
  Roadview,
  useKakaoLoader,
} from "react-kakao-maps-sdk"
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  IconButton,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import { FaLocationDot } from "react-icons/fa6"
import { motion } from "framer-motion"
import { useRouter } from "next-nprogress-bar"
import { getMapLinkData } from "@/utils/getMapLinkData"
import NextLink from "next/link"
import { SiGooglemaps, SiKakaotalk, SiNaver } from "react-icons/si"

export enum MapType {
  ROADMAP = 1,
  SKYVIEW = 2,
  HYBRID = 3,
  OVERLAY = 4,
  ROADVIEW = 5,
  TRAFFIC = 6,
  TERRAIN = 7,
  BICYCLE = 8,
  BICYCLE_HYBRID = 9,
  USE_DISTRICT = 10,
}

const KakaoMap: React.FC<{
  latitude: number
  longitude: number
  placeName: string
  colorScheme: string
  mapType?: MapType
}> = ({
  latitude,
  longitude,
  placeName,
  colorScheme,
  mapType = MapType.HYBRID,
}) => {
  const [initialMap] = React.useState<{
    location: { lat: number; lng: number }
    zoom: number
  }>({
    location: { lat: latitude, lng: longitude },
    zoom: 3,
  })

  const [map, setMap] = React.useState<{
    location: { lat: number; lng: number }
    zoom: number
  }>({
    location: { lat: latitude, lng: longitude },
    zoom: 3,
  })

  const resetLocation = () => setMap(initialMap)

  return (
    <Map
      id={"map"}
      center={map.location}
      isPanto={false}
      style={{ width: "100%", height: "100%" }}
      level={map.zoom}
      onZoomChanged={(map) => {
        setMap({
          location: {
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          },
          zoom: map.getLevel(),
        })
      }}
      onCenterChanged={(map) => {
        setMap({
          location: {
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          },
          zoom: map.getLevel(),
        })
      }}
    >
      {/* @ts-ignore */}
      <MapTypeId type={mapType} />
      <CustomOverlayMap position={initialMap.location}>
        <Tooltip label={placeName} hasArrow>
          <Center
            as={motion.div}
            whileHover={{ scale: 1.1 }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            p={3}
            bgColor={`${colorScheme}.300`}
            boxShadow={"md"}
            borderRadius={"50%"}
            onClick={() => resetLocation()}
          >
            <FaLocationDot color={"#fff"} size={20} />
          </Center>
        </Tooltip>
      </CustomOverlayMap>
    </Map>
  )
}

const MapSection: React.FC<{
  word: Word
  colorScheme?: string
}> = ({ word, colorScheme = "gray" }) => {
  const { colorMode } = useColorMode()
  const { push } = useRouter()

  useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_KEY as string,
    libraries: ["services", "drawing"],
  })

  const mapLinkData = getMapLinkData(
    word.metadata?.latitude || 0,
    word.metadata?.longitude || 0,
  )

  const [mapType, setMapType] = React.useState<MapType>(MapType.ROADMAP)

  if (!(word.metadata && word.metadata.longitude && word.metadata.latitude))
    return null

  return (
    <DetailSection title={"위치"} icon={<FaMap />} colorScheme={colorScheme}>
      <Box
        w={"100%"}
        h={"400px"}
        borderRadius={5}
        bgColor={colorMode === "light" ? "gray.200" : "gray.700"}
        position={"relative"}
      >
        <HStack position={"absolute"} right={3} bottom={3} zIndex={1000}>
          <IconButton
            aria-label={"map"}
            size={"sm"}
            colorScheme={mapType === MapType.ROADMAP ? colorScheme : "gray"}
            icon={<FaMap />}
            onClick={() => {
              setMapType(MapType.ROADMAP)
            }}
          />
          <IconButton
            aria-label={"skyview"}
            size={"sm"}
            colorScheme={mapType === MapType.HYBRID ? colorScheme : "gray"}
            icon={<FaCloud />}
            onClick={() => {
              setMapType(MapType.HYBRID)
            }}
          />
          <IconButton
            aria-label={"road_view"}
            size={"sm"}
            colorScheme={mapType === MapType.ROADVIEW ? colorScheme : "gray"}
            icon={<FaRoad />}
            onClick={() => {
              setMapType(MapType.ROADVIEW)
            }}
          />
        </HStack>
        {mapType !== MapType.ROADVIEW ? (
          <KakaoMap
            latitude={word.metadata.latitude}
            longitude={word.metadata.longitude}
            placeName={word.origin}
            colorScheme={colorScheme}
            mapType={mapType}
          />
        ) : (
          <Roadview
            position={{
              lat: word.metadata.latitude,
              lng: word.metadata.longitude,
              radius: 50,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Box>
      <ButtonGroup size={"sm"} w={"100%"} colorScheme={colorScheme} isAttached>
        <Button
          onClick={() => push(mapLinkData.kakaoMap)}
          w={"100%"}
          colorScheme={"yellow"}
          leftIcon={<SiKakaotalk />}
        >
          카카오맵
        </Button>
        <Button
          onClick={() => push(mapLinkData.naverMap)}
          w={"100%"}
          colorScheme={"green"}
          leftIcon={<SiNaver />}
        >
          네이버맵
        </Button>
        <Button
          onClick={() => push(mapLinkData.googleMap)}
          w={"100%"}
          bgColor={"gray"}
          _hover={{ bgColor: "gray" }}
          leftIcon={<SiGooglemaps />}
        >
          구글맵
        </Button>
        <Button
          as={NextLink}
          ml={2}
          href={mapLinkData.kakaoRoadView}
          w={"100%"}
          colorScheme={"yellow"}
        >
          카카오맵 로드뷰
        </Button>
      </ButtonGroup>
    </DetailSection>
  )
}

export default MapSection
