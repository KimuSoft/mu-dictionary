import { api } from "@/api/api"

export const fetchInitials = async () => {
  const res = await api.get<{ initial: string; count: number }[]>(
    "/statistics/initials",
  )

  return res.data
}
