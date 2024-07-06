// 우리말샘 JSON 덤프를 키뮤사전 JSON으로 변환하는 스크립트
import { readdir, readFile, writeFile } from "fs/promises";
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
import axios from "axios";
import * as cheerio from "cheerio";

// bun <Command> <Path>
const EXISTING_PATH = "./src/opendict/data";
const REFERENCE_ID = "opendict";

const resetCache = process.argv.includes("--reset-cache");

const result: MuDict = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: [],
    pos: PartOfSpeech.Noun,
  },
};

const cachePath = "./src/opendict/multimedia_cache.json";

type MultimediaCache = Record<number, string>;

let multimediaCache: MultimediaCache = {};

const saveMultimediaCache = async (targetCode: number, url: string) => {
  multimediaCache[targetCode] = url;

  // 캐시 저장
  console.info("Save multimedia cache...", targetCode, url);

  // 캐시 파일 저장
  const cache = JSON.stringify(multimediaCache, null, 2);
  await writeFile(cachePath, cache, "utf8");
};

const run = async () => {
  // 경로의 JSON 파일을 읽어옴
  const files = (await readdir(EXISTING_PATH)).filter((file) =>
    file.endsWith(".json"),
  );

  // laad multimedia cache
  if (!resetCache) {
    try {
      const cacheStr = await readFile(cachePath, "utf8");
      multimediaCache = JSON.parse(cacheStr);
    } catch (e) {
      console.warn(
        "Failed to load multimedia cache. If it is first fetching, you must use '--reset-cache' option.",
        e,
      );
      throw e;
    }
  }

  const idSet = new Set<string>();

  for (const file of files) {
    console.info(`Load '${EXISTING_PATH}/${file}' file...`);

    const jsonStr = await readFile(`${EXISTING_PATH}/${file}`, "utf8");
    console.log(jsonStr.length);
    const refData = JSON.parse(jsonStr) as { channel: DictionaryFile };

    // 여기에 컨버팅 코드 입력
    for (const item of refData.channel.item) {
      const id = REFERENCE_ID + "_" + item.target_code;

      if (idSet.has(id)) {
        console.warn(`ID 중복 발생: ${id}`);
        continue;
      }
      idSet.add(id);

      const word = toIpfString(item.wordinfo.word);
      const definition = item.senseinfo.definition;

      // 품사 없으면 그냥 명사 취급
      let pos =
        convertStringToPartOfSpeech(item.senseinfo.pos) || PartOfSpeech.Noun;

      if (item.wordinfo.word_unit === "속담") {
        pos = PartOfSpeech.Proverb;
      }

      if (
        item.wordinfo.word_type === "관용구" ||
        item.wordinfo.word_unit === "관용구"
      ) {
        pos = PartOfSpeech.Idiom;
      }

      let thumbnail: string | undefined;

      if (item.senseinfo.multimedia_info) {
        // 캐시 확인
        if (item.target_code in multimediaCache) {
          thumbnail = multimediaCache[item.target_code];
          console.info("Use cached multimedia info", thumbnail);
        } else {
          console.info("fetching multimedia info...", item.target_code);

          for (const multimedia of item.senseinfo.multimedia_info) {
            if (!["삽화", "사진"].includes(multimedia.type)) continue;

            try {
              const res = await axios.get(multimedia.link);
              const $ = cheerio.load(res.data);

              // 상업적 이용 가능 여부 확인
              // class="ul_copyright" 인 내의 두 번째 li 태그 text에 '허용'이 있는지 확인 (없으면 continue)
              const isCommercialAvailable = $(
                ".ul_copyright li:nth-child(2)",
              ).text();

              if (!isCommercialAvailable.includes("허용")) {
                console.info("Commercial use is not allowed", multimedia.link);
                continue;
              }

              // img 태그의 src를 불러옴
              const imgSrc = $("img").attr("src");
              if (!imgSrc) {
                console.warn("Failed to fetch img src", word);
                continue;
              }

              thumbnail = imgSrc;
              await saveMultimediaCache(item.target_code, thumbnail);
              break;
            } catch (e) {
              console.warn("Failed to fetch multimedia info", e);
            }
          }
        }
      }

      const tags = item.senseinfo.cat_info?.map((cat) => cat.cat) || [];

      if (item.senseinfo.type !== "일반어") {
        tags.push(item.senseinfo.type);
      }

      const url = item.link;

      const muDictItem: MuDictItem = {
        sourceId: id,
        name: word,
        simplifiedName: simplifyName(word),
        origin:
          item.wordinfo.original_language_info
            ?.map((info) => info.original_language)
            .join("") || word,
        definition,
        pronunciation: item.wordinfo?.pronunciation_info?.[0]?.pronunciation,
        thumbnail,
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
