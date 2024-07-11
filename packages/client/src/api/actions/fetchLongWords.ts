"use server"

import { api } from "@/api/api"

export interface LongWordItem {
  simplifiedName: string
  length: number
  ids: string[]
  tags: string[]
}

export const fetchLongWords = async (
  letter: string,
  limit: number = 10,
  offset: number = 0,
): Promise<LongWordItem[]> => {
  const res = await api.get<LongWordItem[]>("/words/search/long-word", {
    params: {
      letter,
      limit,
      offset,
    },
  })

  return res.data
}
