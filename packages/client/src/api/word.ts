import { api } from "./api"
import { Word } from "mudict-api-types"

export interface SearchWordsResponse {
  estimatedTotalHits: number
  hits: Word[]
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
