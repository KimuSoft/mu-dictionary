// 식품 메타데이터
export interface FoodMetadata {
  // 식품코드
  foodCode: string

  // 제조 및 유통사
  manufacturer: string

  // 식품대분류
  foodCategory: string

  // 식품상세분류
  foodDetailCategory: string

  // 1회 제공량
  servingSize: string

  // 1회 제공량 단위
  servingSizeUnit: string

  // 에너지 (kcal)
  energy: number
}
