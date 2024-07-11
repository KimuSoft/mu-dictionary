import { readdir, readFile } from "fs/promises";
import { MuDictDump, MudictDumpItem } from "../types";
import * as XLSX from "xlsx";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { BusStopData } from "./type";
import { loadCache, saveCache } from "../utils/cache";
import removeBraket from "../utils/removeBraket";
import { PartOfSpeech, Word } from "mudict-api-types";
import analyzeUnknownWords, {
  analyzeAndSaveUnknownWords,
} from "../utils/analyzeUnknownWords";

const EXISTING_PATH = "./src/bus/data";
const REFERENCE_ID = "bus";

const isReset = process.argv.includes("--reset");

const result: MuDictDump = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: ["대중교통"],
    pos: PartOfSpeech.Noun,
  },
};

const loadData = async (): Promise<BusStopData[]> => {
  const results: BusStopData[] = [];

  // EXISTING_PATH 내에 있는 모든 xlsx 파일 로드
  const files = (await readdir(EXISTING_PATH)).filter((file) =>
    file.endsWith(".xlsx"),
  );

  for (const file of files) {
    console.info(`Loading ${file}...`);

    const bufferArray = await readFile(`${EXISTING_PATH}/${file}`);
    const wb = XLSX.read(bufferArray, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

    for (const row of data.slice(1)) {
      results.push({
        stopNumber: row[0],
        stopName: row[1],
        latitude: parseFloat(row[2]) || undefined,
        longitude: parseFloat(row[3]) || undefined,
        mobileNumber: parseInt(row[5]) || undefined,
        cityCode: parseInt(row[6]) || undefined,
        cityFullName: row[7],
        operatorCity: row[8],
      });
    }
  }

  return results;
};

const run = async () => {
  let data: BusStopData[] = [];

  // 캐시 로드
  if (!isReset) {
    const cache = await loadCache<BusStopData[]>(REFERENCE_ID);
    if (cache) data = cache;
    else console.info("Cache not found.");
  }

  // 캐시가 없을 경우 데이터 로드
  if (!data.length) {
    data = await loadData();
    await saveCache(REFERENCE_ID, data);
  }

  const failedWords: string[] = [];

  // 데이터 변환
  for (const item of data) {
    if (!item.stopName) continue;
    const nameData = wordConvert(removeBraket(item.stopName));

    if (!nameData) {
      failedWords.push(removeBraket(item.stopName));
      continue;
    }

    const mobileNumberStr = item.mobileNumber
      ? `, 모바일단축번호는 '${item.mobileNumber}'이다.`
      : "이다.";

    const definition = `${item.cityFullName}에 위치한 버스 정류장. 정류장 번호는 '${item.stopNumber}'${mobileNumberStr}`;

    const muDictItem: MudictDumpItem = {
      sourceId: REFERENCE_ID + "_" + item.stopNumber,
      ...result.default,
      ...nameData,
      definition,
      tags: [
        "대중교통",
        "대중교통/버스",
        "대중교통/버스/" +
          (item.cityFullName === "서울특별시" ? "서울" : item.operatorCity),
      ],
      // url: `https://www.google.co.kr/maps/place/${item.latitude},${item.longitude}`,
      url: `https://map.kakao.com/link/map/${item.latitude},${item.longitude}`,
      metadata: {
        busStopCode: item.stopNumber,
        busStopMobileNumber: item.mobileNumber,
        longitude: item.longitude,
        latitude: item.latitude,
        address: item.cityFullName,
        operator: item.operatorCity,
      },
    };

    result.items.push(muDictItem);
  }

  // 종료 단계
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failedWords);
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
