# mu-dictionary
우리만의 조금 특별한 사전

![image](https://user-images.githubusercontent.com/47320945/194694784-b586fd7b-0613-4d67-afff-92badc5c9c67.png)

![image](https://user-images.githubusercontent.com/47320945/194694781-a9c792e7-2236-4ab0-8975-2e79750fe65a.png)

## TO-DO
* [ ] MeiliSearch 연동 검색 API 구현
* [ ] 기본 검색 API 구현
* [ ] 검색 OPEN API SPEC 구현
* [ ] MeiliSearch 활용 자동완성 구현

## 단어 출처
* [x] (일반어) [우리말샘 사전](https://opendict.korean.go.kr/member/memberDownloadList) 데이터베이스
* [x] (식품) [식품영양성분 데이터베이스](https://various.foodsafetykorea.go.kr/nutrient/general/down/list.do)
* [x] (교통) [전국대중교통환승센터표준데이터](https://www.data.go.kr/data/15034541/standard.do)
* [ ] (교통) [Kric 전국도시철도노선정보표준데이터](https://data.kric.go.kr/rips/M_01_01/detail.do?id=18)
* [ ] (교통) [Kric 전국도시철도역사정보표준데이터](https://data.kric.go.kr/rips/M_01_01/detail.do?id=32)
* [ ] (교통) [국토교통부: 전국 버스정류장 위치정보](https://www.data.go.kr/data/15067528/fileData.do)
* [ ] (교육) [전국도서관표준데이터](https://www.data.go.kr/data/15013109/standard.do)
* [ ] (교육) [나이스 학교기본정보](https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN17020190531110010104913&infSeq=3&cateId=A0001)
* [ ] (교육) [전국대학및전문대학정보표준데이터](https://www.data.go.kr/data/15107736/standard.do)
* [x] (영화) [KOBIS 영화관입장권통합전산망](https://www.kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do)
* [x] (게임) [게임물관리위원회 게임물 3.0 API](https://www.grac.or.kr/Game3.0/OpenAPIGuide.aspx)
* [x] (기업) [KIND 상장법인목록](https://kind.krx.co.kr/corpgeneral/corpList.do?method=loadInitPage)
* [x] (원신) [GenshinData](https://github.com/Masterain98/GenshinData/blob/main/TextMap/TextMapKR.json)
* [x] (애니메이션) [Laftel](https://www.laftel.net/)

## 도커 세팅
* 빌드에서 세팅까지 한 방에!
```shell
docker-compose up -d --build

# 디버그 시
docker-compose -f docker-compose.dev.yml up -d
```

## DB 관리
### 특정 출처 삭제하기
```shell
use mudictionary
db.words.deleteMany({reference: "출처 코드"})
```