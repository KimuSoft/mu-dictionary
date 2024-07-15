import { wordConvert } from "./wordConvert";
import { writeFile } from "fs/promises";

export const analyzeAndSaveUnknownWords = async (
  id: string,
  words: string[],
) => {
  if (!words.length) return;

  const unknownWords = analyzeUnknownWords(words);

  await writeFile(
    `./logs/unknown-words-${id}.json`,
    JSON.stringify(unknownWords, null, 2),
  );
};

export default function analyzeUnknownWords(words: string[]) {
  // 띄어쓰기 기준으로 split 해서 단어 단위로 쪼갠 후 Record<string, number(빈도)> 로
  // 정리한 후, number가 높은 순으로 정렬해서 반환

  const wordMap: Record<string, number> = {};

  // 우선 words를 \s로 split해서 단어 단위로 쪼갠 후, string[]로 flatten
  const wordList = words
    .map((word) => word.split(/\s+/))
    .flat()
    .map((w) => w.toLowerCase().trim());

  // 빈도 수 계산
  wordList.forEach((word) => {
    if (wordMap[word]) {
      wordMap[word]++;
    } else {
      wordMap[word] = 1;
    }
  });

  for (const word in wordMap) {
    if (wordConvert(word)) {
      delete wordMap[word];
    }
  }

  return Object.entries(wordMap)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
}
