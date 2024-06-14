// 게임물관리위원회 게임물3.0 API로부터 모든 게임을 가져와 키뮤사전 형태로 저장한다.

import axios, { getAdapter, isAxiosError } from "axios";
import { XMLParser } from "fast-xml-parser";
import { GameRating, GameRatingResponse } from "./types";
import { MuDict, PartOfSpeech } from "../types";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { writeFile } from "fs/promises";

const REFERENCE_ID = "grac3";
const ENDPOINT_URL =
  "https://www.grac.or.kr/WebService/GameSearchSvc.asmx/game";
// 요청 횟수
const REQUEST_LIMIT = 500;
// 한 번에 표시할 데이터 수 (최대 1000)
const REQUEST_DISPLAY = 500;
const REQUEST_INTERVAL = 500;

const result: MuDict = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    pos: PartOfSpeech.Noun,
  },
};

const failedItems: GameRating[] = [];

const parser = new XMLParser();

const run = async () => {
  // 요청 횟수만큼 반복문
  for (let i = 0; i < REQUEST_LIMIT; i++) {
    try {
      console.info(`Requesting ${i + 1}...`);

      // Grac3 API 요청
      const res = await axios.get(ENDPOINT_URL, {
        params: {
          display: REQUEST_DISPLAY,
          pageno: i + 1,
        },
      });

      // XML 파싱
      const jsonRes = parser.parse(res.data) as GameRatingResponse;

      if (!jsonRes.result?.item) {
        break;
      }

      const currentCount = (REQUEST_DISPLAY + 1) * i;
      const totalCount = jsonRes.result.tcount;
      const percentage = ((currentCount / totalCount) * 100).toFixed(2);
      console.info(
        `Response ${currentCount}/${jsonRes.result.tcount} (${percentage}%)`
      );

      // 응답 데이터 분석
      for (const i of jsonRes.result.item) {
        // 등급분류거부 데이터는 제외
        if (!i.rateno) continue;
        if (!i.gametitle) {
          console.warn(`이름 없는 게임 '${JSON.stringify(i)}'`);
          continue;
        }

        i.gametitle = i.gametitle.toString();

        const namedatas = i.gametitle
          .replace(/\)$/g, "")
          .split(/[()]/)
          .map((i) => wordConvert(i.replace(/[<\[].+[>\]]/g, "")));

        const namedata = namedatas[0] || namedatas[1];

        if (!namedata) {
          failedItems.push(i);
          continue;
        }

        result.items.push({
          name: namedata.name,
          simplifiedName: namedata.simplifiedName,
          origin: namedata.origin,
          definition: `${i.rateddate.split("-")[0]}년 ${i.entname}에서 개발한 ${
            i.genre
          } ${i.platform} ${i.summary}. ${
            i.givenrate
          } 게임이며 등급분류번호는 ${i.rateno}이다.`,
          tags: ["게임", i.platform],
          url: `https://namu.wiki/w/${encodeURI(namedata.origin)}`,
        });
      }

      // 1000개 이하의 데이터가 올 경우 끝
      if (!jsonRes.result.tcount) {
        console.info("Final Api Response");
        break;
      }

      // INTERVAL만큼 요청 대기
      await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL));
    } catch (e) {
      if (!isAxiosError(e)) {
        console.error(e);
        break;
      }

      // Axios 에러 핸들링
      if (e.response?.status === 500) {
        console.error(e.response?.data);
        continue;
      }

      console.error(e);
      break;
    }
  }

  console.info("Saving...");
  await exportMuDictJson(REFERENCE_ID, result);

  // 실패한 아이템도 저장 writeFile
  await writeFile(
    `./${REFERENCE_ID}_failed.json`,
    JSON.stringify(failedItems, null, 2)
  );
};

run().then(() => console.info("Done!"));
