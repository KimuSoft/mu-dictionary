import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDictDump } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as XLSX from "xlsx";
import { CompanyInfo } from "./types";
import { josa } from "es-hangul";

// bun <Command> <Path>
const EXISTING_PATH = process.argv[2] || "./src/kind/상장법인목록.xlsx";
const REFERENCE_ID = "kind";

const result: MuDictDump = {
  items: [],
  default: {
    referenceId: REFERENCE_ID,
    tags: ["기업"],
  },
};

const run = async () => {
  const bufferArray = await readFile(EXISTING_PATH);
  const wb = XLSX.read(bufferArray, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

  const companies: CompanyInfo[] = data.slice(1).map((row) => {
    return {
      companyName: row[0],
      stockCode: parseInt(row[1].toString()),
      industry: row[2],
      mainProducts: row[3],
      listingDate: row[4],
      fiscalMonth: row[5],
      CEOName: row[6],
      website: row[7],
      location: row[8],
    };
  });

  console.info("JSON file loaded.");

  // a/A -> 에이, b -> B 등 단어 안에 포함된 알파벳을 한글 발음으로 변환
  const alphabetToKorean = (word: string) => {
    word = word.replace(/a/gi, "에이");
    word = word.replace(/b/gi, "비");
    // 기업은 시를 씨로 쓰는 경우가 더 많아서 예외처리
    word = word.replace(/c/gi, "씨");
    word = word.replace(/d/gi, "디");
    word = word.replace(/e/gi, "이");
    word = word.replace(/f/gi, "에프");
    word = word.replace(/g/gi, "지");
    word = word.replace(/h/gi, "에이치");
    word = word.replace(/i/gi, "아이");
    word = word.replace(/j/gi, "제이");
    word = word.replace(/k/gi, "케이");
    word = word.replace(/l/gi, "엘");
    word = word.replace(/m/gi, "엠");
    word = word.replace(/n/gi, "엔");
    word = word.replace(/o/gi, "오");
    word = word.replace(/p/gi, "피");
    word = word.replace(/q/gi, "큐");
    word = word.replace(/r/gi, "알");
    word = word.replace(/s/gi, "에스");
    word = word.replace(/t/gi, "티");
    word = word.replace(/u/gi, "유");
    word = word.replace(/v/gi, "브이");
    word = word.replace(/w/gi, "더블유");
    word = word.replace(/x/gi, "엑스");
    word = word.replace(/y/gi, "와이");
    word = word.replace(/z/gi, "지");
    return word;
  };

  for (const company of companies) {
    const nameData = wordConvert(alphabetToKorean(company.companyName));

    if (!nameData) {
      console.error(`Failed to convert ${company.companyName}`);
      continue;
    }

    // <josa(업종, '을/를')>을 전문으로 하고 {josa(주요제품, '을/를')}을 주요 제품으로 하는 {지역}에 위치한 회사. 종목코드는 <종목코드>로, <상장일자>에 상장되었다. 대표자는 <대표자명>이다.
    const definition = `${company.industry ? `${josa(company.industry, "을/를")}을 전문으로 하고 ` : ""}${
      company.mainProducts
        ? `${josa(company.mainProducts, "을/를")} 주요 제품으로 하는 `
        : ""
    }${company.location}에 위치한 회사. 종목코드는 ${company.stockCode}로, 대표자는 ${company.CEOName}이다.`;

    result.items.push({
      ...nameData,
      sourceId: REFERENCE_ID + "_" + company.stockCode,
      definition,
      url: company.website || undefined,
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
