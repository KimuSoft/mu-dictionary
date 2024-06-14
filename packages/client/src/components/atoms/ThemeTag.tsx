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
import { MdMovie, MdOndemandVideo } from "react-icons/md"
import { BiBuildings } from "react-icons/bi"
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react"
import { TbBrandMinecraft } from "react-icons/tb"

const ThemeTag: React.FC<{ tag: string }> = ({ tag }) => {
  const getTagData = (tag: string) => {
    switch (tag) {
      // 우리말샘 주제
      case "인명":
        // tailwind/purple/200
        return {
          name: "인명",
          icon: BsFillPersonFill,
          color: "blue",
        }

      case "책명":
        // tailwind/Emerald/200
        return {
          name: "책명",
          icon: FiBook,
          color: "green",
        }

      case "정보·통신":
        // tailwind/Gray/400
        return {
          name: "정보·통신",
          icon: FaInternetExplorer,
          color: "purple",
        }

      case "fiction":
        // tailwind/Gray/400
        return {
          name: "픽션",
          icon: FaMagic,
          color: "#6366f1",
        }

      case "게임":
        // tailwind/violet/400
        return {
          name: "게임",
          icon: FaGamepad,
          color: "purple",
        }

      case "애니메이션":
        // tailwind/Amber/300
        return {
          name: "애니메이션",
          color: "orange",
          icon: MdOndemandVideo,
        }

      case "마인크래프트":
        return {
          name: "마인크래프트",
          color: "green",
          icon: TbBrandMinecraft,
        }

      case "만화":
        // tailwind/Red/400
        return {
          name: "만화",
          color: "#f87171",
        }

      case "방송":
        // tailwind/violet/400
        return {
          name: "방송",
          icon: GrMonitor,
          color: "#f472b6",
        }

      case "책명":
        // tailwind/Emerald/400
        return {
          name: "책명",
          icon: FiBook,
          color: "#34d399",
        }

      case "식품":
        // tailwind/lime/400
        return {
          name: "식품",
          icon: ImSpoonKnife,
          color: "red",
        }

      case "교통":
        return {
          name: "교통",
          icon: FaSubway,
          // tailwind/cyan/400
          color: "#22d3ee",
        }

      case "영화":
        return {
          name: "영화",
          icon: MdMovie,
          color: "blue",
        }

      case "기업":
        return {
          name: "기업",
          icon: BiBuildings,
          // tailwind/orange/400
          color: "#fb923c",
        }

      default:
        // tailwind/yellow/400
        return { name: tag, color: "gray" }
    }
  }

  const tagData = getTagData(tag)

  return (
    <Tag colorScheme={tagData.color} size={"sm"} flexShrink={0}>
      {tagData.icon && <TagLeftIcon as={tagData.icon} />}
      <TagLabel>{tagData.name}</TagLabel>
    </Tag>
  )
}

export default ThemeTag
