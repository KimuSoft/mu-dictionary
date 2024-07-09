// 게임에서 공통적으로 사용되는 메타데이터
export interface GameContentMetadata {
  // 등급 및 희귀도
  rarity: string

  // (캐릭터) 타이틀
  characterTitle: string

  // (아이템) 사용 시, 착용 시 등 효과
  effect: string

  // (아이템) 획득 경로
  acquisition: string

  // (아이템) 아이템 분류
  itemCategory: string

  // (업적) 상위 업적 그룹
  achievementGroup: string

  // (업적) 보상
  achievementReward: string

  // (업적) 히든 업적 여부
  isHiddenAchievement: boolean
}
