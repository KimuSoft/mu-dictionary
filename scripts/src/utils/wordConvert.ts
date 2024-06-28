import { ForeignReplaceData } from "./foreignFormat";
import { readFileSync } from "fs";

export const simplifyName = (word: string) => {
  // 한국어와 숫자만을 허용
  return word.replace(/[^ㅏ-ㅣㄱ-ㅎ가-힣0-9]/g, "");
};

console.log("foreign_replace.json 파일을 읽어옵니다.");
const replaceData: ForeignReplaceData[] = JSON.parse(
  readFileSync("foreign_replace.json").toString(),
);
replaceData.sort(
  (a, b) => (b.priority || b.key.length) - (a.priority || a.key.length),
);

// 단순한, 기호 및 영어 등을 한국어로 변환함
export const convertToKorean = (word: string) => {
  word = word.trim().toLowerCase();

  for (const data of replaceData) {
    word = word.replace(new RegExp(data.key, "g"), data.replace);
  }

  return word.trim();
};

// 단어를 넣으면 mudict 단어 형식으로 변환함. mudict 단어 형식에 적합하지 않은 경우 null을 반환함.
export const wordConvert = (
  word: string,
): {
  // 단어의 원형
  origin: string;
  // 한국어, 숫자, 띄어쓰기 및 사전기호(^, -)만을 허용함
  name: string;
  // 한국어, 숫자만을 허용함
  simplifiedName: string;
} | null => {
  // 모든 기호 제거
  const name = convertToKorean(word)
    .replace(/[^一-龯ぁ-んァ-ンa-zA-Z0-9ㄱ-ㅎ가-힣ㅏ-ㅣ\s]/g, "")
    .trim();

  // 영어가 제거가 안 되는 경우 null을 반환함
  if (!/^[ㅏ-ㅣㄱ-ㅎ가-힣0-9\s]+$/.test(name)) {
    return null;
  }

  // 한국어, 숫자만을 허용함
  const simplifiedName = simplifyName(name);

  return {
    origin: word.trim(),
    name,
    simplifiedName,
  };
};
