import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { PartOfSpeech } from "mudict-api-types";
import { Logger } from "tslog";
import { loadCache } from "../utils/cache";
import { analyzeAndSaveUnknownWords } from "../utils/analyzeUnknownWords";

const REFERENCE_ID = "ID 입력 (영어 소문자)";

const isReset = process.argv.includes("--reset");
const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["example"],
  },
};

const run = async () => {
  let cache: any = [];

  // isReset이 아니라면
  if (!isReset) {
    logger.info("Loading cache...");
    const cache$ = await loadCache(REFERENCE_ID);

    if (!cache$) {
      logger.warn(
        "Failed to load cache. Please run 'bun <Command> --reset' first.",
      );
      throw new Error("Failed to load cache.");
    }
  }

  // API Fetch

  const failed: string[] = [];

  for (const item of cache) {
    const wordData = wordConvert(item.word);

    if (!wordData) {
      failed.push(item.word);
      continue;
    }

    result.items.push({
      ...wordData,
      sourceId: REFERENCE_ID + "_" + item.id,
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
