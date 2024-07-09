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
import analyzeUnknownWords from "../utils/analyzeUnknownWords";
import removeBraket from "../utils/removeBraket";

// bun <Command> <Path>
const EXISTING_PATH = "./src/steam/data/v2.json";
const REFERENCE_ID = "steam";

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
  console.info("Loding JSON file...");
  const refData = JSON.parse(
    await readFile(EXISTING_PATH, "utf8"),
  ) as SteamGameListResponse;
  console.info("JSON file loaded.");

  const gameCache: SteamGameCache = {};

  if (!noCache) {
    console.info("Using cache...");
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
    console.info("Download Detailed Data...");
    for (const item of refData.applist.apps) {
      idx++;
      if (!item.name) continue;

      // 캐시에 이미 정보가 있으면 패스
      if (gameCache[item.appid]) {
        // console.info("Already cached:", item.appid, item.name);
        continue;
      }

      // 100회마다 퍼센테이지 알려주며 로깅하고 캐시 저장
      if (idx % 100 === 0) {
        console.info(
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
        console.error("Failed to get game detail:", item.appid);
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

      console.info(`Downloaded: ${item.appid} - ${item.name} (${data.name})`);

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    console.info("Download finished.");
  }

  const failedName: string[] = [];

  console.info("Converting...");
  for (const id in gameCache) {
    const item = gameCache[id];
    const nameData = wordConvert(removeBraket(item.name));
    if (!nameData) {
      // console.warn("Failed to convert:", item.name);
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

  console.log("Converting finished.");

  // 데이터가 없는 것도 추가
  console.info("Adding missing data...");
  for (const item of refData.applist.apps) {
    if (!item.name) continue;
    if (!gameCache[item.appid]) {
      const nameData = wordConvert(removeBraket(item.name));
      if (!nameData) {
        // console.warn("Failed to convert:", item.name);
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
  console.info("Missing data added.");

  console.log("saving failed names...");
  await writeFile(
    "./src/steam/data/failed-names.json",
    JSON.stringify(analyzeUnknownWords(failedName), null, 2),
    "utf8",
  );

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
