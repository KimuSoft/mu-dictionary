import { readdir, readFile } from "fs/promises";
import { BasicWordDict } from "./type";
import { saveCache } from "../utils/cache";
import { Logger } from "tslog";
import * as path from "node:path";

const DATA_PATH = path.join(__dirname, "data");
const REFERENCE_ID = "krdict";

const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const run = async () => {
  console.info("Reading files...");
  const files = await readdir(DATA_PATH);
  if (!files.length) {
    console.info("No files found.");
    return;
  }

  const words: Set<string> = new Set();

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    logger.info("Reading file:", file);
    const data = await readFile(path.join(DATA_PATH, file), "utf-8");
    const dict: BasicWordDict = JSON.parse(data);

    logger.info("Processing words...");
    for (const entry of dict.LexicalResource.Lexicon.LexicalEntry) {
      try {
        const lemmas = Array.isArray(entry.Lemma) ? entry.Lemma : [entry.Lemma];

        for (const lemma of lemmas) {
          const word = lemma.feat.val;
          if (word.includes(",")) continue;
          words.add(word.replace(/[-^\s]/g, ""));
        }
      } catch (e) {
        logger.warn("Failed to process word:", entry.Lemma);
        throw e;
      }
    }
  }

  logger.info("Saving word set to cache...", words.size);
  await saveCache(REFERENCE_ID, [...words]);

  logger.info("Done.");
};

void run();
