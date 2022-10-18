/*
  국토교통부 KRiC 표준데이터 역사정보
  https://data.kric.go.kr/rips/M_01_01/detail.do?id=32

  ※ xlsx 파일을 다운받아주세요
 */

import { IWord } from "../../types"
import xlsx from "node-xlsx"
import path from "path"
import fs from "fs"

const fileName = "전체_도시철도역사정보_20221007.xlsx"

// 역사번호, 역사명, 노선번호, 노선명, 영어역사명, 한자역사명, 환승역구분, 운영기관명, 역사도로명주소
interface Station {
  code: string
  name: string
  lineNumber: string
  lineName: string
  englishName: string
  chineseName: string
  transferStation: string
  operatingAgency: string
  address: string
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
    if (index === 1) continue

    let name = row[1]

    const subNameReg = /\((.+)\)/
    if (subNameReg.test(row[1]))
      try {
        // 부역명 검사를 해야 함!
        /*
      명 덕
(2·28민주운동기념회관)
       */
        const station: Station = {
          code: row[0],
          name: convertName(row[1]),
          lineNumber: row[2],
          lineName: row[3],
          englishName: row[4],
          chineseName: row[5],
          transferStation: row[6],
          operatingAgency: row[11],
          address: row[12],
        }
        // if (!checkWordCondition(word.name)) continue
        // words.push({
        //   name: convertName(seriesName),
        //   simpleName: getSimpleName(seriesName),
        //   wordClass: WordClass.Noun,
        //   definition: convertSeriesDefinition(foodData),
        //   tags: ["food"],
        //   reference: "foodSafetyKorea",
        // })
      } catch (error) {
        console.error(error)
        console.warn(`Failed to parse: ${row}`)
      }
  }

  console.info(`Finish to convert: ${fileName}`)
  return words
}

const convertName = (name: string) => {
  name = name.replace(/\(.*\)/g, "").replace(/\s/g, "")
  if (!name.endsWith("역")) name += "역"

  return name
}

const result = convert(fileName)

// save json
fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(result, null, 2)
)
