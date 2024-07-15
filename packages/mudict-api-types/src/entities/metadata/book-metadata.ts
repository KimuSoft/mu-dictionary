export interface BookMetadata {
  // 작가
  authors: string[]
  // 번역가(옮긴이)
  translators: string[]
  // 일러스트레이터
  illustrators: string[]
  isbn: string
  price: number | string
  ddc: string
  page: number | string
  size: string
  slogan: string
  synopsis: string
}
