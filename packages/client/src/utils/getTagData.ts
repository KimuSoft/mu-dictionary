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

export default function (tag: string) {
  switch (tag) {
    // 총류 및 미분류 (gray)

    // 기술과학 (red)
    case "의학":
      return { name: "의학", icon: MdLocalHospital, color: "red" }

    case "약학":
      return { name: "약학", icon: FaCapsules, color: "red" }

    case "수의":
      return { name: "수의", icon: FaShieldDog, color: "red" }

    case "공업":
      return { name: "공업", icon: BiSolidFactory, color: "red" }

    case "건설":
      return { name: "건설", icon: LuConstruction, color: "red" }

    case "교통":
      return { name: "교통", icon: FaSubway, color: "red" }

    case "광업":
      return { name: "광업", icon: TbPick, color: "red" }

    case "전기·전자":
      return { name: "전기·전자", icon: MdElectricBolt, color: "red" }

    case "군사":
      return { name: "군사", icon: GiTank, color: "red" }

    // 순수과학 (orange)
    case "교육":
      return { name: "교육", icon: MdSchool, color: "orange" }

    case "수학":
      return { name: "수학", icon: FaCalculator, color: "orange" }

    case "물리":
      return { name: "물리", icon: LuAtom, color: "orange" }

    case "천문":
      return { name: "천문", icon: IoMdPlanet, color: "orange" }

    case "화학":
      return { name: "화학", icon: FaFlask, color: "orange" }

    case "행정":
      return { name: "행정", icon: BsPersonFillGear, color: "orange" }

    case "재료":
      return { name: "재료", icon: HiOutlineCube, color: "orange" }

    // 예체능 (yellow)
    case "애니메이션":
      return { name: "애니메이션", color: "yellow", icon: MdOndemandVideo }

    case "미술":
      return { name: "미술", icon: FaPalette, color: "yellow" }

    case "음악":
      return { name: "음악", icon: FaMusic, color: "yellow" }

    case "체육":
      return { name: "체육", icon: FaDumbbell, color: "yellow" }

    case "복식":
      return { name: "복식", icon: FaTshirt, color: "yellow" }

    case "연기":
      return { name: "연기", color: "yellow" }

    case "공예":
      return { name: "공예", color: "yellow" }

    case "무용":
      return { name: "무용", icon: FaPersonFalling, color: "yellow" }

    case "예체능 일반":
      return {
        name: "예체능 일반",
        icon: FaPersonSnowboarding,
        color: "yellow",
      }

    case "만화":
      return { name: "만화", icon: AiFillLayout, color: "yellow" }

    // 자연 및 환경 (green)
    case "동물":
      return { name: "동물", icon: FaCat, color: "green" }

    case "식물":
      return { name: "식물", icon: RiPlantFill, color: "green" }

    case "환경":
      return { name: "환경", icon: FaTree, color: "green" }

    case "지구":
      return { name: "지구", icon: FaEarthAsia, color: "green" }

    case "생명":
      return { name: "생명", icon: FaHeart, color: "green" }

    case "농업":
      return { name: "농업", icon: MdAgriculture, color: "green" }

    case "해양":
      return { name: "해양", icon: FaWater, color: "green" }

    case "임업":
      return { name: "임업", icon: PiAxeFill, color: "green" }

    case "수산업":
      return { name: "수산업", icon: FaFish, color: "green" }

    case "자연 일반":
      return { name: "자연 일반", icon: MdOutlineNaturePeople, color: "green" }

    // 사회과학 + 역사 (teal)
    case "역사":
      return { name: "역사", icon: FaHistory, color: "teal" }

    case "경영":
      return { name: "경영", icon: FaBusinessTime, color: "teal" }

    case "경제":
      return { name: "경제", icon: MdAttachMoney, color: "teal" }

    case "법률":
      return { name: "법률", icon: GoLaw, color: "teal" }

    case "지리":
      return { name: "지리", icon: FaMap, color: "teal" }

    case "기업":
      return { name: "기업", icon: BiBuildings, color: "teal" }

    case "심리":
      return { name: "심리", icon: FaFaceFrownOpen, color: "teal" }

    // 언어 및 문학 (blue)
    case "언어":
      return { name: "언어", icon: IoLanguage, color: "blue" }

    case "방언":
      return { name: "방언", color: "blue" }

    case "북한어":
      return { name: "북한어", color: "blue" }

    case "책명":
      return { name: "책명", icon: FiBook, color: "blue" }

    case "문학":
      return { name: "문학", icon: FaBook, color: "blue" }

    case "옛말":
      return { name: "옛말", icon: FaScroll, color: "blue" }

    // 철학 + 종교  (cyan)
    case "가톨릭":
      return { name: "가톨릭", icon: FaCross, color: "cyan" }

    case "기독교":
      return { name: "기독교", icon: FaCross, color: "cyan" }

    case "불교":
      return { name: "불교", icon: MdTempleBuddhist, color: "cyan" }

    case "종교 일반":
      return { name: "종교 일반", icon: FaPersonPraying, color: "cyan" }

    // IT 및 컴퓨터 (purple)
    case "정보·통신":
      return { name: "정보·통신", icon: FaInternetExplorer, color: "purple" }

    case "게임":
      return { name: "게임", icon: FaGamepad, color: "purple" }

    case "스팀 게임":
      return { name: "스팀 게임", icon: FaSteam, color: "purple" }

    case "모바일 게임":
      return { name: "모바일 게임", icon: FaMobileAlt, color: "purple" }

    case "PC/온라인 게임":
      return { name: "PC/온라인 게임", icon: MdMonitor, color: "purple" }

    case "비디오 게임":
      return { name: "비디오 게임", icon: MdMonitor, color: "purple" }

    case "아케이드 게임":
      return { name: "아케이드 게임", icon: SiApplearcade, color: "purple" }

    case "온라인 게임":
      return { name: "온라인 게임", icon: IoIosWifi, color: "purple" }

    case "방송":
      return { name: "방송", icon: GrMonitor, color: "purple" }

    case "영상":
      return { name: "영상", icon: FaVideo, color: "purple" }

    // 지역 및 고유명사 (pink)
    case "인명":
      return { name: "인명", icon: BsFillPersonFill, color: "pink" }

    case "지명":
      return { name: "지명", icon: FaMapMarkerAlt, color: "pink" }

    case "식품":
      return { name: "식품", icon: ImSpoonKnife, color: "pink" }

    case "고유명 일반":
      return { name: "고유명 일반", icon: FaTag, color: "pink" }

    // 그 외 미디어 (각 테마에 따라)
    case "마인크래프트":
      return { name: "마인크래프트", color: "green", icon: TbBrandMinecraft }

    case "대중교통":
      return { name: "대중교통", icon: FaBus, color: "blue" }

    case "영화":
      return { name: "영화", icon: MdMovie, color: "blue" }

    case "기계":
      return { name: "기계", icon: FaGears, color: "red" }

    case "정치":
      return { name: "정치", icon: RiBankFill, color: "teal" }

    case "사회 일반":
      return { name: "사회 일반", icon: IoShareSocial, color: "teal" }

    case "스타듀 밸리":
      return { name: "스타듀 밸리", icon: GiChickenOven, color: "green" }

    case "원신":
      return { name: "원신", icon: PiStarFourFill, color: "white" }

    case "붕괴: 스타레일":
      return { name: "붕괴: 스타레일", icon: FaMoon, color: "purple" }

    case "작혼":
      return { name: "작혼", icon: GiBamboo, color: "pink" }

    case "프로젝트 문":
      return { name: "프로젝트 문", icon: FaStarAndCrescent, color: "pink" }

    default:
      return { name: tag, color: "gray" }
  }
}
