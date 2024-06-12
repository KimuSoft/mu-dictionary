import React from "react"
import styled from "styled-components"
import {
  BiBuildings,
  BsFillPersonFill,
  FaGamepad,
  FaInternetExplorer,
  FaMagic,
  FaSubway,
  FiBook,
  GrMonitor,
  ImSpoonKnife,
  MdMovie,
} from "react-icons/all"

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
      // 우리말샘 주제
      case "인명":
        // tailwind/purple/200
        return {
          name: "인명",
          icon: <BsFillPersonFill color="#000" />,
          color: "#e9d5ff",
        }

      case "책명":
        // tailwind/Emerald/200
        return {
          name: "책명",
          icon: <FiBook color="#000" />,
          color: "#a7f3d0",
        }

      case "정보·통신":
        // tailwind/Gray/400
        return {
          name: "정보·통신",
          icon: <FaInternetExplorer color="#000" />,
          color: "#9ca3af",
        }

      case "computer":
        // tailwind/Gray/400
        return {
          name: "정보·통신+",
          icon: <FaInternetExplorer color="#fff" />,
          color: "#4b5563",
        }

      case "fiction":
        // tailwind/Gray/400
        return {
          name: "픽션",
          icon: <FaMagic color="#fff" />,
          color: "#6366f1",
        }

      // 그 외 커스텀 태그
      case "person":
        // tailwind/purple/400
        return {
          name: "인명+",
          icon: <BsFillPersonFill color="#000" />,
          color: "#c084fc",
        }

      case "game":
        // tailwind/violet/400
        return {
          name: "게임",
          icon: <FaGamepad color="#000" />,
          color: "#c084fc",
        }

      case "ani":
        // tailwind/Amber/300
        return {
          name: "애니메이션",
          color: "#fcd34d",
        }

      case "comic":
        // tailwind/Red/400
        return {
          name: "만화",
          color: "#f87171",
        }

      case "tv":
        // tailwind/violet/400
        return {
          name: "방송",
          icon: <GrMonitor color="#000" />,
          color: "#f472b6",
        }

      case "book":
        // tailwind/Emerald/400
        return {
          name: "책명+",
          icon: <FiBook color="#000" />,
          color: "#34d399",
        }

      case "food":
        // tailwind/lime/400
        return {
          name: "음식",
          icon: <ImSpoonKnife color="#000" />,
          color: "#a3e635",
        }

      case "traffic":
        return {
          name: "교통+",
          icon: <FaSubway color="#000" />,
          // tailwind/cyan/400
          color: "#22d3ee",
        }

      case "movie":
        return {
          name: "영화",
          icon: <MdMovie color="#000" />,
          // tailwind/Emerald/300
          color: "#6ee7b7",
        }

      case "corp":
        return {
          name: "기업",
          icon: <BiBuildings color="#000" />,
          // tailwind/orange/400
          color: "#fb923c",
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
