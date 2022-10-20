/*
  위키백과 데이터베이스 덤프
 */

import { IWord, WordClass } from "../../types"
import getSimpleName from "../../utils/getSimpleName"
import { tagData, WikiDoc } from "./filter"
import fs from "fs"
import checkWordCondition from "../../utils/checkWordCondition"
import _ from "lodash"
import path from "path"

const words = require("./result.json") as WikiDoc[]

const convert = async () => {
  console.log("start to convert")
  const convertedWords: IWord[] = []

  let index = 0
  for (const doc of words) {
    if (!(index % 100000)) console.log(index)
    index++

    const tags = getTags(doc.tags)
    if (!tags.length) continue

    if (doc.name.startsWith("분류:")) continue

    const name = convertName(doc.name)
    if (!checkWordCondition(name)) {
      if (doc.name === "블루 아카이브") console.log(index, name, "passed")
      continue
    }
    if (doc.name === "블루 아카이브")
      console.log("와아 블아", name, getSimpleName(name), tags)

    const _word = {
      name,
      simpleName: getSimpleName(name),
      wordClass: WordClass.Noun,
      definition: convertDefinition(doc.definition),
      tags,
      reference: "wikipedia",
    } as IWord

    // console.log(name, tags)
    convertedWords.push(_word)
  }

  console.info(`Loaded ${convertedWords.length.toLocaleString()} words`)
  console.log(convertedWords.find((x) => x.name === "블루^아카이브"))
  return convertedWords
}

const getTags = (tags: string[]): string[] => {
  const tags_: string[] = []
  for (const td of tagData) {
    for (const tag of tags) {
      if (td.regex.test(tag)) {
        tags_.push(td.code)
      }
    }
  }
  return _.uniq(tags_)
}

const convertDefinition = (definition: string) => {
  return definition.replace(/<.*>[^<>]*<\/.*>/g, "")
}

const convertName = (name: string) => {
  return (
    name
      .replace(/\(.*\)/g, "")
      .replace(/[:\-~,]/g, "^")
      .replace(/[?!.]/g, "")

      // 영단어 치환
      .replace(/KBS/gi, "케이비에스")
      .replace(/MBC/gi, "엠비시")
      .replace(/EBS/gi, "이비에스")
      .replace(/SBS/gi, "에스비에스")
      .replace(/TV/gi, "티비")
      .replace(/DJ/gi, "디제이")
      .replace(/VS/gi, "브이에스")
      .replace(/Go/gi, "고")
      .replace(/Max/gi, "맥스")
      .replace(/RPG/gi, "알피지")
      .replace(/Project/gi, "프로젝트")
      .replace(/Wii/gi, "위")
      .replace(/DS/gi, "디에스")

      // 띄어쓰기 조정
      .trim()
      .replace(/\s/g, "^")
      .replace(/\^\^/g, "^")
  )
}

convert().then((result) => {
  console.log("Saving...")
  fs.writeFileSync(
    path.join(__dirname, "wikiResult.json"),
    JSON.stringify(result, null, 2)
  )
  console.info("Done")
})
