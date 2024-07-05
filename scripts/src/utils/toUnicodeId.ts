export default function toUnicodeId(name: string) {
  // charCodeAt을 이용하여 유니코드로 변환, 글자와 글자 사이는 '-'로 구분
  return name
    .split("")
    .map((char) => char.charCodeAt(0).toString(16))
    .join("-");
}
