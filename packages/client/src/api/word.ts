import { api } from "./api"
import { IWord } from "../types/types"

export interface SearchWordsResponse {
  estimatedTotalHits: number
  hits: IWord[]
  limit: number
  offset: number
  processingTimeMs: number
  query: string
}

export const searchWords = async (
  query: string,
  tags: string[] = [],
  limit: number = 10,
  offset: number = 0,
): Promise<SearchWordsResponse> => {
  const res = await api.get<SearchWordsResponse>("words/search", {
    params: {
      q: query,
      tags,
      limit,
      offset,
    },
  })

  return res.data
}

export const autocompleteWords = async (
  query: string,
  limit: number = 10,
): Promise<string[]> => {
  const res = await api.get("words/autocomplete", {
    params: {
      q: query,
      limit,
    },
  })

  return res.data
}
