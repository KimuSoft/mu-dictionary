import React from "react"
import { WordClass } from "../../types/types"
import { Tag, TagLabel } from "@chakra-ui/react"

const Pos: React.FC<{ pos: WordClass }> = ({ pos }) => {
  return (
    <Tag>
      <TagLabel>{getWordClassString(pos)}</TagLabel>
    </Tag>
  )
}

const getWordClassString = (wordClass: WordClass): string => {
  switch (wordClass) {
    case WordClass.Noun:
      return "명"
    case WordClass.Pronoun:
      return "대"
    case WordClass.Numeral:
      return "수"
    case WordClass.Postposition:
      return "조"
    case WordClass.Verb:
      return "동"
    case WordClass.Adjective:
      return "형"
    case WordClass.Determiner:
      return "관"
    case WordClass.Adverb:
      return "부"
    case WordClass.Interjection:
      return "감"
    case WordClass.Affix:
      return "접"
    case WordClass.DependentNoun:
      return "의명"
    case WordClass.AuxiliaryVerb:
      return "보동"
    case WordClass.AuxiliaryAdjective:
      return "보형"
    case WordClass.Ending:
      return "어"
    case WordClass.DeterminerNoun:
      return "관·명"
    case WordClass.NumeralDeterminer:
      return "수·관"
    case WordClass.NounAdverb:
      return "명·부"
    case WordClass.InterjectionNoun:
      return "감·명"
    case WordClass.PronounAdverb:
      return "대·부"
    case WordClass.PronounInterjection:
      return "대·감"
    case WordClass.VerbAdjective:
      return "동·형"
    case WordClass.DeterminerInterjection:
      return "관·감"
    case WordClass.AdverbInterjection:
      return "부·감"
    case WordClass.DependentNounPostposition:
      return "의·명·조"
    case WordClass.NumeralDeterminerNoun:
      return "수·관·명"
    case WordClass.PronounDeterminer:
      return "대·관"
    case WordClass.Phrase:
      return "구"
    case WordClass.Idiom:
      return "관용구"
    case WordClass.Proverb:
      return "속담"
    default:
      return "품사 없음"
  }
}

export default Pos
