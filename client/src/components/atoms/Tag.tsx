import React from "react"
import styled from "styled-components"

const TagBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;

  /* tailwind/yellow/400 */
  background: #facc15;
  border-radius: 10px;
`

const TagLabel = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* tailwind/black */
  color: #000000;
`

const Tag: React.FC<{ tag: string }> = ({ tag }) => {
  return (
    <TagBox>
      <TagLabel>{tag}</TagLabel>
    </TagBox>
  )
}

// const getTagName = (wordClass: WordClass): string => {
//   switch (wordClass) {
//     case WordClass.Noun:
//       return "명"
//   }
// }

export default Tag
