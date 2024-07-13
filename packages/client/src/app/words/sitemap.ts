import { MetadataRoute } from "next"
import { fetchInitials } from "@/api/actions/fetchInitials"
import { fetchWords } from "@/api/actions/fetchWords"
import { FindMode } from "mudict-api-types"

export const dynamic = "force-dynamic"

// const fetchInitialsCache = cache(fetchInitials)

export async function generateSitemaps() {
  const index = {
    id: "index",
  }

  try {
    const initialData = await fetchInitials()

    // 데이터 내에 count가 50,000개가 넘는 게 있다면 경고
    const overLimit = initialData.find((data) => data.count > 50000)

    if (overLimit) {
      console.warn(`Initial ${overLimit.initial} has over 50,000 words`)
    }

    // {id: "ㄱ"}, {id: "ㄴ"}, {id: "ㄷ"} 형식으로 변환해서 리턴
    const data = initialData.map((data) => ({ id: data.initial }))
    data.push(index)

    return data
  } catch (e) {
    console.warn("Failed to fetch initials")
    return []
  }
}

export default async function sitemap({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  if (id === "index") {
    const initialData = await fetchInitials()

    return initialData.map((data) => ({
      url: `https://dict.kimustory.net/words/sitemap/${encodeURIComponent(data.initial)}.xml`,
    }))
  }

  const words = await fetchWords({
    mode: FindMode.Like,
    name: `${id}%`,
    limit: 10000000,
  })

  return words.map((word) => ({
    url: `https://dict.kimustory.net/words/${word.sourceId}`,
    changeFrequency: "weekly",
    lastModified: word.updatedAt,
  }))
}
