"use client"

import React from "react"
import { Button, Center, Text, useToast } from "@chakra-ui/react"
import { sample } from "lodash"
import Header from "@/components/organisms/Header"

const ParingTemplate: React.FC = () => {
  const toast = useToast()

  const [count, setCount] = React.useState(0)

  return (
    <>
      <Header showLogo showSearch />
      <Center
        w={"100%"}
        h={"100vh"}
        flexDir={"column"}
        gap={3}
        userSelect={"none"}
      >
        <Button
          colorScheme={"blue"}
          onClick={() => {
            setCount(count + 1)
            toast({
              title: sample(["에", "에?", "헤에...", "모루", "으에"])!,
              status: sample(["success", "info", "warning", "error"])!,
              position: sample([
                "top-right",
                "top-left",
                "bottom-left",
                "bottom-right",
              ]),
              duration: 500,
            })
          }}
        >
          파링이 누르기
        </Button>
        <Text fontSize={"sm"}>
          지금까지 파링이를 {count}번 눌렀습니다{"!".repeat(count / 100) || "."}
        </Text>
      </Center>
    </>
  )
}

export default ParingTemplate
