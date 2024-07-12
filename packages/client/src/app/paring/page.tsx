import React from "react"
import ParingTemplate from "@/components/templates/ParingTemplate"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

const Page: React.FC = async () => {
  return <ParingTemplate />
}

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `파링이 누르기`,
    description:
      "우리 팀의 귀여운 개발자님을 눌러보세요! 다양한 반응을 보여줄 거예요!",
    classification: "game",
  }
}

export default Page
