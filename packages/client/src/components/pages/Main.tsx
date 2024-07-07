import React, { useEffect } from "react"
import MainTemplate from "../templates/MainTemplate"
import { api } from "../../api/api"

export interface TagStatItem {
  tag: string
  count: number
}

const Main: React.FC = () => {
  const [tagStats, setTagStats] = React.useState<TagStatItem[]>([])

  const fetchTags = async () => {
    const res = await api.get("/statistics/tags")
    res.data.sort((a: TagStatItem, b: TagStatItem) => b.count - a.count)
    setTagStats(res.data)
  }

  useEffect(() => {
    fetchTags().then()
  }, [])

  return <MainTemplate tagStats={tagStats} />
}

export default Main
