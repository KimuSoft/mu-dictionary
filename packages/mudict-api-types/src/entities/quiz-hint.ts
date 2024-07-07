export type QuizHint = TextHint | MediaHint | CountHint | PartialHint

export enum HintType {
  Definition,
  Image,
  Consonants,
  LetterCount,
  YoutubeSound,
  Youtube,
  PartialHint,
}

export interface BaseHint {
  hintType: HintType
  cost: number
}

export interface TextHint extends BaseHint {
  hintType: HintType.Definition | HintType.Consonants
  content: string
}

export interface MediaHint extends BaseHint {
  hintType: HintType.Image | HintType.Youtube | HintType.YoutubeSound
  url: string
}

export interface CountHint extends BaseHint {
  hintType: HintType.LetterCount
  count: number
}

export interface PartialHint extends BaseHint {
  hintType: HintType.PartialHint
  startIdx: number
  endIdx: number
  hints: QuizHint[]
}
