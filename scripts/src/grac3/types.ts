export interface GameRating {
  rateno: string; // 게임 평가 번호
  rateddate: string; // 평가 날짜
  gametitle: string; // 게임 제목
  orgname: string; // 게임 제작사 이름
  entname: string; // 게임 엔터테인먼트 회사 이름
  summary: string; // 게임 요약 설명
  givenrate: string; // 게임 등급 (예: "전체이용가", "청소년이용불가" 등)
  genre: string; // 게임 장르
  platform: string; // 게임 플랫폼 (예: "아케이드 게임")
  discriptors: string; // 게임 특징 또는 부가 설명
  cancelstatus: string; // 게임 취소 여부 (예: "False")
  canceleddate: string; // 게임 취소 날짜 (취소되지 않은 경우 빈 문자열)
}

export interface GameRatingResponse {
  result: {
    tcount: number; // 총 게임 수
    pageno: number; // 페이지 번호
    res_date: string; // 응답 날짜
    item: GameRating[]; // 게임 평가 정보 배열
  };
}
