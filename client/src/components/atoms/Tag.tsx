import React from "react"
import styled from "styled-components"
import { ImSpoonKnife } from "react-icons/all"

const TagBox = styled.div<{ color: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;

  background: ${(props) => props.color};
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

interface Tag {
  name: string
  icon?: any
}

const Tag: React.FC<{ tag: string }> = ({ tag }) => {
  const getTagData = (tag: string) => {
    switch (tag) {
      case "food":
        // tailwind/lime/400
        return {
          name: "음식",
          icon: <ImSpoonKnife color="#000" />,
          color: "#a3e635",
        }

      default:
        // tailwind/yellow/400
        return { name: tag, color: "#facc15" }
    }
  }

  const tagData = getTagData(tag)

  return (
    <TagBox color={tagData.color}>
      {tagData.icon}
      <TagLabel>{tagData.name}</TagLabel>
    </TagBox>
  )
}

export default Tag
