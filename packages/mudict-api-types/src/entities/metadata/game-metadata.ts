// 게임 메타데이터
export interface GameMetadata {
  // 등급
  rating: GameRating

  // 등급 세부기준
  ratingDetail: GameRatingDetail[]
}

// 등급분류
export enum GameRating {
  // 전체 이용가
  All = "ALL",
  // 12세 이용가
  Twelve = "TWELVE",
  // 15세 이용가
  Fifteen = "FIFTEEN",
  // 청소년 이용불가
  Restricted = "RESTRICTED",
  // 시험용
  Test = "TEST",
  // 등급 면제
  Exempt = "EXEMPT",
}

// 등급분류 세부기준 (게임)
export enum GameRatingDetail {
  // 선정성
  Violence = "VIOLENCE",
  // 폭력성 및 공포
  Horror = "HORROR",
  // 범죄 및 약물
  Crime = "CRIME",
  // 언어
  Language = "LANGUAGE",
  // 사행성
  Gambling = "GAMBLING",
}
