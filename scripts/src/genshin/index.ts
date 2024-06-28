// 같은 경로의 TextMapKR.json 파일 불러오기 (무거우므로 import 말고 async로 파싱)
import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as hangul from "hangul-js";

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

  const wordSet = new Set<string>();

  for (const key in textMapKR) {
    const text = textMapKR[key];

    // 대사는 제외 (온점, 느낌표, 물음표, |, {, }, 반점이 포함되었거나, 글자 수가 20글자 이상 제외)
    if (
      /[.!?|~#…,{}\n]|(하기|하자|거든|있다|\s해|렸다|렸지|아와|않아|구나|다니|다고|군요|이지|있어|는거지|은데|갔다|된다|냐구|다네|한다|았어|겠군|할거야|오자|바라|라고|준다|래요|하네|있지|간다|을거야|일거야|좋아|냈어|든요|을요|였네|네기|는다|든다|데요|던요|아냐|죠|보자|이다|세요|해요|줘|아요|할까|니다|봐|가기|이네|네요|아니야|겠지|었어|였어|니까|겠어|겠네|겠다|돼|어요|예요|에요|게요)$/.test(
        text,
      )
    ) {
      continue;
    }

    const nameData = wordConvert(text);
    if (!nameData) {
      continue;
    }

    // 중복 체크
    if (wordSet.has(nameData.name)) {
      // console.error("중복된 단어:", nameData.name);
      continue;
    }
    wordSet.add(nameData.name);

    result.items.push({
      ...nameData,
      sourceId: REFERENCE_ID + "_" + key,
      url:
        text.length < 20
          ? "https://genshin.gamedot.org/?mid=search&word=" +
            encodeURI(nameData.name)
          : undefined,
    });
  }

  console.info("Exporting MuDict.json...");
  await exportMuDictJson(REFERENCE_ID, result);
};

run().then();
