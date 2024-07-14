import { MetadataRoute } from "next"

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: "https://dict.kimustory.net",
      changeFrequency: "weekly",
    },
    {
      url: "https://dict.kimustory.net/long-words",
      changeFrequency: "weekly",
    },
    {
      url: "https://dict.kimustory.net/quiz",
      changeFrequency: "monthly",
    },
    {
      url: "https://dict.kimustory.net/words/sitemap/index.xml",
      changeFrequency: "weekly",
    },
    {
      url: "https://dict.kimustory.net/long-words/sitemap.xml",
      changeFrequency: "weekly",
    },
  ]
}

export default sitemap
