import { MetadataRoute } from "next"

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: "https://dict.kimustory.net",
      changeFrequency: "daily",
    },
    {
      url: "http://dict.kimustory.net/long-words",
      changeFrequency: "daily",
    },
    {
      url: "http://dict.kimustory.net/quiz",
      changeFrequency: "daily",
    },
    {
      url: "http://dict.kimustory.net/words",
      changeFrequency: "daily",
    },
  ]
}

export default sitemap
