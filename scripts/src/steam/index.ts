import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import {
  GameDetailResponse,
  SteamGameCache,
  SteamGameListResponse,
} from "./types";
import axios from "axios";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";
import removeBraket from "../utils/removeBraket";
import { Logger } from "tslog";
import * as path from "node:path";

// bun <Command> <Path>
const DATA_PATH = path.join(__dirname, "data/v2.json");
const REFERENCE_ID = "steam";

const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const noCache = process.argv[2] === "--no-cache";
const skipDownload = process.argv[2] === "--skip-download";

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["게임", "게임/스팀 게임"],
  },
};

const run = async () => {
  logger.info("Loding JSON file...");
  const refData = JSON.parse(
    await readFile(DATA_PATH, "utf8"),
  ) as SteamGameListResponse;
  logger.info("JSON file loaded. length: " + refData.applist.apps.length);

  // refData.applist.apps 를 가나다 순으로 정렬 (영어가 더 뒤로)
  logger.info("Sorting...");
  refData.applist.apps.sort((a, b) => {
    // 한글이 있는지 확인
    const aHasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(a.name);
    const bHasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(b.name);

    // 둘 중 하나에 한글이 있으면
    if (aHasKorean && !bHasKorean) return -1;
    if (!aHasKorean && bHasKorean) return 1;

    if (a.name.trim() < b.name.trim()) return -1;
    if (a.name.trim() > b.name.trim()) return 1;
    return 0;
  });

  const gameCache: SteamGameCache = {};

  if (!noCache) {
    logger.info("Using cache...");
    const cache = JSON.parse(
      await readFile("./src/steam/data/cache.json", "utf8"),
    ) as SteamGameCache;

    // 백업 파일 생성
    await writeFile(
      "./src/steam/data/cache-backup.json",
      JSON.stringify(cache, null, 2),
      "utf8",
    );

    Object.assign(gameCache, cache);
  }

  let idx = 0;

  if (!skipDownload) {
    logger.info("Download Detailed Data...");
    for (const item of refData.applist.apps) {
      idx++;
      if (!item.name) continue;

      // 캐시에 이미 정보가 있으면 패스
      if (gameCache[item.appid]) {
        // logger.info("Already cached:", item.appid, item.name);
        continue;
      }

      // 100회마다 퍼센테이지 알려주며 로깅하고 캐시 저장
      if (idx % 100 === 0) {
        logger.info(
          `${idx} / ${refData.applist.apps.length} (${((idx / refData.applist.apps.length) * 100).toFixed(2)}%)`,
        );
      }

      await writeFile(
        "./src/steam/data/cache.json",
        JSON.stringify(gameCache, null, 2),
        "utf8",
      );

      // https://store.steampowered.com/api/appdetails?appids={id}&l=korean
      const res = await axios.get<GameDetailResponse>(
        `https://store.steampowered.com/api/appdetails?appids=${item.appid}&l=korean`,
      );

      if (!res.data?.[item.appid]?.success) {
        logger.warn("Failed to get game detail:", item.appid);
        gameCache[item.appid] = {
          appid: item.appid,
          detail: false,
          name: item.name,
          url: `https://store.steampowered.com/app/${item.appid}&l=korean`,
        };
        continue;
      }

      const data = res.data[item.appid].data;

      gameCache[item.appid] = {
        appid: item.appid,
        detail: true,
        url: `https://store.steampowered.com/app/${item.appid}&l=korean`,
        ...data,
        originalName: item.name,
      };

      logger.info(`Downloaded: ${item.appid} - ${item.name} (${data.name})`);

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    logger.info("Download finished.");
  }

  const failedName: string[] = [];

  logger.info("Converting...");
  for (const id in gameCache) {
    const item = gameCache[id];
    const nameData = wordConvert(removeBraket(item.name));
    if (!nameData) {
      // logger.warn("Failed to convert:", item.name);
      failedName.push(item.name);
      continue;
    }

    const tags = ["게임", "게임/스팀 게임"];
    let definition = "";
    let thumbnail = "";
    let url = item.url;

    if (item.detail) {
      const genres: string =
        item.genres?.map((genre) => genre.description).join(", ") || "";
      thumbnail = item.header_image;

      const releaseDataStr = item.release_date.coming_soon
        ? "출시 예정인"
        : item.release_date.date + " 출시한";

      const developerStr = item.developers
        ? `${item.developers.join(", ")}에서 개발한 `
        : "";

      definition = `${releaseDataStr} ${developerStr}${genres} 게임. ${item.short_description}`;
      url = item.website || item.url;

      if (item.supported_languages?.includes("한국어")) {
        tags.push("게임/스팀 게임/한국어 지원");
      }

      if (item.type === "demo") {
        tags.push("게임/스팀 게임/데모");
      }

      if (item.type === "dlc") {
        tags.push("게임/스팀 게임/확장팩");
      }
    }

    result.items.push({
      ...nameData,
      definition,
      tags,
      sourceId: REFERENCE_ID + "_" + item.appid,
      url,
      thumbnail,
    });
  }

  logger.info("Converting finished.");

  // 데이터가 없는 것도 추가
  logger.info("Adding missing data...");
  for (const item of refData.applist.apps) {
    if (!item.name) continue;
    if (!gameCache[item.appid]) {
      const nameData = wordConvert(removeBraket(item.name));
      if (!nameData) {
        // logger.warn("Failed to convert:", item.name);
        failedName.push(item.name);
        continue;
      }

      result.items.push({
        ...nameData,
        definition: "",
        sourceId: REFERENCE_ID + "_" + item.appid,
        url: `https://store.steampowered.com/app/${item.appid}&l=korean`,
      });
    }
  }
  logger.info("Missing data added.");

  logger.info("Saving...");
  await exportMuDictJson(REFERENCE_ID, result);

  logger.info("saving failed names...");
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failedName);

  logger.info("Done.");
};

void run();
