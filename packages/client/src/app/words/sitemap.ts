import { MetadataRoute } from "next"
import { fetchInitials } from "@/api/actions/fetchInitials"
import { fetchWords } from "@/api/actions/fetchWords"
import { FindMode } from "mudict-api-types"

export const dynamic = "force-dynamic"

// const fetchInitialsCache = cache(fetchInitials)

export async function generateSitemaps() {
  try {
    const initialData = await fetchInitials()

    // {id: "ㄱ"}, {id: "ㄴ"}, {id: "ㄷ"} 형식으로 변환해서 리턴
    return initialData.map((data) => ({ id: data.initial }))
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
