"use server"

import { api } from "@/api/api"
import { isAxiosError } from "axios"
import { Quiz } from "mudict-api-types"

export const fetchQuiz = async (tags: string[], excludes: string[]) => {
  try {
    const res = await api.get<Quiz>("/quiz", {
      params: { tags, exclude: excludes },
    })

    return res.data
  } catch (e) {
    if (!isAxiosError(e) || e.response?.status !== 404) throw e

    return null
  }
}
