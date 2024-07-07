export class QuizDto {
  id: string;
  quizType: QuizType;
  hints: Hint[];
  tags: string[];
  answer: string;
}

export interface BaseHint {
  hintType: HintType;
}

export interface TextHint extends BaseHint {
  hintType: HintType.Definition | HintType.Consonants;
  content: string;
}

export interface MediaHint extends BaseHint {
  hintType: HintType.Image | HintType.Youtube | HintType.YoutubeSound;
  url: string;
}

export interface CountHint extends BaseHint {
  hintType: HintType.LetterCount;
  count: number;
}

export type Hint = TextHint | MediaHint | CountHint | PartialHint;

export interface PartialHint extends BaseHint {
  startIdx: number;
  endIdx: number;
  hints: Hint[];
}

export enum QuizType {
  Word,
}

export enum HintType {
  Definition,
  Image,
  Consonants,
  LetterCount,
  YoutubeSound,
  Youtube,
  PartialHint,
}
