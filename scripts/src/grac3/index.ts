// 게임물관리위원회 게임물3.0 API로부터 모든 게임을 가져와 키뮤사전 형태로 저장한다.

import axios, { isAxiosError } from "axios";

const ENDPOINT_URL =
  "https://www.grac.or.kr/WebService/GameSearchSvc.asmx/game";
// 요청 횟수
const REQUEST_LIMIT = 1000;

const run = async () => {
  // 요청 횟수만큼 반복문
  for (let i = 0; i < REQUEST_LIMIT; i++) {
    try {
      const res = await axios.get(ENDPOINT_URL, {
        params: {
          display: 1000,
          pageno: i + 1,
        },
      });

      console.log(res.data);
      break;
    } catch (e) {
      if (!isAxiosError(e)) {
        console.error(e);
        break;
      }

      // Axios 에러 핸들링
    }
  }
};

run().then();
