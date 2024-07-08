import { readFile } from "fs/promises";
import { wordConvert } from "../utils/wordConvert";
import { MuDict, PartOfSpeech } from "../types";
import { exportMuDictJson } from "../utils/exportMuDictJson";
import * as XLSX from "xlsx";
import { Movie } from "./types";

// bun <Command> <Path>
const EXISTING_PATH =
  process.argv[2] || "./src/kobis/영화정보 리스트_2024-06-13.xls";
const REFERENCE_ID = "kobis";

const result: MuDict = {
  items: [],
  default: {
    definition: "~에 등장하는 단어",
    referenceId: REFERENCE_ID,
    tags: ["영화"],
    pos: PartOfSpeech.Noun,
  },
};

const run = async () => {
  console.info("Loding JSON file...");

  const bufferArray = await readFile(EXISTING_PATH);
  const wb = XLSX.read(bufferArray, { type: "buffer" });

  const movies: Movie[] = [];
  const convertMovieObject = (row: string[]) => {
    return {
      title: row[0],
      englishTitle: row[1],
      productionYear: parseInt(row[2]),
      productionCountry: row[3],
      type: row[4],
      genre: row[5],
      productionStatus: row[6],
      director: row[7],
      productionCompany: row[8],
    };
  };

  // first sheet
  console.info("Loading first sheet...");
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

  movies.push(...data.slice(5).map(convertMovieObject));

  // second sheet
  console.info("Loading second sheet...");
  const ws2 = wb.Sheets[wb.SheetNames[1]];
  const data2 = XLSX.utils.sheet_to_json<string[]>(ws2, { header: 1 });

  movies.push(...data2.slice(5).map(convertMovieObject));

  let idx = 0;

  // 키뮤사전 형식으로 변환
  for (const movie of movies) {
    idx++;

    const nameData = wordConvert(movie.title.replace(/\(.+\)/g, ""));
    if (!nameData) {
      console.warn(`Failed to convert ${movie.title}`);
      continue;
    }

    const tags = ["영화"];

    if (movie.productionCountry) {
      tags.push("영화/" + movie.productionCountry.trim());
    }

    result.items.push({
      ...nameData,
      tags,
      sourceId: REFERENCE_ID + "_" + idx,
      // <제작연도>년 <제작국가>에서 제작된 <감독> 감독의 <유형> <장르> 영화. 제작사는 <제작사>이다.
      definition:
        `${movie.productionYear}년 ${movie.productionCountry}에서 제작된 ${
          movie.director ? `${movie.director} 감독의 ` : ""
        }${movie.type} ${movie.genre.replace(/,/, ", ")} 영화.` +
        (movie.productionCompany
          ? ` 제작사는 ${movie.productionCompany}이다.`
          : ""),
    });
  }

  // 종료 단계
  await exportMuDictJson(REFERENCE_ID, result);
  console.info("Done.");
};

run().then();
