"use server"

import { api } from "@/api/api"

export const fetchAutocomplete = async (
  query: string,
  limit: number,
): Promise<string[]> => {
  const res = await api.get<string[]>("words/autocomplete", {
    params: { q: query, limit },
  })

  return res.data
}
