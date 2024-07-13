export interface ReferenceData {
  id: string
  title: string
  url: string
  condition?: string
}

export const referenceData: ReferenceData[] = [
  {
    id: "bus",
    title: "국토교통부: 전국 버스정류장 위치정보",
    url: "https://www.data.go.kr/data/15067528/fileData.do#tab-layer-file",
  },
  {
    id: "foodsafetykorea",
    url: "https://various.foodsafetykorea.go.kr/nutrient/general/down/historyList.do",
    title: "식품의약품안전처: 식품영양성분 데이터베이스 (K-FCDB)",
  },
  {
    id: "grac3",
    url: "https://www.grac.or.kr/Game3.0/OpenAPIGuide.aspx",
    title: "게임물관리위원회: 게임물3.0 API",
  },
  {
    id: "starrail",
    url: "https://hsr.hoyoverse.com/ko-kr/",
    title: "게임, '붕괴: 스타레일' 인게임 단어",
  },
  {
    id: "genshin",
    url: "https://genshin.hoyoverse.com/ko",
    title: "게임, '원신' 인게임 단어",
  },
  {
    id: "kind",
    url: "https://kind.krx.co.kr/corpgeneral/corpList.do?method=loadInitPage",
    title: "KIND 상장법인목록",
  },
  {
    id: "kobis",
    url: "https://www.kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do",
    title: "KOFIC 영화관 입장권 통합전산망",
  },
]

export const getReference = () => {}
