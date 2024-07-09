import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import axios from "axios";
import * as cheerio from "cheerio";
import { write } from "xlsx";
import toUnicodeId from "../utils/toUnicodeId";
import { uniqBy } from "lodash";

// bun <Command> <Path>
const EXISTING_PATH = "./src/mahjong-soul";
const REFERENCE_ID = "mahjong-soul";

const result: MuDictDump = {
  items: [],
  default: {
    definition: "게임, '작혼: 리치 마작'에 등장하는 단어.",
    referenceId: REFERENCE_ID,
    tags: ["작혼"],
  },
};

const BASE_URL = "https://mahjongsoul.club";

const run = async () => {
  const res = await axios.get(
    "https://mahjongsoul.club/frontpage/menupage?language=ko",
  );

  const $ = cheerio.load(res.data);

  let items: { id: string; name: string; url: string }[] = [];

  // div class=view-content 안에 있는 a 태그 텍스트를 리스트에 담음
  $(
    "li.views-fluid-grid-inline.views-fluid-grid-item.views-row.views-row-odd",
  ).each((idx, element$): any => {
    const element = $(element$);
    const url = element.find("a").first().attr("href");

    const id = decodeURIComponent(url?.split("?")[0] || "");

    if (!id) return;

    items.push({
      name: element.text().trim(),
      url: BASE_URL + url,
      id,
    });
  });

  // 중복 id 제거 uniqBy
  items = uniqBy(items, "id");

  // json 저장
  await writeFile(`${EXISTING_PATH}/data.json`, JSON.stringify(items, null, 2));

  for (const item of items) {
    const nameData = wordConvert(item.name);

    if (!nameData) continue;

    result.items.push({
      ...nameData,
      url: item.url,
      sourceId: REFERENCE_ID + "_" + toUnicodeId(item.id),
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
