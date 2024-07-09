// 위치와 관련된 메타데이터
export interface PlaceMetadata {
  // 위도
  latitude: number
  // 경도
  longitude: number
  // 주소
  address: string
  // 운영 및 관리주체
  operator: string
  // 전화번호
  phoneNumber: string
}
