import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as XLSX from "xlsx";
import { SubwayStation } from "./types";
import { josa } from "es-hangul";

// bun <Command> <Path>
const EXISTING_PATH =
  process.argv[2] || "./src/kric-station/전체_도시철도역사정보_20240331.xlsx";
const REFERENCE_ID = "kric_station";

const result: MuDict = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["대중교통"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info(`Loading file...`);

  const bufferArray = await readFile(EXISTING_PATH);
  const wb = XLSX.read(bufferArray, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

  const stations: SubwayStation[] = data.slice(1).map((row) => {
    return {
      stationCode: row[0],
      stationName: row[1],
      lineCode: row[2],
      lineName: row[3],
      englishStationName: row[4],
      chineseStationName: row[5],
      transferType: row[6],
      transferLineCode: row[7],
      transferLineName: row[8],
      latitude: parseFloat(row[9]),
      longitude: parseFloat(row[10]),
      operatingAgency: row[11],
      address: row[12],
      phoneNumber: row[13],
      dataStandardDate: row[14],
    };
  });

  // 여기에 컨버팅 코드 입력
  for (const station of stations) {
    // 부역명 처리
    let name = station.stationName;
    let originName = station.chineseStationName;

    if (/\(.+\)/.test(name)) {
      // @ts-ignore
      const subName = name.match(/\((.+)\)/)[1]!;
      name = name.replace(/\(.+\)/g, "").trim();

      // @ts-ignore
      const subNameOrigin = originName.match(/\((.+)\)/)?.[1]!;
      originName = originName.replace(/\(.+\)/g, "").trim();

      const subNameData = wordConvert(subName);
      if (subNameData) {
        // <josa(운영기관명, '이/가') 운영하는 <노선명> <환승역구분>. <역사도로명주소>에 위치하였으며, 역번호는 '<역번호>'. 역 전화번호는 <역 전화번호>이다. (환승역일 경우)  <환승노선명.replace(/+/, ', ')>로 갈아탈 수 있는 환승역이다.
        const subDefinition = `${josa(
          station.operatingAgency,
          "이/가",
        )} 운영하는 ${station.lineName} ${name}역의 부역명.`;

        const item: MuDictItem = {
          sourceId: `${REFERENCE_ID}_${station.lineCode}_${station.stationCode}_sub`,
          name: subNameData.name + "역",
          simplifiedName: subNameData.simplifiedName + "역",
          origin: (subNameOrigin?.replace(/\s/g, "") || subName) + "驛",
          definition: subDefinition,
          tags: [
            "대중교통",
            "대중교통/철도",
            "대중교통/철도/부역명",
            "대중교통/철도/" + station.lineName.trim(),
          ],
          url: `https://www.google.co.kr/maps/place/${station.latitude},${station.longitude}`,
        };

        result.items.push(item);
      } else {
        console.error(`Failed to convert ${subName}`);
      }
    }

    const nameData = wordConvert(name);
    if (!nameData) {
      console.error(`Failed to convert ${name}`);
      continue;
    }

    // <josa(운영기관명, '이/가') 운영하는 <노선명> <환승역구분>. <역사도로명주소>에 위치하였으며, 역번호는 '<역번호>'. 역 전화번호는 <역 전화번호>이다. (환승역일 경우)  <환승노선명.replace(/+/, ', ')>로 갈아탈 수 있는 환승역이다.
    const definition = `${josa(
      station.operatingAgency,
      "이/가",
    )} 운영하는 ${station.lineName} ${station.transferType}. ${station.address}에 위치하였으며, 역번호는 '${station.stationCode}'. 역 전화번호는 ${station.phoneNumber}이다. ${
      station.transferLineName
        ? `${josa(station.transferLineName.replace(/\+/g, ", "), "으로/로")} 환승할 수 있다.`
        : ""
    }`;

    const item: MuDictItem = {
      sourceId: `${REFERENCE_ID}_${station.lineCode}_${station.stationCode}`,
      name: nameData.name + (!nameData.name.endsWith("역") ? "역" : ""),
      tags: [
        "대중교통",
        "대중교통/철도",
        "대중교통/철도/" + station.lineName.trim(),
      ],
      simplifiedName:
        nameData.simplifiedName + (!nameData.name.endsWith("역") ? "역" : ""),
      origin: originName.replace(/-\s/g, "")
        ? originName?.replace(/\s/g, "") +
          (!nameData.name.endsWith("역") ? "驛" : "")
        : nameData.name,
      definition,
      url: `https://www.google.co.kr/maps/place/${station.latitude},${station.longitude}`,
    };

    result.items.push(item);
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
