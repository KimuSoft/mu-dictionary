import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/경로";
const REFERENCE_ID = "ID 입력 (영어 소문자)";

const result: MuDict = {
  items: [],
  default: {
    definition: "~에 등장하는 단어",
    referenceId: REFERENCE_ID,
    tags: ["example"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info("Loding JSON file...");
  const refData = JSON.parse(await readFile(EXISTING_PATH, "utf8")) as Record<
    string,
    string
  >;
  console.info("JSON file loaded.");

  // 여기에 컨버팅 코드 입력

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
