export interface PersonMetadata {
  // 성
  lastName: string

  // 이름
  firstName: string

  // 별칭
  nickname: string

  // 생일
  birthDate: Date

  // 생년
  birthYear: number

  // 생일 (월)
  birthMonth: number

  // 생일 (일)
  birthDay: number

  // 국적
  country: string

  // 키
  height: number | string

  // 성별
  sex: string

  // 혈액형
  bloodType: string

  // 나이
  age: number | string
}
