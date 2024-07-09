export interface StarrailMetadata {
  // (유물) 세트명
  starrailRelicsSetName: string

  // (캐릭터) 소속
  starrailCharacterOccupation: string

  // (캐릭터) 운명의 길
  starrailCharacterPath: StarrailPath

  // (캐릭터) 전투 속성
  starrailCharacterCombatType: StarrailCombatType
}

export enum StarrailPath {
  Deconstruction = "파멸",
  TheHunt = "수렵",
  Erudition = "지식",
  Harmony = "조화",
  Hihility = "허구",
  Preservation = "보존",
  Abundance = "풍요",
  General = "일반",
}

export enum StarrailCombatType {
  Physical = "물리",
  Fire = "화염",
  Ice = "얼음",
  Lightning = "번개",
  Wind = "바람",
  Quantum = "양자",
  Imaginary = "허수",
}
