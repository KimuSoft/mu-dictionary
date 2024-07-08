import { readdir, readFile } from "fs/promises";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import * as XLSX from "xlsx";
import { wordConvert } from "../utils/wordConvert";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { BusStopData } from "./type";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/bus/data";
const REFERENCE_ID = "bus";

const result: MuDict = {
  items: [],
  default: {
    definition: "",
    referenceId: REFERENCE_ID,
    tags: ["대중교통"],
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

    const jsonData: BusStopData[] = data.slice(1).map((row) => {
      return {
        stopNumber: row[0],
        stopName: row[1],
        latitude: row[2],
        longitude: row[3],
        mobileNumber: row[5],
        cityCode: row[6],
        cityFullName: row[7],
        cityName: row[8],
      };
    });

    for (const item of jsonData) {
      if (!item.stopName) continue;
      const nameData = wordConvert(
        item.stopName.replace(/\([^)]+\)/g, "").replace(/\[[^\]]+]/g, ""),
      );

      if (!nameData) {
        console.log(`Failed to convert ${item.stopName}`);
        continue;
      }

      const mobileNumberStr = item.mobileNumber
        ? `, 모바일단축번호는 '${item.mobileNumber}'이다.`
        : "이다.";

      const definition = `${item.cityFullName}에 위치한 버스 정류장. 정류장 번호는 '${item.stopNumber}'${mobileNumberStr}`;

      const muDictItem: MuDictItem = {
        sourceId: REFERENCE_ID + "_" + item.stopNumber,
        ...result.default,
        ...nameData,
        definition,
        tags: [
          "대중교통",
          "대중교통/버스",
          "대중교통/버스/" +
            (item.cityFullName === "서울특별시" ? "서울" : item.cityName),
        ],
        url: `https://www.google.co.kr/maps/place/${item.latitude},${item.longitude}`,
      };

      result.items.push(muDictItem);
    }
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
