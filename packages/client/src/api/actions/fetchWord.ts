import { api } from "@/api/api"
import { Word } from "mudict-api-types"

export const fetchWord = async (id: string) => {
  return api.get<Word | null>(`/words/${id}`)
}
