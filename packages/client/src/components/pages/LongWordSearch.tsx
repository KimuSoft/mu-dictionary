import React, { useEffect } from "react"
import LongWordSearchTemplate from "../templates/LongWordSearchTemplate"
import { api } from "../../api/api"
import { useSearchParams } from "react-router-dom"

export interface LongWordItem {
  simplifiedName: string
  length: number
  ids: string[]
  tags: string[]
}

const LongWordSearch: React.FC = () => {
  const [words, setWords] = React.useState<LongWordItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isAllLoaded, setIsAllLoaded] = React.useState(false)

  // param
  const [searchParams] = useSearchParams()
  const letter = searchParams.get("letter")

  const refresh = async () => {
    setIsLoading(true)
    const res = await api.get("/words/search/long-word", {
      params: {
        letter,
        limit: 10,
        offset: 0,
      },
    })

    setWords(res.data)

    if (res.data.length < 10 || words.length >= 100) {
      setIsAllLoaded(true)
    }

    setIsLoading(false)
  }

  const loadMore = async () => {
    if (isAllLoaded || isLoading) return
    setIsLoading(true)
    const res = await api.get("/words/search/long-word", {
      params: {
        letter,
        limit: 10,
        offset: words.length,
      },
    })

    setWords([...words, ...res.data])

    if (res.data.length < 10 || words.length >= 100) {
      setIsAllLoaded(true)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsAllLoaded(false)
    setWords([])
    refresh().then()
  }, [letter])

  return (
    <LongWordSearchTemplate
      isLoading={isLoading}
      isAllLoaded={isAllLoaded}
      loadMore={loadMore}
      letter={letter}
      words={words}
    />
  )
}

export default LongWordSearch
