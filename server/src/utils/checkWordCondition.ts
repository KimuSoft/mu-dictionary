export default (wordName: string) => {
  return /^[가-힣ㄱ-ㅎㅏ-ㅣ0-9\-^\sㆍ]+$/.test(wordName)
}
