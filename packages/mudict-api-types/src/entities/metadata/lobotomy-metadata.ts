export interface LobotomyMetadata {
  // 환상체 등급
  lobotomyRating: LobotomyRating

  // 환상체 코드
  lobotomyCode: string
}

export enum LobotomyRating {
  // 자인
  Zayin = "ZAYIN",

  // 테스
  Teth = "TETH",

  // 헤
  He = "HE",

  // 바브
  Waw = "WAW",

  // 알레프
  Aleph = "ALEPH",
}
