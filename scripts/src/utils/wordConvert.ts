// 단순한, 기호 및 영어 등을 한국어로 변환함
export const convertToKorean = (word: string) => {
  // 기호 replacing
  word = word.replace(/%/g, "퍼센트");
  word = word.replace(/#/g, "샵");

  // 영어 replacing

  // 한자 replacing
  return word.trim();
};

// 단어를 넣으면 mudict 단어 형식으로 변환함. mudict 단어 형식에 적합하지 않은 경우 null을 반환함.
export const wordConvert = (
  word: string
): {
  // 단어의 원형
  origin: string;
  // 한국어, 숫자, 띄어쓰기 및 사전기호(^, -)만을 허용함
  name: string;
  // 한국어, 숫자만을 허용함
  simplifiedName: string;
} | null => {
  // 모든 기호 제거
  const name = convertToKorean(word).replace(/[^a-zA-Z0-9가-힣\s^-]/g, "");

  // 한국어, 숫자, 띄어쓰기 및 사전기호(^, -)만을 허용함
  if (!/^[가-힣0-9\s^-]+$/.test(word)) {
    return null;
  }

  // 한국어, 숫자만을 허용함
  const simplifiedName = word.replace(/[^가-힣0-9]/g, "");

  return {
    origin: word,
    name,
    simplifiedName,
  };
};
