export const tagData = [
  {
    // 게임
    code: "game",
    regex: /(비디오|안드로이드|모바일|IOS) 게임$/i,
  },
  {
    // 방송 프로그램
    code: "tv",
    regex:
      /드라마$|텔레비전 프로그램$|애니메이션$|넷플릭스 오리지널 프로그램$/i,
  },
  {
    // 애니메이션
    code: "ani",
    regex: /애니메이션( 영화)?$/i,
  },
  {
    // 책명+
    code: "book",
    regex: /만화$|책$|소설$/i,
  },
  {
    // 만화
    code: "comic",
    regex: /만화$|웹툰$/i,
  },
  {
    // 인명+
    code: "person",
    regex: /년 출생$/i,
  },
]

export interface WikiDoc {
  name: string
  definition: string
  tags: string[]
}
