import React from "react"
import styled from "styled-components"
import ThemeTag from "../atoms/ThemeTag"
import PosTag from "../atoms/PosTag"
import { IWord, WordClass } from "../../types/types"

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

  margin: 0;

  width: 0;
  flex-grow: 1;
`

const SenseNumber = styled.h3`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;

  width: 25px;
  margin: 0;

  /* tailwind/neutral/300 */
  color: #d4d4d4;
`

const Meaning: React.FC<{ word: IWord }> = ({ word }) => {
  return (
    <MeaningBox>
      <SenseNumber>
        {word.number
          ? word.number < 10
            ? `0${word.number}`
            : word.number
          : "01"}
      </SenseNumber>
      {word.wordClass !== WordClass.None ? (
        <PosTag pos={word.wordClass} />
      ) : null}
      {word.tags.map((tag) => (
        <ThemeTag tag={tag} />
      ))}
      <Definition>{word.definition}</Definition>
    </MeaningBox>
  )
}

export default Meaning
