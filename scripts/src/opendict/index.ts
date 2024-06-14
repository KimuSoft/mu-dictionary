// 우리말샘 JSON 덤프를 키뮤사전 JSON으로 변환하는 스크립트
import { readdir, readFile } from "fs/promises";
import { simplifyName, wordConvert } from "../utils/wordConvert";
import {
  convertStringToPartOfSpeech,
  MuDict,
  MuDictItem,
  PartOfSpeech,
} from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { DictionaryFile } from "./types";
import { toIpfString } from "hypua";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/opendict/data";
const REFERENCE_ID = "opendict";

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
  // 경로의 JSON 파일을 읽어옴
  const files = (await readdir(EXISTING_PATH)).filter((file) =>
    file.endsWith(".json"),
  );

  for (const file of files) {
    console.info(`Load '${EXISTING_PATH}/${file}' file...`);

    const jsonStr = await readFile(`${EXISTING_PATH}/${file}`, "utf8");
    console.log(jsonStr.length);
    const refData = JSON.parse(jsonStr) as { channel: DictionaryFile };

    // 여기에 컨버팅 코드 입력
    for (const item of refData.channel.item) {
      const word = toIpfString(item.wordinfo.word);
      const definition = item.senseinfo.definition;

      // 품사 없으면 그냥 명사 취급
      const pos =
        convertStringToPartOfSpeech(item.senseinfo.pos) || PartOfSpeech.Noun;
      const tags = item.senseinfo.cat_info?.map((cat) => cat.cat) || [];

      if (item.senseinfo.type !== "일반어") {
        tags.push(item.senseinfo.type);
      }

      const url = item.link;

      const muDictItem: MuDictItem = {
        name: word,
        simplifiedName: simplifyName(word),
        origin:
          item.wordinfo.original_language_info
            ?.map((info) => info.original_language)
            .join("") || word,
        definition,
        pos,
        tags,
        url,
      };

      result.items.push(muDictItem);
    }
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
