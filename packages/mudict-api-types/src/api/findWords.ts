import { PartOfSpeech, Word } from "../entities"

export interface FindWordsRequestQuery {
  name?: string
  simplifiedName?: string
  tags?: string | string[]
  pos?: PartOfSpeech | PartOfSpeech[]

  limit?: number
  offset?: number

  mode?: FindMode

  sort?: SortableWordField
  order?: "ASC" | "DESC"
}

// export enum WordFields {
//   Id = 'id',
//   Name = 'name',
//   SimplifiedName = 'simplifiedName',
//   Origin = 'origin',
//   Pronunciation = 'pronunciation',
//   Definition = 'definition',
//   Pos = 'pos',
//   Tags = 'tags',
//   Thumbnail = 'thumbnail',
//   Url = 'url',
//   ReferenceId = 'referenceId',
// }

export enum SortableWordField {
  Id = "id",
  SourceId = "sourceId",
  Name = "name",
  Length = "length",
}

export enum FindMode {
  // 정확한 검색
  Exact = "exact",

  // 포함 검색
  Include = "include",

  // Like식 검색
  Like = "like",

  // 정규식 검색
  Regex = "regex",
}

export type FindWordsResponse = Word[]
