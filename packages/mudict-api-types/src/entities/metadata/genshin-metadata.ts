export interface GenshinMetadata {
  // (캐릭터) 소속
  genshinCharacterOccupation: string

  // (캐릭터) 신의 눈
  genshinCharacterElement: GenshinElement

  // (캐릭터) 운명의 자리
  genshinCharacterConstellation: string

  // (캐릭터) 소속 지역
  genshinCharacterRegion: string

  // (캐릭터 또는 무기) 무기 종류
  genshinWeaponType: GenshinWeaponType

  // (가구) 하중
  genshinFurnitureLoad: number

  // (가구) 선계 선력
  genshinFurnitureAdeptalEnergy: number

  // (가구) 설치 가능 위치
  genshinFurniturePlaceableLocation: "Exterior" | "Interior"
}

export enum GenshinWeaponType {
  Sword = "한손검",
  Claymore = "양손검",
  Polearm = "창",
  Bow = "활",
  Catalyst = "법구",
}

export enum GenshinElement {
  Anemo = "바람",
  Cryo = "얼음",
  Dendro = "풀",
  Electro = "번개",
  Geo = "바위",
  Hydro = "물",
  Pyro = "불",
}
