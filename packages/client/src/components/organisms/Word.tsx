import React from "react"
import WordHeader from "../molecules/WordHeader"
import Meaning from "../molecules/Meaning"
import styled from "styled-components"
import { Homonym } from "../../types/types"

const ResultStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 10px;
  gap: 20px;
`

const Meanings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  gap: 10px;
`

const Word: React.FC<{ homonym: Homonym }> = ({ homonym }) => {
  return (
    <div>
      <WordHeader
        word={homonym.name}
        origin={homonym.origin}
        pronunciation={homonym.pronunciation}
      />
      <Meanings>
        {homonym.words.map((word) => (
          <Meaning word={word} />
        ))}
      </Meanings>
    </div>
  )
}

export default Word
