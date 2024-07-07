import {
  FaBus,
  FaBusinessTime,
  FaCalculator,
  FaCat,
  FaCross,
  FaDumbbell,
  FaFlask,
  FaGamepad,
  FaHeart,
  FaHistory,
  FaInternetExplorer,
  FaMagic,
  FaMap,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaMoon,
  FaPalette,
  FaStarAndCrescent,
  FaSteam,
  FaSubway,
  FaTree,
  FaVideo,
} from "react-icons/fa"
import { LuAtom, LuConstruction } from "react-icons/lu"
import {
  MdAttachMoney,
  MdMonitor,
  MdMovie,
  MdOndemandVideo,
  MdSchool,
  MdTempleBuddhist,
} from "react-icons/md"
import { BiBuildings, BiSolidFactory } from "react-icons/bi"
import { IoMdPlanet } from "react-icons/io"
import { FaEarthAsia, FaGears, FaMusic, FaTag } from "react-icons/fa6"
import { RiBankFill, RiPlantFill } from "react-icons/ri"
import { GoLaw } from "react-icons/go"
import { IoLanguage, IoShareSocial } from "react-icons/io5"
import { BsFillPersonFill } from "react-icons/bs"
import { FiBook } from "react-icons/fi"
import { TbBrandMinecraft } from "react-icons/tb"
import { AiFillLayout } from "react-icons/ai"
import { GrMonitor } from "react-icons/gr"
import { ImSpoonKnife } from "react-icons/im"
import { GiBamboo, GiChickenOven } from "react-icons/gi"
import { PiStarFourFill } from "react-icons/pi"

export default function (tag: string) {
  switch (tag) {
    // 총류 및 미분류 (gray)

    // 기술과학 (red)

    // 순수과학 (orange)

    // 예술 (yellow)

    // 자연 및 환경 (green)

    // 사회과학 + 종교 + 역사 (teal)

    // 문학 (blue)

    // 철학 + 종교 + 사회과학 (green)

    // IT 및 컴퓨터 (purple)
    case "가톨릭":
      return {
        name: "가톨릭",
        icon: FaCross,
        color: "blue",
      }

    case "건설":
      return {
        name: "건설",
        icon: LuConstruction,
        color: "red",
      }

    case "경영":
      return {
        name: "경영",
        icon: FaBusinessTime,
        color: "teal",
      }

    case "경제":
      return {
        name: "경제",
        icon: MdAttachMoney,
        color: "teal",
      }

    case "공업":
      return {
        name: "공업",
        icon: BiSolidFactory,
        color: "red",
      }

    case "교육":
      return {
        name: "교육",
        icon: MdSchool,
        color: "blue",
      }

    case "교통":
      return { name: "교통", icon: FaSubway, color: "blue" }

    case "기독교":
      return { name: "기독교", icon: FaCross, color: "blue" }

    case "동물":
      return {
        name: "동물",
        icon: FaCat,
        color: "green",
      }

    case "수학":
      return {
        name: "수학",
        icon: FaCalculator,
        color: "blue",
      }

    case "물리":
      return {
        name: "물리",
        icon: LuAtom,
        color: "purple",
      }

    case "천문":
      return {
        name: "천문",
        icon: IoMdPlanet,
        color: "cyan",
      }

    case "화학":
      return {
        name: "화학",
        icon: FaFlask,
        color: "purple",
      }

    case "미술":
      return {
        name: "미술",
        icon: FaPalette,
        color: "yellow",
      }

    case "음악":
      return {
        name: "음악",
        icon: FaMusic,
        color: "orange",
      }

    case "식물":
      return {
        name: "식물",
        icon: RiPlantFill,
        color: "green",
      }

    case "환경":
      return {
        name: "환경",
        icon: FaTree,
        color: "green",
      }

    case "불교":
      return {
        name: "불교",
        icon: MdTempleBuddhist,
        color: "red",
      }

    case "법률":
      return {
        name: "법률",
        icon: GoLaw,
        color: "blue",
      }

    case "언어":
      return {
        name: "언어",
        icon: IoLanguage,
        color: "green",
      }

    case "지구":
      return {
        name: "지구",
        icon: FaEarthAsia,
        color: "green",
      }

    case "지명":
      return {
        name: "지명",
        icon: FaMapMarkerAlt,
        color: "orange",
      }

    case "지리":
      return {
        name: "지리",
        icon: FaMap,
        color: "orange",
      }

    case "역사":
      return {
        name: "역사",
        icon: FaHistory,
        color: "orange",
      }

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

    // 추가 단어

    case "fiction":
      // tailwind/Gray/400
      return {
        name: "픽션",
        icon: FaMagic,
        color: "#6366f1",
      }

    case "게임":
      // tailwind/violet/400
      return { name: "게임", icon: FaGamepad, color: "purple" }

    case "애니메이션":
      // tailwind/Amber/300
      return { name: "애니메이션", color: "orange", icon: MdOndemandVideo }

    case "마인크래프트":
      return { name: "마인크래프트", color: "green", icon: TbBrandMinecraft }

    case "만화":
      // tailwind/Red/400
      return { name: "만화", icon: AiFillLayout, color: "#f87171" }

    case "방송":
      return { name: "방송", icon: GrMonitor, color: "purple" }

    case "식품":
      return { name: "식품", icon: ImSpoonKnife, color: "red" }

    case "대중교통":
      return { name: "대중교통", icon: FaBus, color: "blue" }

    case "영화":
      return { name: "영화", icon: MdMovie, color: "blue" }

    case "영상":
      return { name: "영상", icon: FaVideo, color: "blue" }

    case "기계":
      return { name: "기계", icon: FaGears, color: "red" }

    case "정치":
      return { name: "정치", icon: RiBankFill, color: "teal" }

    case "사회 일반":
      return { name: "사회 일반", icon: IoShareSocial, color: "teal" }

    case "PC/온라인 게임":
      return { name: "PC/온라인 게임", icon: MdMonitor, color: "purple" }

    case "스타듀 밸리":
      return { name: "스타듀 밸리", icon: GiChickenOven, color: "green" }

    case "심리":
      return { name: "심리", icon: FaHeart, color: "pink" }

    case "기업":
      return { name: "기업", icon: BiBuildings, color: "orange" }

    case "고유명 일반":
      return { name: "고유명 일반", icon: FaTag, color: "gray" }

    // 추가 단어 중 세부 단어
    case "원신":
      return { name: "원신", icon: PiStarFourFill, color: "white" }

    case "붕괴: 스타레일":
      return { name: "붕괴: 스타레일", icon: FaMoon, color: "purple" }

    case "작혼":
      return { name: "작혼", icon: GiBamboo, color: "pink" }

    case "프로젝트 문":
      return { name: "프로젝트 문", icon: FaStarAndCrescent, color: "pink" }

    case "스팀 게임":
      return { name: "스팀 게임", icon: FaSteam, color: "purple" }

    case "모바일 게임":
      return { name: "모바일 게임", icon: FaMobileAlt, color: "purple" }

    case "체육":
      return { name: "체육", icon: FaDumbbell, color: "red" }

    default:
      // tailwind/yellow/400
      return { name: tag, color: "gray" }
  }
}
