import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as cheerio from "cheerio";
import axios, { AxiosResponse } from "axios";
import { uniqBy } from "lodash";

// bun <Command> <Path>
const reset = process.argv.includes("--reset");
const skipDetail = process.argv.includes("--skip-detail");
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

const URL = "https://gensh.honeyhunterworld.com/fam_currency/?lang=KO";
const BASE_URL = "https://gensh.honeyhunterworld.com";
const DETAIL_URL = "https://gensh.honeyhunterworld.com/tooltip.php?id=";

const getImageUrl = (id: string) =>
  `https://gensh.honeyhunterworld.com/img/${id}.webp`;

const run = async () => {
  let genshinItems: {
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
        await writeFile("./src/honeyimpact/test.html", data);

        let arr: string[][] = [[]];
        try {
          arr = JSON.parse(arrStr);
        } catch (e) {
          console.error("JSON parse failed.", tab, e);

          // 저장하고 리턴
          await writeFile(
            `./src/honeyimpact/failed_${tab.replace(/[/?=.]/g, "_")}.html`,
            res.data,
          );
          await writeFile(
            `./src/honeyimpact/failed_${tab.replace(/[/?=.]/g, "_")}.json`,
            arrStr,
          );

          return;
        }

        const items = arr.map((a) => {
          const id = a[1]
            ?.match(/"(.+)"/)?.[0]
            ?.replace(/["/]|\?lang=KO/gi, "");
          const name = a[1]?.match(/>(.+)</)?.[0]?.replace(/[<>]/g, "");

          return {
            id,
            name,
          };
        });

        console.info(`find ${items.length} items.`);
        genshinItems.push(...items);
      }

      // 일단 res.data 저장
      await writeFile(
        "./src/honeyimpact/cache.json",
        JSON.stringify(genshinItems, null, 2),
      );

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } else {
    // 캐시 불러옴
    console.info("Loading cache...");
    genshinItems.push(
      ...(JSON.parse(
        await readFile("./src/honeyimpact/cache.json", "utf8"),
      ) as {
        id?: string;
        name?: string;
      }[]),
    );
  }

  // id가 없는 거 제거
  genshinItems = genshinItems.filter((item) => item.id);

  // lodash를 사용해서 id 중복 제거
  console.info("중복 제거 중...");
  genshinItems = uniqBy(genshinItems, "id");

  if (!skipDetail) {
    // genshinitem을 id 기준으로 sort
    genshinItems.sort((a, b) => {
      if (!a.id || !b.id) return 0;
      return a.id.localeCompare(b.id);
    });

    for (const item of genshinItems) {
      if (!item.id) {
        console.error("ID not found.", item);
        continue;
      }
      // 이미 detail이 있는 경우
      if (item.detail) {
        // console.info(`detail already exists ${item.id}`);
        continue;
      }

      console.info(`fetching detail ${item.id}`);

      let res: AxiosResponse<string, any>;

      try {
        res = await axios.get<string>(DETAIL_URL + item.id + "&lang=ko");
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
          .trim();
        const value = $(element).find("td").last().text().trim();
        detail[key] = value;
      });

      item.detail = detail;

      // 저장
      await writeFile(
        "./src/honeyimpact/cache.json",
        JSON.stringify(genshinItems, null, 2),
      );

      // 500ms 대기
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // 여기에 컨버팅 코드 입력
  for (const item of genshinItems) {
    if (!item.name || !item.id) continue;

    const nameData = wordConvert(item.name);
    if (!nameData) {
      console.error("Failed to convert", item.name);
      continue;
    }

    if (!item.detail) {
      result.items.push({
        ...nameData,
        thumbnail: getImageUrl(item.id),
        sourceId: REFERENCE_ID + "_" + item.id,
      });
      continue;
    }

    let definition = "게임 '원신'에 등장하는 ";

    if (item.id.startsWith("a_")) {
      definition += `'${item.detail["parent_category"]}'의 ${item.detail["shown"] === "❌" ? "히든 " : ""}업적. ${item.detail["description"]} 달성 시 ${item.detail["reward"]}을 획득할 수 있다.`;
    } else if (item.id.startsWith("ch_")) {
      let questType = "퀘스트";
      if (item.detail["sub"] === "Event Quests") questType = "이벤트 스토리";
      else if (item.detail["sub"] === "Archon Quests") questType = "마신 임무";
      else if (item.detail["sub"] === "World Quests") questType = "월드 임무";
      else if (item.detail["sub"] === "Hangout Quests")
        questType = "초대 이벤트";

      const subQuest = item.detail["title"]
        ? ` '${item.detail["title"]}'의 임무.`
        : ".";

      definition += `${questType}${subQuest}`;
    } else if (item.id.startsWith("com_")) {
      definition += `일일 임무. ${item.detail["description"]}. 목표는 ${item.detail["objective"]}`;
    } else if (item.id.startsWith("d_")) {
      let domainType = "비경";
      if (item.detail["sub"] === "Boss") domainType = "주간 보스 비경.";
      else if (item.detail["sub"] === "Regular Domain")
        domainType = "일반 비경";
      else if (item.detail["sub"] === "Event") domainType = "이벤트 전용 비경";

      definition += `비경. ${item.detail["description"] || ""}`;
    } else {
      definition += "단어.";
      if (item.detail["description"])
        definition += " " + item.detail["description"];
    }

    result.items.push({
      ...nameData,
      definition: definition.trim(),
      thumbnail: getImageUrl(item.id),
      sourceId: REFERENCE_ID + "_" + item.id,
      url: `https://gensh.honeyhunterworld.com/${item.id}/?lang=KO`,
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
