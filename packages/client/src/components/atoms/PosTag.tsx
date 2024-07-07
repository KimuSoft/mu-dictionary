import React from "react"
import { Tag, TagLabel, useColorModeValue } from "@chakra-ui/react"
import { PartOfSpeech } from "mudict-api-types"

const PosTag: React.FC<{ pos: PartOfSpeech }> = ({ pos }) => {
  return (
    <Tag
      bgColor={useColorModeValue("gray.200", "gray.700")}
      flexShrink={0}
      size={"sm"}
    >
      <TagLabel>{getPartOfSpeechString(pos)}</TagLabel>
    </Tag>
  )
}

const getPartOfSpeechString = (pos: PartOfSpeech): string => {
  switch (pos) {
    case PartOfSpeech.Noun:
      return "명"
    case PartOfSpeech.Pronoun:
      return "대"
    case PartOfSpeech.Numeral:
      return "수"
    case PartOfSpeech.Postposition:
      return "조"
    case PartOfSpeech.Verb:
      return "동"
    case PartOfSpeech.Adjective:
      return "형"
    case PartOfSpeech.Determiner:
      return "관"
    case PartOfSpeech.Adverb:
      return "부"
    case PartOfSpeech.Interjection:
      return "감"
    case PartOfSpeech.Affix:
      return "접"
    case PartOfSpeech.DependentNoun:
      return "의명"
    case PartOfSpeech.AuxiliaryVerb:
      return "보동"
    case PartOfSpeech.AuxiliaryAdjective:
      return "보형"
    case PartOfSpeech.Ending:
      return "어"
    case PartOfSpeech.DeterminerNoun:
      return "관·명"
    case PartOfSpeech.NumeralDeterminer:
      return "수·관"
    case PartOfSpeech.NounAdverb:
      return "명·부"
    case PartOfSpeech.InterjectionNoun:
      return "감·명"
    case PartOfSpeech.PronounAdverb:
      return "대·부"
    case PartOfSpeech.PronounInterjection:
      return "대·감"
    case PartOfSpeech.VerbAdjective:
      return "동·형"
    case PartOfSpeech.DeterminerInterjection:
      return "관·감"
    case PartOfSpeech.AdverbInterjection:
      return "부·감"
    case PartOfSpeech.DependentNounPostposition:
      return "의·명·조"
    case PartOfSpeech.NumeralDeterminerNoun:
      return "수·관·명"
    case PartOfSpeech.PronounDeterminer:
      return "대·관"
    case PartOfSpeech.Phrase:
      return "구"
    case PartOfSpeech.Idiom:
      return "관용구"
    case PartOfSpeech.Proverb:
      return "속담"
    default:
      return "품사 없음"
  }
}

export default PosTag
