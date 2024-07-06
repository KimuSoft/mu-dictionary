import { wordConvert } from "./wordConvert";

export default function analyzeUnknownWords(words: string[]) {
  // 띄어쓰기 기준으로 split 해서 단어 단위로 쪼갠 후 Record<string, number(빈도)> 로
  // 정리한 후, number가 높은 순으로 정렬해서 반환

  const wordMap: Record<string, number> = {};

  // 우선 words를 \s로 split해서 단어 단위로 쪼갠 후, string[]로 flatten
  const wordList = words
    .map((word) => word.split(/\s+/))
    .flat()
    .filter((w) => !wordConvert(w.trim()))
    .map((w) => w.toLowerCase());

  // 단어 빈도수 계산
  wordList.forEach((word) => {
    if (wordMap[word]) {
      wordMap[word]++;
    } else {
      wordMap[word] = 1;
    }
  });

  return Object.entries(wordMap)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
}
