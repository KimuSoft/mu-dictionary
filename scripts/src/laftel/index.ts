import { wordConvert } from "../utils/wordConvert";
import { MuDict, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { Anime } from "./types";
import { readFile, writeFile } from "fs/promises";
import { uniqBy } from "lodash";

// bun <Command>
const USE_CACHE = !!process.argv[2];
const REFERENCE_ID = "laftel";

const REQUEST_INTERVAL = 100;

const result: MuDict = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: ["애니메이션"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  const animes: Anime[] = [];

  if (!USE_CACHE) {
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
      console.log(`Fetching: ${next}`);
      next = await fetchNext(next);
      await new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL));
    }

    // anime 저장
    await writeFile("./src/anime.json", JSON.stringify(animes, null, 2));
  } else {
    console.info("Loading cache...");
    const data = JSON.parse(
      await readFile("./src/laftel/anime.json", "utf8"),
    ) as Anime[];
    animes.push(...data);
  }

  // 키뮤사전 형식으로 변환
  for (const anime of animes) {
    const nameData = wordConvert(
      anime.name
        .replace(/\([^)]+\)/g, "")
        .replace(/\s1기/, "")
        .replace(/\s?-\s?판권\s부활/, "")
        .trim(),
    );

    if (!nameData) {
      console.warn(`Failed to convert: ${anime.name}`);
      continue;
    }

    result.items.push({
      ...nameData,
      sourceId: REFERENCE_ID + "_" + anime.id,
      definition: `${anime.genres.join(", ")} ${anime.medium} 애니메이션. 등급은 ${anime.content_rating}이다.`,
      url: `https://laftel.net/item/${anime.id}`,
      thumbnail: anime.img,
    });
  }

  result.items = uniqBy(result.items, "name");

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
