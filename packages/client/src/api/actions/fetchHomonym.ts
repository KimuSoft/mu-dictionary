import { api } from "@/api/api"
import { Word } from "mudict-api-types"

export const fetchHomonym = async (word: Word) => {
  const res = await api.get<Word[]>("/words", {
    params: {
      simplifiedName: word.simplifiedName,
      limit: 100,
      exact: true,
    },
  })

  return res.data.filter((w) => w.sourceId !== word.sourceId)
}
