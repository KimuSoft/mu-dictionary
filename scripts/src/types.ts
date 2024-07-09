import { PartOfSpeech, Word } from "mudict-api-types";

export interface MuDictDump {
  items: MudictDumpItem[];
  default: Partial<Word> & Required<Pick<Word, "referenceId">>;
}

export type MudictDumpItem = Partial<Word> & Required<Pick<Word, "sourceId">>;

export const convertStringToPartOfSpeech = (
  input: string,
): PartOfSpeech | undefined => {
  const mapping: Record<string, PartOfSpeech> = {
    명사: PartOfSpeech.Noun,
    대명사: PartOfSpeech.Pronoun,
    수사: PartOfSpeech.Numeral,
    조사: PartOfSpeech.Postposition,
    동사: PartOfSpeech.Verb,
    형용사: PartOfSpeech.Adjective,
    관형사: PartOfSpeech.Determiner,
    부사: PartOfSpeech.Adverb,
    감탄사: PartOfSpeech.Interjection,
    접사: PartOfSpeech.Affix,
    "의존 명사": PartOfSpeech.DependentNoun,
    "보조 동사": PartOfSpeech.AuxiliaryVerb,
    "보조 형용사": PartOfSpeech.AuxiliaryAdjective,
    어미: PartOfSpeech.Ending,
    "관형사·명사": PartOfSpeech.DeterminerNoun,
    "수사·관형사": PartOfSpeech.NumeralDeterminer,
    "명사·부사": PartOfSpeech.NounAdverb,
    "감탄사·명사": PartOfSpeech.InterjectionNoun,
    "대명사·부사": PartOfSpeech.PronounAdverb,
    "대명사·감탄사": PartOfSpeech.PronounInterjection,
    "동사·형용사": PartOfSpeech.VerbAdjective,
    "관형사·감탄사": PartOfSpeech.DeterminerInterjection,
    "부사·감탄사": PartOfSpeech.AdverbInterjection,
    "의존명사·조사": PartOfSpeech.DependentNounPostposition,
    "수사·관형사·명사": PartOfSpeech.NumeralDeterminerNoun,
    "대명사·관형사": PartOfSpeech.PronounDeterminer,
    "품사 없음": PartOfSpeech.None,
  };

  return mapping[input];
};
