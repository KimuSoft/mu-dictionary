// 콘텐츠 메타데이터
export interface ContentMetadata {
  // 출시 연도
  releaseYear: number

  // 성인물 여부
  isAdult: boolean

  // 출시일
  releaseDate: Date

  // 제작사
  developers: string[]

  // 유통사 및 배급사
  publishers: string[]

  // 장르
  genres: string[]

  // 요약
  summary: string

  // 자세한 소개 및 설명
  description: string
}
