import { MetadataRoute } from "next"
import { fetchInitials } from "@/api/actions/fetchInitials"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const initialData = await fetchInitials()

  // 개수 로깅
  if (initialData.length > 50000) {
    console.warn(`Initial Data has over 50,000 words`)
  }

  return initialData.map((data) => ({
    url: `https://dict.kimustory.net/long-words?letter=${data.initial}`,
  }))
}
