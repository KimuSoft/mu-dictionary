import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../../api/api"
import { Word } from "mudict-api-types"
import { Center, Textarea, useToast } from "@chakra-ui/react"

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

  return (
    <Center w={"100vw"}>
      {word ? (
        <Textarea value={JSON.stringify(word, null, 2)} readOnly={true} />
      ) : (
        <Textarea value={"Loading..."} readOnly={true} />
      )}
    </Center>
  )
}

export default WordPage
