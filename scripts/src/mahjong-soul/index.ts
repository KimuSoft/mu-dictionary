import { readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import axios from "axios";
import * as cheerio from "cheerio";
import { write } from "xlsx";
import toUnicodeId from "../utils/toUnicodeId";
import { uniqBy } from "lodash";
import { loadCache, saveCache } from "../utils/cache";

// bun <Command> <Path>
const EXISTING_PATH = "./src/mahjong-soul";
const REFERENCE_ID = "mahjong-soul";

const isReset = process.argv.includes("--reset");

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
  let items: {
    id: string;
    itemType: string;
    name: string;
    url: string;
    isWord?: boolean;
    detail?: Record<string, string>;
  }[] = [];

  if (!isReset) {
    items = (await loadCache(REFERENCE_ID)) || [];
  }

  if (!items.length) {
    const res = await axios.get(
      "https://mahjongsoul.club/frontpage/menupage?language=ko",
    );

    const $ = cheerio.load(res.data);

    // div class=view-content 안에 있는 a 태그 텍스트를 리스트에 담음
    $("li.views-fluid-grid-inline.views-fluid-grid-item.views-row").each(
      (idx, element$): any => {
        const element = $(element$);
        const url = element.find("a").first().attr("href");

        const id = decodeURIComponent(url?.split("?")[0] || "").replace(
          /^\//g,
          "",
        );

        if (!id) return;

        items.push({
          name: element.text().trim(),
          url: BASE_URL + url,
          id: id.split("/")[1],
          itemType: id.split("/")[0],
        });
      },
    );
  }

  // 중복 id 제거 uniqBy
  items = uniqBy(items, "id");

  await saveCache(REFERENCE_ID, items);

  // 디테일 쿼리
  for (const item of items) {
    if (item.isWord === true && item.detail) continue;

    if (
      item.itemType === "news" ||
      item.name.startsWith("기본 - ") ||
      item.name.startsWith("계약 후 - ")
    ) {
      item.isWord = false;
      continue;
    }

    item.isWord = true;
    console.info("Loading", item.name, item.url);
    const res = await axios.get(item.url);
    const $ = cheerio.load(res.data);
    const detail: Record<string, string> = {};

    const pageTitle = $("#page-title").text().trim();
    if (pageTitle) detail.title = pageTitle;

    $(".view-display-id-block_14")
      .find("div.views-field")
      .each((idx, element$): any => {
        const keyAndVal = $(element$).text().trim();
        if (!keyAndVal.includes(":")) return;

        const title = keyAndVal.split(":")[0].trim();
        const value = keyAndVal.split(":")[1].trim();

        detail[title] = value;
      });

    const defaultSkinUrl = items.find(
      (it) => it.name === "기본 - " + item.name,
    );

    if (defaultSkinUrl) {
      const defaultSkinRes = await axios.get(defaultSkinUrl.url);

      console.info("Loading", defaultSkinUrl.name, defaultSkinUrl.url);
      const defaultSkin$ = cheerio.load(defaultSkinRes.data);
      // td .views-field-field-imagebighead의 첫 번째 자식의 href

      await writeFile("test.html", defaultSkinRes.data);
      const defaultSkinThumbnail = defaultSkin$(
        "td.views-field-field-imagebighead",
      )
        .first()
        .children()
        .attr("href");

      if (defaultSkinThumbnail) detail.thumbnail = defaultSkinThumbnail;
    } else {
      if (item.itemType === "character")
        console.warn("Default skin not found: ", item.name);
    }

    if (!detail.thumbnail) {
      // 첫 번째 img 태그의 parent의 src attr을 가져와서 썸네일로 저장
      const thumbnail = $("img").attr("src");
      if (thumbnail) {
        detail.thumbnail = thumbnail;
      } else {
        console.warn("Thumbnail not found: ", item.name);
      }
    }

    // div.field-type-text-with-summary 의 text를 가져와서 detail에 저장
    detail.description = $(".field-type-text-with-summary").first().text();

    item.detail = detail;

    await saveCache(REFERENCE_ID, items);
  }

  for (const item of items) {
    if (!item.isWord) continue;

    const nameData = wordConvert(item.detail?.title || item.name);
    if (!nameData) continue;

    const tags = ["작혼"];
    let description = "게임, '작혼: 리치 마작'에 등장하는 ";

    if (
      item.detail?.["ABO"] ||
      item.detail?.["Sex"] ||
      item.detail?.["VoiceActor"] ||
      item.detail?.["Birthday"]
    ) {
      tags.push("작혼/캐릭터");

      const bloodTypeStr = item.detail["ABO"]
        ? `이며, 혈액형은 ${item.detail["ABO"]}형.`
        : "이다.";
      description += `${item.detail["Sex"]} 작사 캐릭터. 생일은 ${item.detail?.["Birthday"]?.replace(/월(\d)/, "월 $1") || "알 수 없음"}${bloodTypeStr}`;
    } else if (item.itemType === "inventory") {
      tags.push("작혼/아이템");
      description += "아이템.";
    } else if (item.itemType === "achievement") {
      tags.push("작혼/업적");
      description += "업적.";
    } else if (item.itemType === "title") {
      tags.push("작혼/칭호");
      description += "칭호.";
    } else {
      description += "단어.";
    }

    description += " " + item.detail?.description.replace(/\n/g, " ");
    description = description.replace(/\s+/g, " ");

    result.items.push({
      ...nameData,
      origin: item.detail?.["Kana"] || nameData.origin,
      url: item.url,
      thumbnail: item.detail?.thumbnail,
      sourceId: REFERENCE_ID + "_" + toUnicodeId(item.id),
      definition: description,
      tags,
      metadata: {
        japaneseName: item.detail?.["Kana"],
        height: item.detail?.["Height"],
        age: item.detail?.["Age"],
        sex: item.detail?.["Sex"],
        bloodType: item.detail?.["ABO"],
        birthMonth:
          parseInt(item.detail?.["Birthday"]?.split("월")[0] || "") ||
          undefined,
        birthDay:
          parseInt(
            item.detail?.["Birthday"]?.split("월")[1]?.replace("일", "") || "",
          ) || undefined,
        japaneseVoiceActor: item.detail?.["VoiceActor"],
      },
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
