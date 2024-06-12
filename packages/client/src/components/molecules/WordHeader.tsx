import React from "react"
import styled from "styled-components"

const WordHeaderBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`

const Word = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
`

const Origin = styled.h3`
  font-weight: 500;
  font-size: 20px;
  line-height: 29px;

  /* tailwind/zinc/600 */
  color: #52525b;
`

const WordHeader: React.FC<{
  word: string
  origin?: string
  pronunciation?: string
}> = ({ word, origin, pronunciation }) => {
  return (
    <WordHeaderBox>
      <Word>{word}</Word>
      {origin && origin !== "undefined" ? (
        <Origin>{`(${origin})`}</Origin>
      ) : null}
      {pronunciation ? <Origin>{`[${pronunciation}]`}</Origin> : null}
    </WordHeaderBox>
  )
}

export default WordHeader
