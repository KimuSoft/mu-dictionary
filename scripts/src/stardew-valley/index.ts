import { readdir, readFile } from "fs/promises";
import { MuDictDump } from "../types";
import { parse as yamlParse } from "yaml";
import { StardewValleyStringXnbData } from "./types";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/stardew-valley/data";
const REFERENCE_ID = "stardew_valley";

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["스타듀 밸리"],
  },
};

const run = async () => {
  const files = await readdir(EXISTING_PATH);

  const items: {
    key: string;
    id: string;
    file: string;
    name: string;
    description?: string;
  }[] = [];

  for (const file of files) {
    if (!/ko-KR.*\.yaml$/.test(file)) continue;

    console.info(`Processing ${file}...`);
    const dataStr = await readFile(`${EXISTING_PATH}/${file}`, "utf8");
    const data = yamlParse(dataStr) as StardewValleyStringXnbData;

    for (const key in data.content) {
      const value = data.content[key];
      const id = key.replace(/_Name$|_Description$|_Title$/, "");

      if (/_Description$/.test(key)) {
        continue;
      }

      if (!/Name/.test(file) && !/Name|Title|WorldMap/.test(key)) continue;
      const description = data.content[`${id}_Description`];

      items.push({
        key,
        id,
        file,
        name: value,
        ...(description ? { description: description } : {}),
      });
    }
  }

  // await writeFile("./test.json", JSON.stringify(items, null, 2));

  for (const item of items) {
    if (/[{}]/g.test(item.name)) continue;

    const nameData = wordConvert(item.name);
    if (!nameData) {
      console.error(`Failed to convert ${item.name}`);
      continue;
    }

    const tags = ["스타듀 밸리"];
    let definition = "게임 '스타듀 밸리'에 등장하는 ";

    switch (item.file) {
      case "BigCraftables.ko-KR.yaml":
        definition += `설치 가능한 아이템.`;
        break;

      case "Buildings.ko-KR.yaml":
        definition += `건물.`;
        tags.push("스타듀 밸리/건물");
        break;

      case "EnchantmentNames.ko-KR.yaml":
        definition += `인챈트 이름.`;
        tags.push("스타듀 밸리/인챈트");
        break;

      case "Furniture.ko-KR.yaml":
        definition += `가구 아이템.`;
        tags.push("스타듀 밸리/가구");
        break;

      case "Movies.ko-KR.yaml":
        definition += `영화.`;
        tags.push("스타듀 밸리/영화");
        break;

      case "NPCNames.ko-KR.yaml":
        definition += `등장인물.`;
        tags.push("스타듀 밸리/등장인물");
        break;

      case "Objects.ko-KR.yaml":
        tags.push("스타듀 밸리/아이템");
        definition += `아이템.`;
        break;

      case "Pants.ko-KR.yaml":
        tags.push("스타듀 밸리/의상");
        definition += `바지 아이템.`;
        break;

      case "Shirts.ko-KR.yaml":
        tags.push("스타듀 밸리/의상");
        definition += `상의 아이템.`;
        break;

      case "Weapons.ko-KR.yaml":
        tags.push("스타듀 밸리/무기");
        definition += `무기 아이템.`;
        break;

      case "WorldMap.ko-KR.yaml":
        tags.push("스타듀 밸리/장소");
        definition += `장소.`;
        break;

      default:
        definition += "단어.";
        break;
    }

    definition += item.description
      ? ` ${item.description.replace(/\{.+}/g, "몇 ")}`
      : "";

    const sourceId =
      REFERENCE_ID + "_" + item.file.split(".")[0] + "_" + item.id;

    result.items.push({
      sourceId: sourceId.toLowerCase().replace(/[.\s]/g, "_").replace(/'/g, ""),
      origin: nameData.origin,
      name: nameData.name,
      tags,
      simplifiedName: nameData.simplifiedName,
      definition,
      url: `https://ko.stardewvalleywiki.com/${encodeURI(item.name)}`,
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
