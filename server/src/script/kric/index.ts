/*
  국토교통부 KRiC 표준데이터 역사정보
  https://data.kric.go.kr/rips/M_01_01/detail.do?id=32

  ※ xlsx 파일을 다운받아주세요
 */

import { IWord, WordClass } from "../../types"
import xlsx from "node-xlsx"
import path from "path"
import fs from "fs"

const fileName = "전체_도시철도역사정보_20221007.xlsx"

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

    try {
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

const result = convert(fileName)

// save json
fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(result, null, 2)
)
