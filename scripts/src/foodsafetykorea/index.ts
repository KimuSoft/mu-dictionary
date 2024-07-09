import { readdir, readFile, writeFile } from "fs/promises";
import { MuDictDump, MudictDumpItem } from "../types";
import * as XLSX from "xlsx";
import { FoodNutritionInfo } from "./types";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { josa } from "es-hangul";
import removeBraket from "../utils/removeBraket";
import { PartOfSpeech } from "mudict-api-types";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/foodsafetykorea/data";
const REFERENCE_ID = "foodsafetykorea";

const result: MuDictDump = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: ["식품"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info("Loding files...");
  // EXISTING_PATH 내에 있는 모든 xlsx 파일 로드
  const files = (await readdir(EXISTING_PATH)).filter((file) =>
    file.endsWith(".xlsx"),
  );

  // files에서 for문을 돌며 각 파일을 로드
  for (const file of files) {
    console.info(`Loading ${file}...`);

    const bufferArray = await readFile(`${EXISTING_PATH}/${file}`);
    const wb = XLSX.read(bufferArray, { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

    const jsonData: FoodNutritionInfo[] = data.slice(1).map((row) => {
      return {
        sampleId: row[1],
        FoodCode: row[2],
        FoodGroup: row[3],
        CommercialProduct: row[4],
        FoodName: row[5],
        Year: parseInt(row[6]),
        ManufacturerDistributor: row[7],
        FoodCategory: row[8],
        FoodSubcategory: row[9],
        ServingSizePerMeal: parseInt(row[10]),
        ContentUnit: row[11],
        TotalContentGrams: row[12] === "-" ? null : parseInt(row[12]),
        TotalContentMilliliters: row[13] === "-" ? null : parseInt(row[13]),
        EnergyKcal: parseInt(row[14]),
      };
    });

    for (const item of jsonData) {
      const nameData = wordConvert(removeBraket(item.FoodName));

      if (!nameData) {
        console.log(`Failed to convert ${item.FoodName}`);
        continue;
      }

      // <연도>년 <제조사>가 제조한 <식품상세분류> 식품. 1회 제공량은 <1회 제공량><내용량 단위>이며, 열량은 <열량>㎉이다..
      const definition = `${item.Year}년 ${josa(item.ManufacturerDistributor, "이/가")} 제조한 ${item.FoodSubcategory} 식품. 1회 제공량은 ${item.ServingSizePerMeal}${item.ContentUnit}이며, 열량은 ${item.EnergyKcal}㎉이다.`;

      const muDictItem: MudictDumpItem = {
        sourceId: REFERENCE_ID + "_" + item.FoodCode,
        ...result.default,
        ...nameData,
        tags: [
          "식품",
          "식품/" + removeBraket(item.FoodCategory.replace(/\//g, "·")),
        ],
        definition,
        url: `https://various.foodsafetykorea.go.kr/nutrient/general/food/firstList.do?searchText=${encodeURI(item.FoodName)}`,
      };

      result.items.push(muDictItem);
    }
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
