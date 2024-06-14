// 같은 경로의 TextMapKR.json 파일 불러오기 (무거우므로 import 말고 async로 파싱)
import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";

// bun genshin <경로>
const EXISTING_PATH = process.argv[2] || "./src/genshin/TextMapKR.json";

const REFERENCE_ID = "genshin";

const result: MuDict = {
  items: [],
  default: {
    definition: "게임 '원신'에 등장하는 단어",
    referenceId: REFERENCE_ID,
    tags: ["원신"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info("Loding TextMapKR.json...");
  const textMapKR = JSON.parse(await readFile(EXISTING_PATH, "utf8")) as Record<
    string,
    string
  >;
  console.info("TextMapKR.json loaded.");

  const texts = Object.values(textMapKR);
  const filteredTexts: string[] = Array.from(
    new Set(
      texts.filter((text) => {
        // 대사는 제외 (온점, 느낌표, 물음표, |, {, }, 반점이 포함되었거나, 글자 수가 20글자 이상 제외)
        return (
          !/[.!?|~#…,{}\n]|(하기|하자|든요|을요|였네|네기|는다|든다|데요|던요|아냐|죠|보자|세요|해요|줘|아요|할까|니다|봐|가기|이네|네요|아니야|겠지|었어|였어|니까|겠어|겠네|겠다|돼|어요|예요|에요|게요)$/.test(
            text
          ) && text.length < 20
        );
      })
    )
  );

  const muDictItems: MuDictItem[] = filteredTexts
    .filter((text) => wordConvert(text))
    .map((text) => wordConvert(text)!)
    .map((text) => ({
      ...text,
      url:
        "https://genshin.gamedot.org/?mid=search&word=" + encodeURI(text.name),
    }));

  result.items = muDictItems;

  await exportMuDictJson(REFERENCE_ID, result);
};

run().then();
