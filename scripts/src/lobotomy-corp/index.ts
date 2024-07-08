import { readdir, readFile, writeFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, MuDictItem, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import { XMLParser } from "fast-xml-parser";
import { LobotomyCreature } from "./types";

// bun <Command> <Path>
const EXISTING_PATH =
  process.argv[2] ||
  "C:/Program Files (x86)/Steam/steamapps/common/LobotomyCorp";
const REFERENCE_ID = "lobotomy_corp";

const result: MuDict = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["로보토미 코퍼레이션", "로보토미 코퍼레이션/환상체"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  const path =
    EXISTING_PATH + "/LobotomyCorp_Data/ExternalData/xml/Language/kr/creatures";
  const parser = new XMLParser();

  const files = await readdir(path);
  for (const file of files) {
    console.info("Parsing:", file);
    const data: LobotomyCreature = parser.parse(
      await readFile(path + "/" + file, "utf8"),
    );

    let nameOrNames = data.creature.observe.collection.name;

    // nameOrNames가 문자열이면 [nameOrNames]로 변환
    if (typeof nameOrNames === "string") {
      nameOrNames = [nameOrNames];
    }

    // await writeFile(
    //   `./src/lobotomy-corp/ㅇㅇ.json`,
    //   JSON.stringify(data, null, 2),
    // );

    let idx = 0;
    for (const name of nameOrNames) {
      idx++;
      const nameData = wordConvert(name);
      if (!nameData) {
        console.warn(
          "Failed to convert:",
          data.creature.observe.collection.name,
        );
        continue;
      }

      let definition = `프로젝트 문의 게임 '로보토미 코퍼레이션'에 등장하는 ${data.creature.observe.collection.riskLevel}급 환상체. 코드 넘버는 '${data.creature.observe.collection.codeNo}'이다.`;

      const defaultDesc =
        // @ts-ignore
        data.creature.observe.desc[0]["#text"] || data.creature.observe.desc[0];
      definition +=
        " " +
        defaultDesc
          .replace(/\$0/g, nameData.origin)
          .replace(/^\[|]$|[{}]|\n/g, " ")
          .replace(/[&#$;0-9]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();

      if (data.creature.observe.specialTipSize) {
        const specialTipSize =
          data.creature.observe.specialTipSize.specialTip[0];
        definition +=
          " " +
          specialTipSize
            .replace(/\$0/g, nameData.origin)
            .replace(/[&#$;]+[0-9]*/g, " ")
            .replace(/\s+/g, " ")
            .replace(/하였다|했다/g, "한다")
            .trim();
      }

      result.items.push({
        sourceId: REFERENCE_ID + "_" + file.replace(".xml", "") + "_" + idx,
        name: nameData.name,
        origin: nameData.origin,
        simplifiedName: nameData.simplifiedName,
        definition,
      });
    }
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
