// 우리말샘 JSON 덤프를 키뮤사전 JSON으로 변환하는 스크립트
import { readdir, readFile } from "fs/promises";
import { simplifyName } from "../utils/wordConvert";
import {
  convertStringToPartOfSpeech,
  MuDictDump,
  MudictDumpItem,
} from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { DictionaryFile } from "./types";
import { toIpfString } from "hypua";
import axios from "axios";
import * as cheerio from "cheerio";
import { PartOfSpeech } from "mudict-api-types";
import * as path from "node:path";
import { loadCache, saveCache } from "../utils/cache";
import { Logger } from "tslog";

// bun <Command> <Path>
const DATA_PATH = path.join(__dirname, "data");
const REFERENCE_ID = "opendict";

const isResetCache = process.argv.includes("--reset");
const logger = new Logger({ name: REFERENCE_ID.toUpperCase() });

const result: MuDictDump = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: [],
    pos: PartOfSpeech.Noun,
  },
};

type MultimediaCache = Record<number, string>;

let multimediaCache: MultimediaCache = {};

const saveMultimediaCache = async (targetCode: number, url: string) => {
  multimediaCache[targetCode] = url;

  // 캐시 저장
  logger.info("Save multimedia cache...", targetCode, url);
  await saveCache(REFERENCE_ID + "_multimedia", multimediaCache);
};

const run = async () => {
  // 경로의 JSON 파일을 읽어옴
  const files = (await readdir(DATA_PATH)).filter((file) =>
    file.endsWith(".json"),
  );

  // load krdict cache
  const krDictCache = await loadCache<string[]>("krdict");
  if (!krDictCache) {
    // 가볍게 경고만 하고 bun krdict 안내
    logger.warn('Failed to load krdict cache. Please run "bun krdict" first.');
  }

  const commonWordSet = new Set<string>(krDictCache || []);

  // laad multimedia cache
  if (!isResetCache) {
    const cache = await loadCache<MultimediaCache>(
      REFERENCE_ID + "_multimedia",
    );
    if (!cache) {
      logger.warn(
        "Failed to load multimedia cache. If it is first fetching, you must use '--reset' option.",
      );
      throw new Error("Failed to load multimedia cache.");
    }

    multimediaCache = cache;
  } else {
    logger.info("Reset multimedia cache.");
  }

  const idSet = new Set<string>();

  for (const file of files) {
    const filePath = path.join(DATA_PATH, file);

    logger.info(`Load '${filePath}' file...`);

    const jsonStr = await readFile(filePath, "utf8");
    const refData = JSON.parse(jsonStr) as { channel: DictionaryFile };

    // 여기에 컨버팅 코드 입력
    for (const item of refData.channel.item) {
      const id = REFERENCE_ID + "_" + item.target_code;

      if (idSet.has(id)) {
        logger.warn(`ID 중복 발생: ${id}`);
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
          logger.info("Use cached multimedia info", thumbnail);
        } else {
          logger.info("fetching multimedia info...", item.target_code);

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
                logger.info("Commercial use is not allowed", multimedia.link);
                continue;
              }

              // img 태그의 src를 불러옴
              const imgSrc = $("img").attr("src");
              if (!imgSrc) {
                logger.warn("Failed to fetch img src", word);
                continue;
              }

              thumbnail = imgSrc;
              await saveMultimediaCache(item.target_code, thumbnail);
              break;
            } catch (e) {
              logger.warn("Failed to fetch multimedia info", e);
            }
          }
        }
      }

      const tags = item.senseinfo.cat_info?.map((cat) => cat.cat) || [];

      if (item.senseinfo.type !== "일반어") {
        tags.push(item.senseinfo.type);
      }

      const simplifiedName = simplifyName(word);
      if (commonWordSet.has(simplifiedName)) {
        tags.push("일상어");
      }

      const url = item.link;

      const muDictItem: MudictDumpItem = {
        sourceId: id,
        name: word,
        simplifiedName,
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
  logger.info("Done.");
};

void run();
