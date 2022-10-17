/*
  식품영양성분 데이터베이스
  https://various.foodsafetykorea.go.kr/nutrient/
 */

import xlsx from "node-xlsx"
import { IWord, WordClass } from "../../types"
import * as fs from "fs"
import * as path from "path"
import checkWordCondition from "../../utils/checkWordCondition"

const fileName = "food_20221018.xlsx"

interface Food {
  name: string
  isRepresentative: boolean
  corp: string
  foodGroup: string
  servingSize: number
  servingSizeUnit: string
  kcal: string // (number)
}

const convert = (): IWord[] => {
  console.info(`Start to parse: ${fileName}`)

  const workSheetsFromFile = xlsx.parse(path.join(__dirname, fileName))

  console.info(`Start to convert: ${fileName}`)
  const workSheet = workSheetsFromFile[0]

  const words: IWord[] = []
  let index = 0
  for (const row of workSheet.data as string[][]) {
    index++
    if (index <= 4) continue

    try {
      const foodData: Food = {
        isRepresentative: row[4] === "품목대표",
        name: row[5],
        corp: row[7],
        foodGroup: row[10],
        servingSize: parseInt(row[11]),
        servingSizeUnit: row[12],
        kcal: row[15],
      }

      const word: IWord = {
        name: convertName(foodData.name),
        wordClass: WordClass.Noun,
        definition: convertDefinition(foodData),
        tags: ["food"],
        reference: "foodSafetyKorea",
      }

      if (!checkWordCondition(word.name)) continue

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

  // 괄호 먼저 제거
  name = name.replace(/'\([^)]*\)|\[[^\]]*]|<[^>]*>'/g, "")

  // ~맛 제거
  name = name.replace(/(.*)[\s-].+맛/, "$1")

  // 확실한 영어 표현 제거
  // 장문
  name = name.replace(/PROBIOTIC/gi, "프로바이오틱")
  name = name.replace(/STARBUCKS/gi, "스타벅스")
  name = name.replace(/SIGNATURE/gi, "시그니처")
  name = name.replace(/HOMEPLUS/gi, "홈플러스")

  name = name.replace(/SET/gi, "세트")
  name = name.replace(/NEW/gi, "뉴")
  name = name.replace(/HOT/gi, "핫")
  name = name.replace(/THE/gi, "더")
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
  name = name.replace(/SINCE/gi, "신스")
  name = name.replace(/ICED?/gi, "아이스")
  name = name.replace(/IT'?S/gi, "이츠")

  // 두 글자 이하
  name = name.replace(/UV/gi, "유브이")
  name = name.replace(/GT/gi, "지티")
  name = name.replace(/CJ/gi, "씨제이")
  name = name.replace(/CU/gi, "씨유")
  name = name.replace(/美/gi, "미")
  name = name.replace(/辛/gi, "신")
  name = name.replace(/&/gi, "앤드")

  // ~100g과 같은 용량 표현 제거
  name = name.replace(/[0-9]+G$/gi, "")
  name = name.replace(/[0-9]+KG$/gi, "")
  name = name.replace(/(TALL|VENTI|GRANDE|SMALL|LARGE|MEDIUM)/gi, "")

  // 붙여쓰기를 대충 허용하니까
  name = name.replace(/\s/g, "^")

  name = name.replace(/[MLRVJSGXABCD]$/gi, "")

  return name
}

const convertDefinition = (food: Food): string => {
  const company = !food.isRepresentative ? food.corp + "에서 출시한 " : ""
  return `${company}${food.foodGroup} 음식, 1회 제공량은 ${food.servingSize}${food.servingSizeUnit}이며, 열량은 ${food.kcal}kcal이다.`
}

const result = convert()
// save json
fs.writeFileSync(
  path.join(__dirname, "foodSafetyKorea.json"),
  JSON.stringify(result, null, 2)
)
