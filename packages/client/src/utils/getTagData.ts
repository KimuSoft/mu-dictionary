import {
  FaBook,
  FaBus,
  FaBusinessTime,
  FaCalculator,
  FaCapsules,
  FaCat,
  FaCross,
  FaDumbbell,
  FaFlask,
  FaGamepad,
  FaHeart,
  FaHistory,
  FaInternetExplorer,
  FaMap,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaMoon,
  FaPalette,
  FaStarAndCrescent,
  FaSteam,
  FaSubway,
  FaTree,
  FaTshirt,
  FaVideo,
} from "react-icons/fa"
import { LuAtom, LuConstruction } from "react-icons/lu"
import {
  MdAgriculture,
  MdAttachMoney,
  MdElectricBolt,
  MdLocalHospital,
  MdMonitor,
  MdMovie,
  MdOndemandVideo,
  MdOutlineNaturePeople,
  MdSchool,
  MdTempleBuddhist,
} from "react-icons/md"
import { BiBuildings, BiSolidFactory } from "react-icons/bi"
import { IoIosWifi, IoMdPlanet } from "react-icons/io"
import {
  FaEarthAsia,
  FaFaceFrownOpen,
  FaFish,
  FaGears,
  FaMusic,
  FaPersonFalling,
  FaPersonPraying,
  FaPersonSnowboarding,
  FaScroll,
  FaShieldDog,
  FaTag,
  FaWater,
} from "react-icons/fa6"
import { RiBankFill, RiPlantFill } from "react-icons/ri"
import { GoLaw } from "react-icons/go"
import { IoLanguage, IoShareSocial } from "react-icons/io5"
import { BsFillPersonFill, BsPersonFillGear } from "react-icons/bs"
import { FiBook } from "react-icons/fi"
import { TbBrandMinecraft, TbPick } from "react-icons/tb"
import { AiFillLayout } from "react-icons/ai"
import { GrMonitor } from "react-icons/gr"
import { ImSpoonKnife } from "react-icons/im"
import { GiBamboo, GiChickenOven, GiTank } from "react-icons/gi"
import { PiAxeFill, PiStarFourFill } from "react-icons/pi"
import { SiApplearcade } from "react-icons/si"
import { HiOutlineCube } from "react-icons/hi"
import { IconType } from "react-icons"

interface PartialTagData {
  id: string
  name?: string
  icon?: IconType
  color: string
}

export interface TagData extends PartialTagData {
  name: string
}

const tagData: PartialTagData[] = [
  // 총류 및 미분류 (gray)

  // 기술과학 (red)
  { id: "의학", icon: MdLocalHospital, color: "red" },
  { id: "약학", icon: FaCapsules, color: "red" },
  { id: "수의", icon: FaShieldDog, color: "red" },
  { id: "공업", icon: BiSolidFactory, color: "red" },
  { id: "건설", icon: LuConstruction, color: "red" },
  { id: "교통", icon: FaSubway, color: "red" },
  { id: "광업", icon: TbPick, color: "red" },
  { id: "전기·전자", icon: MdElectricBolt, color: "red" },
  { id: "군사", icon: GiTank, color: "red" },
  { id: "기계", icon: FaGears, color: "red" },

  // 순수과학 (orange)
  { id: "교육", icon: MdSchool, color: "orange" },
  { id: "수학", icon: FaCalculator, color: "orange" },
  { id: "물리", icon: LuAtom, color: "orange" },
  { id: "천문", icon: IoMdPlanet, color: "orange" },
  { id: "화학", icon: FaFlask, color: "orange" },
  { id: "행정", icon: BsPersonFillGear, color: "orange" },
  { id: "재료", icon: HiOutlineCube, color: "orange" },

  // 예체능 (yellow)
  { id: "애니메이션", icon: MdOndemandVideo, color: "yellow" },
  { id: "미술", icon: FaPalette, color: "yellow" },
  { id: "음악", icon: FaMusic, color: "yellow" },
  { id: "체육", icon: FaDumbbell, color: "yellow" },
  { id: "복식", icon: FaTshirt, color: "yellow" },
  { id: "연기", color: "yellow" },
  { id: "공예", color: "yellow" },
  { id: "무용", icon: FaPersonFalling, color: "yellow" },
  { id: "예체능 일반", icon: FaPersonSnowboarding, color: "yellow" },
  { id: "만화", icon: AiFillLayout, color: "yellow" },
  { id: "영화", icon: MdMovie, color: "yellow" },

  // 자연 및 환경 (green)
  { id: "동물", icon: FaCat, color: "green" },
  { id: "식물", icon: RiPlantFill, color: "green" },
  { id: "환경", icon: FaTree, color: "green" },
  { id: "지구", icon: FaEarthAsia, color: "green" },
  { id: "생명", icon: FaHeart, color: "green" },
  { id: "농업", icon: MdAgriculture, color: "green" },
  { id: "해양", icon: FaWater, color: "green" },
  { id: "임업", icon: PiAxeFill, color: "green" },
  { id: "수산업", icon: FaFish, color: "green" },
  { id: "자연 일반", icon: MdOutlineNaturePeople, color: "green" },

  // 사회과학 + 역사 (teal)
  { id: "역사", icon: FaHistory, color: "teal" },
  { id: "경영", icon: FaBusinessTime, color: "teal" },
  { id: "경제", icon: MdAttachMoney, color: "teal" },
  { id: "법률", icon: GoLaw, color: "teal" },
  { id: "지리", icon: FaMap, color: "teal" },
  { id: "기업", icon: BiBuildings, color: "teal" },
  { id: "심리", icon: FaFaceFrownOpen, color: "teal" },
  { id: "정치", icon: RiBankFill, color: "teal" },
  { id: "사회 일반", icon: IoShareSocial, color: "teal" },

  // 언어 및 문학 (blue)
  { id: "언어", icon: IoLanguage, color: "blue" },
  { id: "방언", color: "blue" },
  { id: "북한어", color: "blue" },
  { id: "책명", icon: FiBook, color: "blue" },
  { id: "문학", icon: FaBook, color: "blue" },
  { id: "옛말", icon: FaScroll, color: "blue" },

  // 철학 + 종교  (cyan)
  { id: "가톨릭", icon: FaCross, color: "cyan" },
  { id: "기독교", icon: FaCross, color: "cyan" },
  { id: "불교", icon: MdTempleBuddhist, color: "cyan" },
  { id: "종교 일반", icon: FaPersonPraying, color: "cyan" },

  // IT 및 컴퓨터 (purple)
  { id: "정보·통신", icon: FaInternetExplorer, color: "purple" },
  { id: "방송", icon: GrMonitor, color: "purple" },
  { id: "영상", icon: FaVideo, color: "purple" },

  { id: "게임", icon: FaGamepad, color: "purple" },
  { id: "게임/스팀 게임", icon: FaSteam, color: "purple" },
  { id: "게임/모바일 게임", icon: FaMobileAlt, color: "purple" },
  { id: "게임/PC·온라인 게임", icon: MdMonitor, color: "purple" },
  { id: "게임/비디오 게임", icon: MdMonitor, color: "purple" },
  { id: "게임/아케이드 게임", icon: SiApplearcade, color: "purple" },
  { id: "게임/온라인 게임", icon: IoIosWifi, color: "purple" },

  // 지역 및 고유명사 (pink)
  { id: "인명", icon: BsFillPersonFill, color: "pink" },
  { id: "지명", icon: FaMapMarkerAlt, color: "pink" },
  { id: "식품", icon: ImSpoonKnife, color: "pink" },
  { id: "고유명 일반", icon: FaTag, color: "pink" },
  { id: "대중교통", icon: FaBus, color: "blue" },

  // ETC
  { id: "스타듀 밸리", icon: GiChickenOven, color: "green" },
  { id: "마인크래프트", icon: TbBrandMinecraft, color: "green" },
  { id: "원신", icon: PiStarFourFill, color: "purple" },
  { id: "붕괴: 스타레일", icon: FaMoon, color: "purple" },
  { id: "작혼", icon: GiBamboo, color: "pink" },
  { id: "프로젝트 문", icon: FaStarAndCrescent, color: "pink" },
]

export default function getTagData(tag: string): TagData {
  const defaultTagData = { id: tag, name: tag, color: "gray" }

  const tagDataItem = tagData.find((item) => item.id === tag)
  if (tagDataItem) return { ...defaultTagData, ...tagDataItem }

  // 태그 정보가 없고 '/'가 포함되어 있다면
  if (tag.includes("/")) {
    const tagDataItem = tagData.find((item) => item.id === tag.split("/")[0])
    if (tagDataItem)
      return { ...defaultTagData, ...tagDataItem, id: tag, name: tag }
  }

  return defaultTagData
}
