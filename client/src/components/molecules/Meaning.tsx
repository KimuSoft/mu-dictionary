import React from "react"
import styled from "styled-components"
import Tag from "../atoms/Tag"
import Pos from "../atoms/Pos"
import { Word } from "../../types"

const MeaningBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  width: 100%;
`

const Definition = styled.h3`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 12px;
`

const SenseNumber = styled.h3`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;

  /* tailwind/neutral/300 */
  color: #d4d4d4;
`

const Meaning: React.FC<{ word: Word }> = ({ word }) => {
  return (
    <MeaningBox>
      <SenseNumber>01</SenseNumber>
      <Pos pos={word.wordClass} />
      {word.tags.map((tag) => (
        <Tag tag={tag} />
      ))}
      <Definition>{word.definition}</Definition>
    </MeaningBox>
  )
}

export default Meaning
