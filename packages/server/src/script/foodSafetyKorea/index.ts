/*
  식품영양성분 데이터베이스
  https://various.foodsafetykorea.go.kr/nutrient/

  ※ 가공식품, 음식 데이터베이스 xlsx 파일을 각각 따로 다운받아서 하위 data 폴더에 넣어야 합니다.
  ※ 수산물은 데이터베이스 형식이 달라 포함하지 않습니다. 농축산물은 사전에 넣기에 적절치 않고 이미 우리말샘에 있으므로 포함하지 않습니다.
 */

import xlsx from "node-xlsx"
import { IWord, WordClass } from "../../types"
import * as fs from "fs"
import * as path from "path"
import checkWordCondition from "../../utils/checkWordCondition"
import getSimpleName from "../../utils/getSimpleName"

const sources = [
  // "data/통합 식품영양성분DB_농축산물_20221018.xlsx",
  // "data/통합 식품영양성분DB_수산물_20221018.xlsx",
  "data/통합 식품영양성분DB_가공식품_20221018.xlsx",
  "data/통합 식품영양성분DB_음식_20221018.xlsx",
]

interface Food {
  foodType: string
  name: string
  isRepresentative: boolean
  corp: string
  foodGroup: string
  servingSize: string // (float)
  servingSizeUnit: string
  kcal: string // (number)
}
const convert = (fileName: string): IWord[] => {
  let indexCorrection = 0

  console.info(`Start to parse: ${fileName}`)

  const workSheetsFromFile = xlsx.parse(path.join(__dirname, fileName))

  console.info(`Start to convert: ${fileName}`)
  const workSheet = workSheetsFromFile[0]

  // ~맛 제거
  // name = name.replace(/(.*)[\s-].+맛/, "$1")

  const words: IWord[] = []
  for (const row of workSheet.data as string[][]) {
    if (row[8] === "채취시기") indexCorrection = 1
    if (isNaN(parseInt(row[0]))) continue

    try {
      const foodData: Food = {
        foodType: row[3],
        isRepresentative: row[4] === "품목대표",
        name: row[5],
        corp: convertCorp(row[7]),
        foodGroup: row[9 + indexCorrection],
        servingSize: row[10 + indexCorrection],
        servingSizeUnit: row[11 + indexCorrection],
        kcal: row[14 + indexCorrection],
      }

      if (/.+[\s-].+맛$/.test(foodData.name)) {
        const seriesName = foodData.name.replace(/(.*)[\s-].+맛/, "$1")
        if (words.find((food) => food.name === seriesName)) continue

        if (!checkWordCondition(convertName(seriesName))) {
          console.warn(`Skip word: ${convertName(seriesName)}`)
          continue
        }

        words.push({
          name: convertName(seriesName),
          simpleName: getSimpleName(convertName(seriesName)),
          wordClass: WordClass.Noun,
          definition: convertSeriesDefinition(foodData),
          tags: ["food"],
          reference: "foodSafetyKorea",
        })
      }

      const word: IWord = {
        name: convertName(foodData.name),
        simpleName: getSimpleName(convertName(foodData.name)),
        wordClass: WordClass.Noun,
        definition: convertDefinition(foodData),
        tags: ["food"],
        reference: "foodSafetyKorea",
      }

      if (!checkWordCondition(word.name)) {
        console.warn(`Skip word: ${word.name}`)
        continue
      }

      // for (const f in field) {
      //   if (field[f]) continue
      //   delete word[f as keyof Word]
      // }

      words.push(word)
    } catch (error) {
      console.error(error)
      console.warn(`Failed to parse: ${row}`)
    }
  }

  console.info(`Finish to convert: ${fileName}`)
  return words
}

const convertName = (name: string): string => {
  // 반점으로 나뉜 경우
  if (name.includes(",")) name = name.split(",")[0].trim()

  // 기호 삭제
  name = name.replace(/[!?.~®]/g, "")
  name = name.replace(/[_\-+]/g, " ")

  // 붙여쓰기를 대충 허용하니까
  name = name.replace(/\s/g, "^")
  name = name.replace(/\^+/g, "^")

  // 괄호 먼저 제거
  name = name.replace(/\([^)]*\)|\[[^\]]*]|<[^>]*>/g, "")

  // ~맛 제거
  // name = name.replace(/(.*)[\s-].+맛/, "$1")

  // 확실한 영어 표현 제거
  // 장문
  name = name.replace(/PROBIOTIC/gi, "프로바이오틱")
  name = name.replace(/STARBUCKS/gi, "스타벅스")
  name = name.replace(/SIGNATURE/gi, "시그니처")
  name = name.replace(/HOMEPLUS/gi, "홈플러스")

  name = name.replace(/SET/gi, "세트")
  name = name.replace(/NEW/gi, "뉴")
  name = name.replace(/HOT/gi, "핫")
  name = name.replace(/COOK/gi, "쿡")
  name = name.replace(/eat/gi, "잇")
  name = name.replace(/eats/gi, "잇츠")
  name = name.replace(/DIY/gi, "디아이와이")
  name = name.replace(/OK/gi, "오케이")
  name = name.replace(/THE/gi, "더")
  name = name.replace(/BLT/gi, "비엘티")
  name = name.replace(/REAL/gi, "리얼")
  name = name.replace(/BASE/gi, "베이스")
  name = name.replace(/ABC/gi, "에이비시")
  name = name.replace(/LOTTE/gi, "롯데")
  name = name.replace(/MAX/gi, "맥스")
  name = name.replace(/HOPE/gi, "호프")
  name = name.replace(/PLUS/gi, "플러스")
  name = name.replace(/MINI/gi, "미니")
  name = name.replace(/비타C/gi, "비타시")
  name = name.replace(/KFC/gi, "케이에프씨")
  name = name.replace(/비타민C/gi, "비타민시")
  name = name.replace(/MILK/gi, "밀크")
  name = name.replace(/BBQ/gi, "비비큐")
  name = name.replace(/SINCE/gi, "신스")
  name = name.replace(/ICED?/gi, "아이스")
  name = name.replace(/IT'?S/gi, "이츠")

  // 두 글자 이하
  name = name.replace(/UV/gi, "유브이")
  name = name.replace(/cm/gi, "센티미터")
  name = name.replace(/mm/gi, "밀리미터")
  name = name.replace(/GT/gi, "지티")
  name = name.replace(/CJ/gi, "씨제이")
  name = name.replace(/CU/gi, "씨유")
  name = name.replace(/IN/gi, "인")
  name = name.replace(/美/gi, "미")
  name = name.replace(/[辛新]/gi, "신")
  name = name.replace(/秀/gi, "수")
  name = name.replace(/&/gi, "앤드")
  name = name.replace(/[’']s/gi, "스")
  name = name.replace(/[’']/gi, "")
  name = name.replace(/X/gi, "엑스")
  name = name.replace(/%/gi, "퍼센트")

  // ~100g과 같은 용량 표현 제거
  name = name.replace(/[0-9]+G$/gi, "")
  name = name.replace(/[0-9]+KG$/gi, "")
  name = name.replace(/(TALL|VENTI|GRANDE|SMALL|LARGE|MEDIUM)/gi, "")

  name = name.replace(/[MLRVJSGXABCD]$/gi, "")

  return name
}

const convertDefinition = (food: Food): string => {
  const company = !food.isRepresentative ? food.corp + "에서 출시한 " : ""
  return `${company}${food.foodGroup} ${food.foodType}, 1회 제공량은 ${food.servingSize}${food.servingSizeUnit}이며, 열량은 ${food.kcal}kcal이다.`
}

const convertSeriesDefinition = (food: Food): string => {
  const company = !food.isRepresentative ? food.corp + "에서 출시한 " : ""
  return `${company}${food.foodGroup} ${food.foodType}`
}

const convertCorp = (corp: string): string => {
  return corp.replace(/㈜|\(주\)/g, "주식회사 ").replace(/\s\S+공장$/, "")
}

const results = []
for (const fileName of sources) {
  results.push(...convert(fileName))
}

// save json
fs.writeFileSync(
  path.join(__dirname, "result.json"),
  JSON.stringify(results, null, 2)
)
