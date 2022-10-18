/*
  국토교통부 KRiC 표준데이터 역사정보
  https://data.kric.go.kr/rips/M_01_01/detail.do?id=32

  ※ xlsx 파일을 다운받아주세요
 */

import { IWord, WordClass } from "../../types"
import xlsx from "node-xlsx"
import path from "path"
import fs from "fs"
import checkWordCondition from "../../utils/checkWordCondition"
import getSimpleName from "../../utils/getSimpleName"

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

    try {
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

      // 노선명 데이터

      // 부역명 검사를 해야 함!
      const subNameReg = /\((.+)\)/
      if (subNameReg.test(row[1])) {
        const subName = convertName(row[1].match(subNameReg)![1])
        words.push({
          name: subName,
          simpleName: getSimpleName(subName),
          wordClass: WordClass.Noun,
          definition: convertSubNameDefinition(station),
          tags: ["traffic"],
          origin: convertOrigin(
            station.chineseName.replace(/\((.+)\)/, "$1").trim()
          ),
          reference: "kric",
        })
      }

      if (!checkWordCondition(station.name)) continue
      words.push({
        name: station.name,
        simpleName: getSimpleName(station.name),
        wordClass: WordClass.Noun,
        definition: convertDefinition(station),
        tags: ["traffic"],
        origin: convertOrigin(station.chineseName),
        reference: "kric",
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
    .replace(/\(.*\)/g, "")
    .replace(/\s/g, "")
    .replace(/\.·/, "ㆍ")
  if (!name.endsWith("역")) name += "역"

  return name
}

const convertOrigin = (chineseName: string) => {
  if (/^[ㄱ-ㅎㅏ-ㅣ가-힣\s]+$/.test(chineseName)) return

  let origin = chineseName.replace(/[（(](.+)[)）]/g, "").replace(/\s/g, "")
  if (!origin.endsWith("驛")) origin += "驛"

  return origin
}

const convertDefinition = (station: Station) => {
  return `${station.address}에 위치한 ${station.lineName}의 ${station.transferStation}. 역번은 ${station.code}이며, ${station.operatingAgency}에서 운영한다.`
}

const convertSubNameDefinition = (station: Station) => {
  return `${station.lineName} ${station.name}의 부역명.`
}

const getLineDefinition = (station: Station) => {
  return `대한민국의 철도 노선. 노선 번호는 ${station.lineName}이다.`
}

fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(convert(fileName), null, 2)
)
