import { api } from "@/api/api"

export interface TagStatItem {
  tag: string
  count: number
}

export const fetchTags = async (): Promise<TagStatItem[]> => {
  const res = await api.get<TagStatItem[]>("/statistics/tags")
  res.data.sort((a: TagStatItem, b: TagStatItem) => b.count - a.count)

  return res.data
}
