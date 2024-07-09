// 영화 메타데이터
export interface MovieMetadata {
  // 감독
  director: string

  // 제작 국가
  productionCountry: string

  // 제작 상태
  productionStatus: MovieProductionStatus

  // 영화 유형
  movieType: MovieType
}

// 영화 제작 상태
export enum MovieProductionStatus {
  // 개봉 예정
  Scheduled = "SCHEDULED",

  // 개봉됨
  Released = "RELEASED",

  // 기타
  Other = "OTHER",
}

// 영화 유형
export enum MovieType {
  // 장편물
  Feature = "FEATURE",

  // 단편물
  Short = "SHORT",

  // 옴니버스
  Omnibus = "OMNIBUS",

  // 온라인전
  Online = "ONLINE",
}
