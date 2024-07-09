import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../api/api"
import { Word } from "mudict-api-types"
import { useToast } from "@chakra-ui/react"

const WordPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const toast = useToast()

  const [word, setWord] = useState<Word | null>(null)

  const fetchWord = async () => {
    const res = await api.get(`/words/${id}`)

    if (!res.data) {
      navigate("/")
      toast({
        title: "Word not found",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setWord(res.data)
  }

  useEffect(() => {
    if (!id) navigate("/")

    fetchWord().then()
  }, [id])

  return <div>{JSON.stringify(word)}</div>
}

export default WordPage
