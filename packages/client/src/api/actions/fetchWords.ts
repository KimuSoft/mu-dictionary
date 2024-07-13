import { FindWordsRequestQuery, FindWordsResponse } from "mudict-api-types"
import { api } from "@/api/api"

export const fetchWords = async (req: FindWordsRequestQuery) => {
  const res = await api.get<FindWordsResponse>("/words", {
    params: req,
  })

  return res.data
}
