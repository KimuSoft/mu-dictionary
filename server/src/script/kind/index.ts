/*
  대한민국 대표 기업공시채널
  https://kind.krx.co.kr/corpgeneral/corpList.do?method=loadInitPage

  ※ xls 파일로 표시되지만 htm 파일이 다운받아집니다. 엑셀 등의 프로그램으로 xlsx 또는 xls 확장자로 변환해주세요.
 */

import { IWord, WordClass } from "../../types"
import xlsx from "node-xlsx"
import path from "path"
import fs from "fs"
import checkWordCondition from "../../utils/checkWordCondition"
import getSimpleName from "../../utils/getSimpleName"
import alphabetToHangul from "../../utils/alphabetToHangul"

const fileName = "상장법인목록.xlsx"

// 회사명, 종목코드, 업종, 상장일, 대표자명, 지역
interface Corp {
  name: string
  code: string
  industry: string
  listingDate: Date
  ceo: string
  region: string
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
    if (index <= 1) continue

    try {
      const corp: Corp = {
        name: convertName(row[0]),
        code: row[1],
        industry: row[2],
        listingDate: new Date(
          Math.round((parseInt(row[4]) - 25569) * 86400 * 1000)
        ),
        ceo: row[6],
        region: row[8],
      }

      if (!checkWordCondition(corp.name)) {
        console.warn(`Invalid word: ${corp.name}`)
        continue
      }

      words.push({
        name: corp.name,
        simpleName: getSimpleName(corp.name),
        wordClass: WordClass.Noun,
        definition: convertDefinition(corp),
        tags: ["corp"],
        reference: "kind",
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
    .split(/제?\d+호|스팩\d/)[0]
    .replace(/\s/g, "^")
    .replace(/\./g, "")
    .replace(/&/gi, "^앤드^")
    .replace(/CJ/gi, "씨제이")
    .replace(/S-Oil/gi, "에쓰오일")

  name = alphabetToHangul(name)

  return name
}

const convertDefinition = (corp: Corp) => {
  return `${corp.listingDate.getFullYear()}년 ${corp.listingDate.getMonth()}월 ${corp.listingDate.getDate()}일 상장한 대한민국의 ${
    corp.industry
  } 기업. 대표자는 ${corp.ceo}이며, 본사는 ${corp.region}에 위치한다.`
}

fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(convert(fileName), null, 2)
)
