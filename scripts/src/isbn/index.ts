import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { Logger } from "tslog";
import { loadCache, saveCache } from "../utils/cache";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";
import "dotenv/config";
import axios from "axios";
import { ISBNItem, ISBNSearchRequest, ISBNSearchResponse } from "./type";
import { josa } from "es-hangul";
import { uniq, uniqBy } from "lodash";

const REFERENCE_ID = "isbn";
const BASE_URL = "https://www.nl.go.kr/seoji/SearchApi.do";

const apiKey = process.env.ISBN_API_KEY;
const isReset = process.argv.includes("--reset");
const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const SUBSCRIBED_PUBLISHERS = [
  "대원씨아이",
  "학산문화사",
  "서울문화사",
  "디앤씨미디어",
  "AK 커뮤니케이션즈",
  "영상출판미디어",
  "소미미디어",
  "길찾기",
  "레진엔터테인먼트",
  "제우미디어",
  "네이버",
  "카카오",
  "문학동네",
  "북이십일",
  "예림당",
  "민음사",
];

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["책명"],
  },
};

const KDCSubjectToStr = (subjectCode: string | number) => {
  switch (parseInt(subjectCode.toString())) {
    case 0:
      return "총류";
    case 1:
      return "철학";
    case 2:
      return "종교";
    case 3:
      return "사회과학";
    case 4:
      return "자연과학";
    case 5:
      return "기술과학";
    case 6:
      return "예술";
    case 7:
      return "언어";
    case 8:
      return "문학";
    case 9:
      return "역사";
    default:
      return "기타";
  }
};

const run = async () => {
  let cache: ISBNItem[] = [];

  // isReset이 아니라면
  if (!isReset) {
    logger.info("Loading cache...");
    const cache$ = await loadCache<ISBNItem[]>(REFERENCE_ID);

    if (!cache$) {
      logger.warn(
        "Failed to load cache. Please run 'bun <Command> --reset' first.",
      );
      throw new Error("Failed to load cache.");
    }

    cache = cache$;
  }

  // API Fetch

  if (!apiKey) {
    logger.error("API Key is not provided.");
    throw new Error("API Key is not provided.");
  }

  const fetchNovelByPublisher = async (publisher: string) => {
    let page = 1;

    while (true) {
      const req: ISBNSearchRequest = {
        cert_key: apiKey,
        page_no: "1",
        page_size: "1000",
        // start_publish_date: "19990509",
        // end_publish_date: "20220509",
        result_style: "json",
        ebook_yn: "N",
      };

      logger.info(`Fetching page ${page++}...`);
      const res = await axios.post<ISBNSearchResponse>(
        `${BASE_URL}?cert_key=${req.cert_key}&result_style=${req.result_style}&page_no=${page}&page_size=${req.page_size}&ebook_yn=${req.ebook_yn}&publisher=${publisher}&sort=PUBLISH_PREDATE`,
      );

      if (!res.data.docs.length) break;

      cache.push(...res.data.docs);
    }
  };

  for (const publisher of SUBSCRIBED_PUBLISHERS) {
    // 캐시에 해당 출판사 책이 있다면 패스
    if (cache.some((item) => item.PUBLISHER.includes(publisher))) {
      logger.info(`Skipping ${publisher}...`);
      continue;
    }

    logger.info(`Fetching ${publisher}...`);
    await fetchNovelByPublisher(publisher);
    await saveCache(REFERENCE_ID, cache);
  }

  cache = uniqBy(cache, (item) => item.EA_ISBN || item.SET_ISBN);

  const failed: string[] = [];

  for (const item of cache) {
    const wordData = wordConvert(item.TITLE);

    const releaseYear = item.PUBLISH_PREDATE.slice(0, 4);

    const authors = item.AUTHOR.split(/[;,]/)
      .map((author) => author.split(":").reverse()[0]?.trim())
      .filter((author) => author);

    if (!authors.length) {
      if (item.AUTHOR.trim())
        console.warn(`No author found in '${item.AUTHOR}'`);
    }

    if (!wordData) {
      failed.push(item.TITLE);
      continue;
    }

    const authorStr = authors.length
      ? `${josa(authors.join(", "), "이/가")} 지은 `
      : "";

    result.items.push({
      ...wordData,
      definition: `${authorStr}${KDCSubjectToStr(item.SUBJECT)} 도서. ${item.PUBLISHER}에서 출판하였으며, ISBN은 '${item.EA_ISBN || item.SET_ISBN}'이다.`,
      sourceId: REFERENCE_ID + "_" + (item.EA_ISBN || item.SET_ISBN),
      url: item.PUBLISHER_URL || undefined,
      metadata: {
        publishers: [item.PUBLISHER],
        // authors,
        // isbn: item.EA_ISBN || item.SET_ISBN,
        releaseYear: parseInt(releaseYear) || undefined,
      },
    });
  }

  // 종료 단계
  logger.info("Exporting...");
  await exportMuDictJson(REFERENCE_ID, result);

  logger.info("Analyzing unknown words...");
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failed);

  logger.info("Done.");
};

run().then();
