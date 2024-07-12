import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { PartOfSpeech } from "mudict-api-types";
import { getCategory } from "../utils/namuwiki";
import { loadCache, saveCache } from "../utils/cache";
import toUnicodeId from "../utils/toUnicodeId";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { uniqBy } from "lodash";

// bun <Command> <Path>
const useCache = process.argv.includes("--cache");
const REFERENCE_ID = "namuwiki_manga";

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["책명", "책명/만화"],
    pos: PartOfSpeech.Noun,
  },
};

interface MangaData {
  title: string;
  country: "일본" | "한국";
}

const mangaTitleReplacer = (title: string) =>
  title.replace(/\((만화|소설)\)/g, "").trim();

const run = async () => {
  console.info("Loding JSON file...");

  let lightNovels: MangaData[] = [];

  if (!useCache) {
    console.info("JSON file loaded.");
    const japLightNovels = await getCategory({
      category: "일본 만화/목록",
    });

    if (!japLightNovels) throw new Error("failed to fetch");

    for (const novel of [
      japLightNovels.subCategories,
      japLightNovels.subArticles,
    ].flat()) {
      lightNovels.push({
        title: mangaTitleReplacer(novel),
        country: "일본",
      });
    }

    const korLightNovels = await getCategory({
      category: "한국 만화/목록",
    });

    if (!korLightNovels) throw new Error("failed to fetch");

    for (const novel of [
      korLightNovels.subCategories,
      korLightNovels.subArticles,
    ].flat()) {
      lightNovels.push({
        title: mangaTitleReplacer(novel),
        country: "일본",
      });
    }

    lightNovels = uniqBy(lightNovels, "title");
    await saveCache(REFERENCE_ID, lightNovels);
  } else {
    const cache = await loadCache<MangaData[]>(REFERENCE_ID);
    if (!cache) throw new Error("Cache Not Found");

    lightNovels = cache;
  }

  const failed: string[] = [];

  // 여기에 컨버팅 코드 입력
  for (const novel of lightNovels) {
    const wordData = wordConvert(novel.title);

    if (!wordData) {
      failed.push(novel.title);
      continue;
    }

    const tags = ["책명", "책명/만화"];

    if (novel.country === "일본") {
      tags.push("책명/만화/일본");
    } else {
      tags.push("책명/만화/한국");
    }

    result.items.push({
      sourceId: REFERENCE_ID + "_" + toUnicodeId(novel.title),
      ...wordData,
      tags,
      url: `https://namu.wiki/w/${encodeURIComponent(novel.title)}`,
      definition: `${novel.country}의 만화 서적.`,
    });
  }

  // 종료 단계
  console.info("Exporting...");
  await exportMuDictJson(REFERENCE_ID, result);

  console.info("Failed to convert words: ", failed.length);
  await analyzeAndSaveUnknownWords(REFERENCE_ID, failed);
  console.info("Done.");
};

run().then();
