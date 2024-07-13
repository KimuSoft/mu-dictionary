import { api } from "@/api/api"
import {
  FindMode,
  FindWordsRequestQuery,
  FindWordsResponse,
  Word,
} from "mudict-api-types"

export const fetchHomonym = async (word: Word) => {
  const req: FindWordsRequestQuery = {
    simplifiedName: word.simplifiedName,
    limit: 100,
    mode: FindMode.Exact,
  }

  const res = await api.get<FindWordsResponse>("/words", {
    params: req,
  })

  return res.data.filter((w) => w.sourceId !== word.sourceId)
}
