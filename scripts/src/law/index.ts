import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { PartOfSpeech } from "mudict-api-types";
import { Logger } from "tslog";
import { loadCache, saveCache } from "../utils/cache";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { LawItem, LawSearchResponse, LocalLawItem, RuleItem } from "./types";
import removeBraket from "../utils/removeBraket";
import { josa } from "es-hangul";
import { uniqBy } from "lodash";

const REFERENCE_ID = "law";

const isReset = process.argv.includes("--reset");
const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["법률"],
  },
};

const apiKey = process.env.LAW_API_KEY;
const LAW_API_URL = "http://apis.data.go.kr/1170000/law/lawSearchList.do";

const parser = new XMLParser();

const fetchAll = async <T>(target: "law" | "admrul" | "ordin") => {
  const laws: T[] = [];

  let page = 0;
  while (true) {
    logger.info(`Fetching ${target} page ${page + 1}...`);
    const res = await axios.get(LAW_API_URL, {
      params: {
        serviceKey: apiKey,
        target: target,
        query: "*",
        numOfRows: 10000,
        pageNo: ++page,
      },
    });

    const data = parser.parse(res.data) as LawSearchResponse;

    if (!data) break;

    if (data.LawSearch) {
      if (!data.LawSearch.law?.length) break;
      // @ts-ignore
      laws.push(...data.LawSearch.law);
    }

    if (data.AdmRulSearch) {
      if (!data.AdmRulSearch.admrul?.length) break;
      // @ts-ignore
      laws.push(...data.AdmRulSearch.admrul);
    }

    if (data.OrdinSearch) {
      if (!data.OrdinSearch.law?.length) break;
      // @ts-ignore
      laws.push(...data.OrdinSearch.law);
    }
  }

  return laws;
};

export interface LawCache {
  laws: LawItem[];
  rules: RuleItem[];
  localLaws: LocalLawItem[];
}

// 20192225 처럼 숫자로 된 데이터를 Date로 변환
const convertNumericData = (numDate: number) => {
  const strDate = numDate.toString();
  return new Date(
    parseInt(strDate.slice(0, 4)),
    parseInt(strDate.slice(4, 6)) - 1,
    parseInt(strDate.slice(6, 8)),
  );
};

const run = async () => {
  let cache: LawCache = {
    laws: [],
    rules: [],
    localLaws: [],
  };

  if (!LAW_API_URL) {
    throw new Error("LAW_API_KEY is not defined.");
  }

  // isReset이 아니라면
  if (!isReset) {
    logger.info("Loading cache...");
    const cache$ = await loadCache<LawCache>(REFERENCE_ID);

    if (!cache$) {
      logger.warn(
        "Failed to load cache. Please run 'bun <Command> --reset' first.",
      );
      throw new Error("Failed to load cache.");
    }

    cache = cache$;
  }

  if (isReset) {
    cache.laws = await fetchAll<LawItem>("law");
    await saveCache(REFERENCE_ID, cache);
    cache.rules = await fetchAll<RuleItem>("admrul");
    await saveCache(REFERENCE_ID, cache);
    cache.localLaws = await fetchAll<LocalLawItem>("ordin");
    await saveCache(REFERENCE_ID, cache);
  }

  const failed: string[] = [];

  // 법령 처리
  logger.info("Processing laws...", cache.laws.length);
  for (const item of cache.laws) {
    const wordData = wordConvert(removeBraket(item.법령명한글));

    if (!wordData) {
      failed.push(item.법령명한글);
      continue;
    }

    const metadata = {
      lawId: item.법령ID || undefined,
      promulgationDate: convertNumericData(item.공포일자) || undefined,
      promulgationNumber: item.공포번호 || undefined,
      promulgationDivision: item.제개정구분명 || undefined,
      departmentCode: item.소관부처코드 || undefined,
      departmentName: item.소관부처명 || undefined,
      lawDivision: item.법령구분명 || undefined,
      jointOrderInfo: item.공동부령정보 || undefined,
      enforcementDate: convertNumericData(item.시행일자) || undefined,
      isSelfLaw: item.자법타법여부 || undefined,
      abbreviation: item.법령약칭명 || undefined,
    };

    const tags = ["법률", "법률/법령"];

    let definition = "";

    if (item.법령명한글.endsWith("시행령")) {
      definition = `'${item.법령명한글.replace(/시행령$/, "").trim()}'에서 위임된 사항과 그 시행에 필요한 규정을 담고 있는 명령.`;
    } else if (item.법령명한글.endsWith("시행규칙")) {
      definition = `'${item.법령명한글.replace(/시행규칙$/, "").trim()}'과 같은 법 시행령의 시행에 관한 사항을 상세히 규정한 규칙.`;
    } else {
      const promulgationDateStr = `${metadata.promulgationDate.getFullYear()}년 ${metadata.promulgationDate.getMonth() + 1}월 ${metadata.promulgationDate.getDate()}일`;
      const enforcementDateStr = `${metadata.enforcementDate.getFullYear()}년 ${metadata.enforcementDate.getMonth() + 1}월 ${metadata.enforcementDate.getDate()}일`;
      definition = `${metadata.departmentName}에서 소관하는 대한민국의 ${josa(metadata.lawDivision, "으로/로")}로, ${promulgationDateStr}에 공포되어 ${enforcementDateStr}에 시행되었다.`;
    }

    if (metadata.lawDivision) {
      tags.push(`법률/${metadata.lawDivision}`);
    }

    const url = "https://www.law.go.kr/" + item.법령상세링크;

    result.items.push({
      ...wordData,
      definition,
      sourceId: `${REFERENCE_ID}_law_${item.법령일련번호}`,
      url,
      tags,
      // @ts-ignore
      metadata,
    });

    if (item.법령약칭명) {
      const wordData = wordConvert(item.법령약칭명);

      if (!wordData) {
        failed.push(item.법령약칭명);
        continue;
      }

      result.items.push({
        ...wordData,
        definition: `'${item.법령명한글}'의 약칭.`,
        sourceId: `${REFERENCE_ID}_law_short_${item.법령일련번호}`,
        url,
        tags: [...tags, "법률/약칭"],
        // @ts-ignore
        metadata,
      });
    }
  }

  // 행정규칙 처리
  logger.info("Processing rules...", cache.rules.length);
  for (const item of cache.rules) {
    const wordData = wordConvert(removeBraket(item.행정규칙명));

    if (!wordData) {
      failed.push(item.행정규칙명);
      continue;
    }

    const metadata = {
      ruleId: item.행정규칙ID || undefined,
      promulgationDate: convertNumericData(item.발령일자) || undefined,
      promulgationNumber: item.발령번호 || undefined,
      departmentName: item.소관부처명 || undefined,
      promulgationDivision: item.제개정구분명 || undefined,
      enforcementDate: convertNumericData(item.시행일자) || undefined,
    };

    const tags = ["법률", "법률/행정규칙"];

    if (item.행정규칙종류) {
      tags.push(`법률/${item.행정규칙종류}`);
    }

    let definition = "";

    if (item.행정규칙명.endsWith("시행규칙")) {
      definition = `'${item.행정규칙명.replace(/시행규칙$/, "").trim()}'과 같은 법 시행령의 시행에 관한 사항을 상세히 규정한 규칙.`;
    } else {
      const promulgationDateStr = `${metadata.promulgationDate.getFullYear()}년 ${metadata.promulgationDate.getMonth() + 1}월 ${metadata.promulgationDate.getDate()}일`;
      const enforcementDateStr = `${metadata.enforcementDate.getFullYear()}년 ${metadata.enforcementDate.getMonth() + 1}월 ${metadata.enforcementDate.getDate()}일`;
      definition = `${metadata.departmentName}에서 소관하는 대한민국의 행정규칙으로, ${promulgationDateStr}에 공포되어 ${enforcementDateStr}에 시행되었다.`;
    }

    const url = "https://www.law.go.kr/" + item.행정규칙상세링크;

    result.items.push({
      ...wordData,
      definition,
      sourceId: `${REFERENCE_ID}_rule_${item.행정규칙일련번호}`,
      url,
      tags,
      // @ts-ignore
      metadata,
    });
  }

  // 자치법규
  logger.info("Processing local laws...", cache.localLaws.length);
  for (const item of cache.localLaws) {
    const wordData = wordConvert(removeBraket(item.자치법규명));

    if (!wordData) {
      failed.push(item.자치법규명);
      continue;
    }

    const metadata = {
      localLawId: item.자치법규ID || undefined,
      promulgationDate: convertNumericData(item.공포일자) || undefined,
      promulgationNumber: item.공포번호 || undefined,
      promulgationDivision: item.제개정구분명 || undefined,
      agencyName: item.지자체기관명 || undefined,
      enforcementDate: convertNumericData(item.시행일자) || undefined,
      areaName: item.자치법규분야명 || undefined,
    };

    const tags = ["법률", "법률/자치법규"];

    if (item.자치법규종류) {
      tags.push(`법률/${item.자치법규종류}`);
    }
    if (item.지자체기관명) {
      tags.push(`법률/자치법규/${item.지자체기관명}`);
    }

    let definition = "";

    if (item.자치법규명.endsWith("시행규칙")) {
      definition = `'${item.자치법규명.replace(/시행규칙$/, "").trim()}'과 같은 법 시행령의 시행에 관한 사항을 상세히 규정한 규칙.`;
    } else {
      const promulgationDateStr = `${metadata.promulgationDate.getFullYear()}년 ${metadata.promulgationDate.getMonth() + 1}월 ${metadata.promulgationDate.getDate()}일`;
      const enforcementDateStr = `${metadata.enforcementDate.getFullYear()}년 ${metadata.enforcementDate.getMonth() + 1}월 ${metadata.enforcementDate.getDate()}일`;
      const areaNameStr = metadata.areaName ? `${metadata.areaName}의 ` : "";
      definition = `${metadata.agencyName}에서 소관하는 ${areaNameStr}자치법규로, ${promulgationDateStr}에 공포되어 ${enforcementDateStr}에 시행되었다.`;
    }

    const url = "https://www.law.go.kr/" + item.자치법규상세링크;

    result.items.push({
      ...wordData,
      definition,
      sourceId: `${REFERENCE_ID}_localLaw_${item.자치법규일련번호}`,
      url,
      tags,
      // @ts-ignore
      metadata,
    });
  }

  // uniqBy
  console.info("Make unique items...");
  result.items = uniqBy(result.items, "sourceId");

  // 종료 단계
  logger.info("Exporting...", result.items.length);
  await exportMuDictJson(REFERENCE_ID, result);

  logger.info("Analyzing unknown words...", failed.length);
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failed);

  logger.info("Done.");
};

run().then();
