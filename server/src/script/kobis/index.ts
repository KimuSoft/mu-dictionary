/*
  영화관 입장권 통합전산망
  https://www.kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do

  ※ xlsx 파일을 다운받아주세요
 */

import { IWord, WordClass } from "../../types"
import xlsx from "node-xlsx"
import path from "path"
import fs from "fs"
import checkWordCondition from "../../utils/checkWordCondition"
import getSimpleName from "../../utils/getSimpleName"

const fileName = "영화정보 리스트_2022-10-18.xls"

// 역사번호, 역사명, 노선번호, 노선명, 영어역사명, 한자역사명, 환승역구분, 운영기관명, 역사도로명주소
interface Movie {
  name: string
  years: string
  region: string
  shortOrLong: string
  genre: string
  director: string
  production: string
}

const convert = (fileName: string): IWord[] => {
  console.info(`Start to parse: ${fileName}`)
  const workSheetsFromFile = xlsx.parse(path.join(__dirname, fileName))

  console.info(`Start to convert: ${fileName}`)
  const workSheet = workSheetsFromFile[0]

  const words: IWord[] = []
  let index: number = 0
  for (const row of workSheet.data as string[][]) {
    index++
    if (index <= 5) continue

    try {
      const movie: Movie = {
        name: convertName(row[0]),
        years: row[2],
        region: row[3],
        shortOrLong: row[4],
        genre: row[5],
        director: row[7],
        production: row[8],
      }

      if (movie.genre.includes("에로")) continue

      if (!checkWordCondition(movie.name)) {
        console.warn(`Invalid word: ${movie.name}`)
        continue
      }

      words.push({
        name: movie.name,
        simpleName: getSimpleName(movie.name),
        wordClass: WordClass.Noun,
        definition: convertDefinition(movie),
        tags: ["movie"],
        reference: "kobis",
      })
    } catch (error) {
      console.error(error)
      console.warn(`Failed to parse: ${row}`)
    }
  }

  console.info(`Finish to convert: ${fileName}`)
  return words
}

const convertName = (name: string) => {
  name = name
    .trim()
    .replace(/[\s:~\-–,/_+]/g, "^")
    .replace(/[(\[].*[)\]]/g, "")
    .replace(/[.!?'"‘′“”…<>#]/g, "")
    .replace(/·/g, "ㆍ")
    .replace(/X/gi, "엑스")
    .replace(/&/gi, "^앤드^")
    .replace(/VS/gi, "브이에스")
    .replace(/3D/gi, "스리디")
    .replace(/vol/gi, "볼륨")
    .replace(/cm/gi, "센티미터")
    .replace(/go/gi, "고")
    .replace(/the/gi, "더")
    .replace(/\^+/g, "^")

  return name
}

const convertDefinition = (movie: Movie) => {
  return `${movie.years}년 개봉한 ${movie.region.replace(
    /[.,\/]/g,
    "ㆍ"
  )}의 ${movie.genre.replace(/[.,\/]/g, "ㆍ")} ${movie.shortOrLong}영화. ${
    movie.director || movie.production
      ? `${movie.director ? `${movie.director} 감독` : ""}${
          movie.production ? `, 제작사는 ${movie.production}이다.` : " 제작."
        }`
      : ""
  }`
}

fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(convert(fileName), null, 2)
)
