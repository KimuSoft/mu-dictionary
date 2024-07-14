import { PlaceMetadata } from "./place-metadata"
import { FoodMetadata } from "./food-metadata"
import { ContentMetadata } from "./content-metadata"
import { GameMetadata } from "./game-metadata"
import { MovieMetadata } from "./movie-metadata"
import { MultilingualMetadata } from "./multilingual-metadata"
import { StationMetadata } from "./station-metadata"
import { MusicMetadata } from "./music-metadata"
import { LobotomyMetadata } from "./lobotomy-metadata"
import { GameContentMetadata } from "./game-content-metadata"
import { GenshinMetadata } from "./genshin-metadata"
import { PersonMetadata } from "./person-metadata"
import { CharacterMetadata } from "./character-metadata"
import { StarrailMetadata } from "./starrail-metadata"
import { BusStopMetadata } from "./bus-stop-metadata"
import { BookMetadata } from "./book-metadata"

export * from "./place-metadata"
export * from "./food-metadata"
export * from "./content-metadata"
export * from "./game-metadata"
export * from "./movie-metadata"
export * from "./multilingual-metadata"
export * from "./station-metadata"
export * from "./music-metadata"
export * from "./lobotomy-metadata"
export * from "./game-content-metadata"
export * from "./genshin-metadata"
export * from "./person-metadata"
export * from "./character-metadata"
export * from "./starrail-metadata"
export * from "./bus-stop-metadata"
export * from "./book-metadata"

export type Metadata = Partial<BusStopMetadata> &
  Partial<CharacterMetadata> &
  Partial<ContentMetadata> &
  Partial<FoodMetadata> &
  Partial<GameContentMetadata> &
  Partial<GameMetadata> &
  Partial<GenshinMetadata> &
  Partial<LobotomyMetadata> &
  Partial<MovieMetadata> &
  Partial<MultilingualMetadata> &
  Partial<MusicMetadata> &
  Partial<PersonMetadata> &
  Partial<PlaceMetadata> &
  Partial<StarrailMetadata> &
  Partial<StationMetadata> &
  Partial<BookMetadata>
