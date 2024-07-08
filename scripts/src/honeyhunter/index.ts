import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as cheerio from "cheerio";
import axios, { AxiosResponse } from "axios";
import { uniqBy } from "lodash";
import { josa } from "es-hangul";
import removeBraket from "../utils/removeBraket";

// bun <Command> <Path>
const reset = process.argv.includes("--reset");
const skipDetail = process.argv.includes("--skip-detail");
const overwrite = process.argv.includes("--overwrite");
const REFERENCE_ID = "starrail";

const result: MuDict = {
  items: [],
  default: {
    definition: "게임 '붕괴: 스타레일'에 등장하는 단어",
    referenceId: REFERENCE_ID,
    tags: ["붕괴: 스타레일"],
    pos: PartOfSpeech.Noun,
  },
};

const URL = "https://starrail.honeyhunterworld.com/?lang=KR";
const BASE_URL = "https://starrail.honeyhunterworld.com";
const DETAIL_URL = "https://starrail.honeyhunterworld.com/tooltip.php?id=";

const getImageUrl = (id: string) =>
  `https://starrail.honeyhunterworld.com/img/${id}.webp`;

const run = async () => {
  let starrailItems: {
    id?: string;
    name?: string;
    detail?: Record<string, string>;
  }[] = [];

  if (reset) {
    // cache 리셋 경고하고 5초 시간 줌
    console.warn("Cache reset in 5 seconds.");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const res = await axios.get<string>(URL);

    const tabs = res.data
      .match(/href="([^"]+)">/g)
      ?.map((m) => m.replace(/href="|">/g, ""))
      .filter((m) => !m.includes("."));

    if (!tabs) {
      console.error("Tabs not found.");
      return;
    }

    console.info(`find ${tabs.length} tabs.`, tabs);

    for (const tab of tabs) {
      console.log(`fetching ${tab}`);

      let res: AxiosResponse<string, any>;

      try {
        res = await axios.get<string>(BASE_URL + tab);
      } catch (e) {
        console.error("Fetch failed.", tab, e);
        continue;
      }

      for (const script of res.data.split(/<\/?script>/)) {
        const data = script.match(
          /sortable_data.push\((.+)\).*\n?.+sortable_cur_page.push/g,
        );

        if (!data) {
          continue;
        }

        // null check
        const arrStr = data[0]
          .replace(/sortable_data.push\(|\);sortable_cur_page.push/g, "")
          .replace(/^[^(]+\(]/, "");

        // 일단 res.data 저장
        await writeFile("./src/honeyhunter/test.html", data);

        let arr: string[][] = [[]];
        try {
          arr = JSON.parse(arrStr);
        } catch (e) {
          console.error("JSON parse failed.", tab, e);

          // 저장하고 리턴
          await writeFile(
            `./src/honeyhunter/failed_${tab.replace(/[/?=.]/g, "_")}.html`,
            res.data,
          );
          await writeFile(
            `./src/honeyhunter/failed_${tab.replace(/[/?=.]/g, "_")}.json`,
            arrStr,
          );

          return;
        }

        const items = arr.map((a) => {
          const id = a[1]
            ?.match(/"(.+)"/)?.[0]
            ?.replace(/["/]|\?lang=(KR|EN)/gi, "");
          const name = a[1]
            ?.match(/>(.+)</)?.[0]
            ?.replace(/[<>]/g, "")
            ?.replace(/ /g, " ");

          return {
            id,
            name,
          };
        });

        console.info(`find ${items.length} items.`);
        starrailItems.push(...items);
      }

      // 일단 res.data 저장
      await writeFile(
        "./src/honeyhunter/cache.json",
        JSON.stringify(starrailItems, null, 2),
      );

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } else {
    // 캐시 불러옴
    console.info("Loading cache...");
    starrailItems.push(
      ...(JSON.parse(
        await readFile("./src/honeyhunter/cache.json", "utf8"),
      ) as {
        id?: string;
        name?: string;
      }[]),
    );
  }

  // id가 없는 거 제거
  starrailItems = starrailItems.filter((item) => item.id);

  // .replace(/\?lang=EN/gi, "").replace(/[~%]/g, "")
  starrailItems = starrailItems.map((item) => {
    if (item.id) {
      item.id = item.id.replace(/\?lang=EN/gi, "").replace(/[~%]/g, "");
    }
    return item;
  });

  // lodash를 사용해서 id 중복 제거
  console.info("중복 제거 중...");
  starrailItems = uniqBy(starrailItems, "id");

  if (!skipDetail) {
    // genshinitem을 id 기준으로 sort
    starrailItems.sort((a, b) => {
      if (!a.id || !b.id) return 0;
      return a.id.localeCompare(b.id);
    });

    for (const item of starrailItems) {
      if (!item.id) {
        console.error("ID not found.", item);
        continue;
      }
      // 이미 detail이 있는 경우
      if (!overwrite && item.detail && JSON.stringify(item.detail) !== "{}") {
        // console.info(`detail already exists ${item.id}`);
        continue;
      }

      console.info(`fetching detail ${item.id}`);

      let res: AxiosResponse<string, any>;

      try {
        res = await axios.get<string>(DETAIL_URL + item.id + "&lang=kr");
      } catch (e) {
        console.error("Fetch failed.", item.id, e);
        continue;
      }

      const $ = cheerio.load(res.data);

      // tr 태그 안에 있는 td 태그 첫 번째는 key, 두 번째는 value
      const detail: Record<string, string> = {};
      $("tr").each((index, element) => {
        const key = $(element)
          .find("td")
          .first()
          .text()
          .toLowerCase()
          .replace(/\s/g, "_")
          .replace(/ /g, " ")
          .trim();
        const value = $(element)
          .find("td")
          .last()
          .text()
          .replace(/ /g, " ")
          .trim();
        detail[key] = value;
      });

      // 첫 번째 이미지 태그의 src를 thumbnail로 설정
      const thumbnail = $("img").first().attr("src");
      if (thumbnail)
        detail["thumbnail"] =
          "https://starrail.honeyhunterworld.com" + thumbnail;

      item.detail = detail;

      // 저장
      await writeFile(
        "./src/honeyhunter/cache.json",
        JSON.stringify(starrailItems, null, 2),
      );

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // 여기에 컨버팅 코드 입력
  for (const item of starrailItems) {
    if (!item.name || !item.id) continue;

    const nameData = wordConvert(removeBraket(item.name));
    if (!nameData) {
      console.error("Failed to convert", item.name);
      continue;
    }

    if (!item.detail) {
      result.items.push({
        ...nameData,
        thumbnail: getImageUrl(item.id),
        sourceId: REFERENCE_ID + "_" + item.id,
        url: `https://starrail.honeyhunterworld.com/${item.id}/?lang=KR`,
      });
      continue;
    }

    const tags: string[] = ["붕괴: 스타레일"];
    let definition = "게임 '붕괴: 스타레일'에 등장하는 ";

    if (item.id.endsWith("-achievement")) {
      tags.push("붕괴: 스타레일/업적");
      definition += `'${item.detail["시리즈_업적"]}'의 ${item.detail["열기"] === "❌" ? "히든 " : ""}업적. ${item.detail["설명"]} 달성 시 ${item.detail["획득_가능한_보상"]}을 획득할 수 있다.`;
    } else if (item.id.endsWith("-item")) {
      let additionalDescription = "";

      if (item.detail["운명의_길"]) {
        tags.push("붕괴: 스타레일/광추");
        additionalDescription = `${item.detail["운명의_길"]} 광추. ${item.detail["전투_스킬"]} `;
      } else {
        additionalDescription = `${item.detail["유형"]}. `;
      }

      definition += `${additionalDescription}${item.detail["설명"] || ""}`;
    } else if (item.id.endsWith("-character")) {
      tags.push("붕괴: 스타레일/캐릭터");
      definition += `${item.detail["소속"]} 소속 ${item.detail["운명의_길"]} 운명의 길의 ${item.detail["전투_속성"]} 속성 캐릭터. ${item.detail["스토리"]} (CV. ${item.detail["한국어"]})`;
    } else {
      definition += "단어.";
      if (item.detail["설명"]) definition += " " + item.detail["설명"];
    }

    result.items.push({
      ...nameData,
      definition: definition.trim(),
      thumbnail: item.detail["thumbnail"],
      tags,
      sourceId:
        REFERENCE_ID +
        "_" +
        item.id.replace(/\?lang=EN/gi, "").replace(/[~%]/g, ""),
      url: `https://starrail.honeyhunterworld.com/${item.id}/?lang=KR`,
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
