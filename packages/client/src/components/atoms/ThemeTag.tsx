import React from "react"
import { BsFillPersonFill } from "react-icons/bs"
import { FiBook } from "react-icons/fi"
import {
  FaGamepad,
  FaInternetExplorer,
  FaMagic,
  FaSubway,
} from "react-icons/fa"
import { GrMonitor } from "react-icons/gr"
import { ImSpoonKnife } from "react-icons/im"
import { MdMovie } from "react-icons/md"
import { BiBuildings } from "react-icons/bi"
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"

const ThemeTag: React.FC<{ tag: string }> = ({ tag }) => {
  const getTagData = (tag: string) => {
    switch (tag) {
      // 우리말샘 주제
      case "인명":
        // tailwind/purple/200
        return {
          name: "인명",
          icon: BsFillPersonFill,
          color: "#e9d5ff",
        }

      case "책명":
        // tailwind/Emerald/200
        return {
          name: "책명",
          icon: FiBook,
          color: "#a7f3d0",
        }

      case "정보·통신":
        // tailwind/Gray/400
        return {
          name: "정보·통신",
          icon: FaInternetExplorer,
          color: "#9ca3af",
        }

      case "computer":
        // tailwind/Gray/400
        return {
          name: "정보·통신+",
          icon: FaInternetExplorer,
          color: "#4b5563",
        }

      case "fiction":
        // tailwind/Gray/400
        return {
          name: "픽션",
          icon: FaMagic,
          color: "#6366f1",
        }

      // 그 외 커스텀 태그
      case "person":
        // tailwind/purple/400
        return {
          name: "인명+",
          icon: BsFillPersonFill,
          color: "#c084fc",
        }

      case "game":
        // tailwind/violet/400
        return {
          name: "게임",
          icon: FaGamepad,
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
          icon: GrMonitor,
          color: "#f472b6",
        }

      case "book":
        // tailwind/Emerald/400
        return {
          name: "책명+",
          icon: FiBook,
          color: "#34d399",
        }

      case "food":
        // tailwind/lime/400
        return {
          name: "음식",
          icon: ImSpoonKnife,
          color: "#a3e635",
        }

      case "traffic":
        return {
          name: "교통+",
          icon: FaSubway,
          // tailwind/cyan/400
          color: "#22d3ee",
        }

      case "movie":
        return {
          name: "영화",
          icon: MdMovie,
          // tailwind/Emerald/300
          color: "#6ee7b7",
        }

      case "corp":
        return {
          name: "기업",
          icon: BiBuildings,
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
    <Tag color={tagData.color}>
      {tagData.icon && <TagLeftIcon as={tagData.icon} />}
      <TagLabel>{tagData.name}</TagLabel>
    </Tag>
  )
}

export default ThemeTag
