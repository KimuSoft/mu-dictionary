import React from "react"
import MainTemplate from "@/components/templates/MainTemplate"
import { fetchTags } from "@/api/actions/fetchTags"

const MainPage: React.FC = async () => {
  const tagStats = await fetchTags()

  return <MainTemplate tags={tagStats} />
}

export default MainPage
