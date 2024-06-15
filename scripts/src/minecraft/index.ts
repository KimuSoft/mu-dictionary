// 같은 경로의 TextMapKR.json 파일 불러오기 (무거우므로 import 말고 async로 파싱)
import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";

// bun genshin <경로>
const EXISTING_PATH = process.argv[2] || "./src/minecraft/ko_kr.json";

const REFERENCE_ID = "minecraft";

const result: MuDict = {
  items: [],
  default: {
    definition: "게임 '마인크래프트'에 등장하는 단어.",
    referenceId: REFERENCE_ID,
    tags: ["마인크래프트"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info("Loding JSON file...");
  const textMapKR = JSON.parse(await readFile(EXISTING_PATH, "utf8")) as Record<
    string,
    string
  >;
  console.info("JSON file loaded.");

  for (const [key, value] of Object.entries(textMapKR)) {
    // key, value를 출력
    if (
      !(
        key.startsWith("block.") ||
        key.startsWith("item.") ||
        key.startsWith("advancements.") ||
        key.startsWith("enchantment.") ||
        key.startsWith("entity.") ||
        key.startsWith("gameMode.") ||
        key.startsWith("gamerule.")
      ) ||
      key.endsWith(".description") ||
      /[${}%]/g.test(value)
    )
      continue;

    const wordData = wordConvert(value);
    if (!wordData) {
      console.warn("Failed to convert:", key, value);
      continue;
    }

    let definition = "게임 '마인크래프트'에 등장하는 단어.";

    if (key.startsWith("block.")) {
      definition = '게임 "마인크래프트"에 등장하는 블록.';
    } else if (key.startsWith("item.")) {
      definition = '게임 "마인크래프트"에 등장하는 아이템.';
    } else if (key.startsWith("advancements.")) {
      definition = '게임 "마인크래프트"의 도전과제.';
    } else if (key.startsWith("enchantment.")) {
      definition = '게임 "마인크래프트"의 인챈트.';
    } else if (key.startsWith("entity.")) {
      definition = '게임 "마인크래프트"의 엔티티.';
    } else if (key.startsWith("gameMode.")) {
      definition = '게임 "마인크래프트"의 게임 모드.';
    } else if (key.startsWith("gamerule.")) {
      definition = '게임 "마인크래프트"의 게임 설정값.';
    }

    const description = textMapKR[key.replace(".title", "") + ".description"];
    if (description) {
      definition += " " + description;
    }

    result.items.push({
      ...wordData,
      sourceId: REFERENCE_ID + "_" + key,
      definition,
      url:
        "https://minecraft.fandom.com/ko/wiki/" +
        encodeURI(value.replace(/\./g, "/")),
    });
  }

  await exportMuDictJson(REFERENCE_ID, result);
};

run().then();
