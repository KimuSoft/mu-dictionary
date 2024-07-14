import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { Anime, AnimeDetail } from "./types";
import { uniqBy } from "lodash";
import { loadCache, saveCache } from "../utils/cache";
import axios from "axios";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";
import { Logger } from "tslog";

// bun <Command>
const isReset = process.argv.includes("--reset");
const skipDetail = process.argv.includes("--skip-detail");
const REFERENCE_ID = "laftel";

const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const REQUEST_INTERVAL = 100;

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["애니메이션"],
  },
};

const run = async () => {
  let animes: (Anime & { detail?: AnimeDetail })[] = [];

  if (!isReset) {
    logger.info("Loading cache...");
    animes = (await loadCache(REFERENCE_ID)) || [];
  }

  if (isReset || !animes.length) {
    const fetchNext = async (url: string) => {
      const res = await fetch(url);
      const result = (await res.json()) as {
        results: Anime[];
        next: string | null;
      };

      animes.push(...result.results);
      return result.next;
    };

    let next: string | null =
      "https://api.laftel.net/api/search/v1/discover/?sort=name&offset=0&size=100";

    while (next) {
      logger.info(`Fetching: ${next}`);
      next = await fetchNext(next);
      await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL));
    }

    // anime 저장
    await saveCache(REFERENCE_ID, animes);
  }

  if (!skipDetail) {
    // 디테일 추가
    // https://api.laftel.net/api/items/v2/{id}
    for (const anime of animes) {
      if (anime.detail) continue;

      logger.info(`Fetching detail: ${anime.id}`);
      const res = await axios.get<AnimeDetail>(
        `https://api.laftel.net/api/items/v2/${anime.id}`,
      );
      anime.detail = res.data;
      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
      // 저장
      await saveCache(REFERENCE_ID, animes);
    }
  }

  const failed: string[] = [];

  // 키뮤사전 형식으로 변환
  for (const anime of animes) {
    const nameData = wordConvert(
      anime.name
        .replace(/\([^)]+\)/g, "")
        .replace(/\s1기/, "")
        .replace(/\s시즌\s?1/, "")
        .replace(/\s?-\s?배리어프리/, "")
        .replace(/\s?-\s?판권\s부활/, "")
        .trim(),
    );

    if (!nameData) {
      failed.push(anime.name);
      continue;
    }

    const ratingStr = anime.content_rating
      ? ` 등급은 ${anime.content_rating}이다.`
      : "";

    const releaseYear =
      parseInt(anime.detail?.air_year_quarter?.split("년")?.[0] || "") ||
      undefined;

    const releaseStr = anime.detail?.air_year_quarter
      ? `${anime.detail.air_year_quarter}에 `
      : "";
    const productionStr = anime.detail?.production
      ? `${anime.detail.production}에서 제작한 `
      : "";

    const tags = ["애니메이션"];

    // 애니메이션/2010년대 처럼 년대별로 태그 추가
    if (releaseYear) {
      tags.push(`애니메이션/${Math.floor(releaseYear / 10) * 10}년대`);
    }

    result.items.push({
      ...nameData,
      sourceId: REFERENCE_ID + "_" + anime.id,
      definition:
        `${releaseStr}${productionStr}${anime.genres.join(", ")} ${anime.medium} 애니메이션. ${ratingStr} ${anime.detail?.content || ""}`.trim(),
      url: `https://laftel.net/item/${anime.id}`,
      tags,
      thumbnail: anime.img,
      metadata: {
        releaseYear,
        genres: anime.genres,
      },
    });
  }

  result.items = uniqBy(result.items, "name");

  // 종료 단계
  logger.info("Exporting...");
  await exportMuDictJson(REFERENCE_ID, result);

  logger.info("Failed to convert words: ", failed.length);
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failed);

  logger.info("Done.");
};

void run();
