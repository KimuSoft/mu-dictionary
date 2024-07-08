import axios, { isAxiosError } from "axios";
import { XMLParser } from "fast-xml-parser";
import { GameRating, GameRatingResponse } from "./types";
import { MuDict, PartOfSpeech } from "../types";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { readFile, writeFile } from "fs/promises";

const REFERENCE_ID = "grac3";
const ENDPOINT_URL =
  "https://www.grac.or.kr/WebService/GameSearchSvc.asmx/game";
// 요청 횟수
const REQUEST_LIMIT = 500;
// 한 번에 표시할 데이터 수 (최대 1000)
const REQUEST_DISPLAY = 500;
const REQUEST_INTERVAL = 500;

const useCache = !!process.argv[2];

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
  const games: GameRating[] = [];

  if (!useCache) {
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
          `Response ${currentCount}/${jsonRes.result.tcount} (${percentage}%)`,
        );

        games.push(...jsonRes.result.item);

        // 1000개 이하의 데이터가 올 경우 끝
        if (!jsonRes.result.tcount) {
          console.info("Final Api Response");
          break;
        }

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

    // 캐싱
    console.info("Caching...");
    await writeFile(
      `./src/grac3/${REFERENCE_ID}_cache.json`,
      JSON.stringify(games, null, 2),
    );
  } else {
    const cache = await readFile(
      `./src/grac3/${REFERENCE_ID}_cache.json`,
      "utf8",
    );
    games.push(...JSON.parse(cache));
  }

  const idSet = new Set<string>();

  // 응답 데이터 분석
  for (const i of games) {
    // 등급분류거부 데이터는 제외
    if (!i.rateno) continue;
    if (!i.gametitle) {
      console.warn(`이름 없는 게임 '${JSON.stringify(i)}'`);
      continue;
    }

    // 중복된 데이터 제외
    if (idSet.has(i.rateno)) {
      console.warn(`중복된 데이터 '${i.gametitle}'`);
      continue;
    }
    idSet.add(i.rateno);

    i.gametitle = i.gametitle.toString();

    const nameDataArr = i.gametitle
      .replace(/\)$/g, "")
      .split(/[()]/)
      .map((i) =>
        wordConvert(
          i.replace(/[<\[].+[>\]]/g, "").replace(/^(PC|PS[^_]*)_/g, ""),
        ),
      );

    const nameData = nameDataArr[0] || nameDataArr[1];

    if (!nameData) {
      failedItems.push(i);
      continue;
    }

    const tags = ["게임"];

    const subTag = i.platform.replace(/\//, "·").trim();
    if (subTag) tags.push("게임/" + subTag);

    result.items.push({
      sourceId: REFERENCE_ID + "_" + i.rateno,
      name: nameData.name,
      simplifiedName: nameData.simplifiedName,
      origin: nameData.origin,
      definition: `${i.rateddate.split("-")[0]}년 ${i.entname}에서 개발한 ${
        i.genre
      } ${i.platform} ${i.summary}. ${
        i.givenrate
      } 게임이며 등급분류번호는 ${i.rateno}이다.`,
      tags,
      url: `https://namu.wiki/w/${encodeURI(nameData.origin)}`,
    });
  }

  console.info("Saving...");
  await exportMuDictJson(REFERENCE_ID, result);

  // 실패한 아이템도 저장 writeFile
  await writeFile(
    `./${REFERENCE_ID}_failed.json`,
    JSON.stringify(failedItems, null, 2),
  );
};

run().then(() => console.info("Done!"));
