import { Metadata } from "mudict-api-types"
import { ReactElement } from "react"

const metadataKeyData: {
  key: keyof Metadata
  displayName: string
  icon?: ReactElement

  // 테이블에서 숨길 정보
  hidden?: boolean
}[] = [
  { key: "address", displayName: "주소" },
  { key: "latitude", displayName: "위도" },
  { key: "longitude", displayName: "경도" },
  { key: "phoneNumber", displayName: "전화번호" },
  { key: "operator", displayName: "운영주체" },
  { key: "busStopCode", displayName: "정류장번호" },
  { key: "busStopMobileNumber", displayName: "정류장 모바일단축번호" },
  { key: "publishers", displayName: "출판사" },
  { key: "releaseYear", displayName: "출시 연도" },
  { key: "sex", displayName: "성별" },
  { key: "height", displayName: "키" },
  { key: "birthDate", displayName: "생일", hidden: true },
  { key: "birthYear", displayName: "출생연도", hidden: true },
  { key: "birthMonth", displayName: "태어난 달", hidden: true },
  { key: "birthDay", displayName: "태어난 날", hidden: true },
  { key: "bloodType", displayName: "혈액형" },
  { key: "japaneseName", displayName: "일본어 명칭", hidden: true },
  { key: "englishName", displayName: "영어 명칭", hidden: true },
  { key: "japaneseVoiceActor", displayName: "일본어 성우" },
]

export const getMetadataKeyData = (key: string) => {
  return metadataKeyData.find((metadata) => metadata.key === key)
}

export const getMetadataKeyString = (key: string) => {
  const metadataKeyString = metadataKeyData.find(
    (metadata) => metadata.key === key,
  )

  return metadataKeyString?.displayName || key
}
