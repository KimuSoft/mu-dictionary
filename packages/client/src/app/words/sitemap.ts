import { MetadataRoute } from "next"
import { fetchInitials } from "@/api/actions/fetchInitials"
import { fetchWords } from "@/api/actions/fetchWords"
import { FindMode } from "mudict-api-types"

export const generateSitemaps = async () => {
  const initialData = await fetchInitials()

  // initialData를 [{ㅇ: 100}, {ㅈ: 200}, {ㄱ: 300}] 형식으로 변환해서 리턴
  return initialData.map((data) => ({ [data.initial]: data.count }))
}

const sitemap = async ({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> => {
  const words = await fetchWords({
    mode: FindMode.Like,
    name: `${id}%`,
    limit: 10000000,
  })

  return words.map((word) => ({
    url: `https://dict.kimustory.net/words/${word.sourceId}`,
    changeFrequency: "daily",
    lastModified: word.updatedAt,
  }))
}

export default sitemap
