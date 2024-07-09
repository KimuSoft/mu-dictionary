import { readFile } from "fs/promises";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { PartOfSpeech } from "mudict-api-types";

// bun <Command> <Path>
const EXISTING_PATH =
  process.argv[2] ||
  "C:/Program Files (x86)/Steam/steamapps/common/Factorio/data/base/locale/ko";
const REFERENCE_ID = "factorio";

const result: MuDictDump = {
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
