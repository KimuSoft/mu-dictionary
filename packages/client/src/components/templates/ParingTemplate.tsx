"use client"

import React from "react"
import { Button, Center, useToast } from "@chakra-ui/react"
import { sample } from "lodash"
import Header from "@/components/organisms/Header"

const ParingTemplate: React.FC = () => {
  const toast = useToast()

  return (
    <>
      <Header showLogo />
      <Center w={"100%"} h={"100vh"}>
        <Button
          colorScheme={"blue"}
          onClick={() => {
            toast({
              title: sample(["에", "에?", "헤에...", "모루", "으에"])!,
              status: sample(["success", "info", "warning", "error"])!,
              position: "top-right",
            })
          }}
        >
          파링이 누르기
        </Button>
      </Center>
    </>
  )
}

export default ParingTemplate
