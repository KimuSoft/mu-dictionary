"use client"

import {
  ChakraProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@chakra-ui/react"
import React, { PropsWithChildren } from "react"
import theme from "@/theme/theme"
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { CacheProvider } from "@chakra-ui/next-js"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AppProgressBar } from "next-nprogress-bar"

const makeQueryClient = () => new QueryClient()

let browserQueryClient: QueryClient | null = null

const getQueryClient = () => {
  if (isServer) return makeQueryClient()
  else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const Providers: React.FC<PropsWithChildren<{ cookies: string }>> = ({
  children,
  cookies,
}) => {
  const queryClient = getQueryClient()

  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        colorModeManager={cookieStorageManagerSSR(cookies)}
        // colorModeManager={{
        //   type: "cookie",
        //   ssr: true,
        //   get: () => colorMode,
        //   set: (value) => {
        //     setCookie("chakra-ui-color-mode", value)
        //     console.log(`New color mode value: ${JSON.stringify(value)}`)
        //   },
        // }}
      >
        <AppProgressBar color={"#48BB78"} height={"3px"} />
        <ColorModeScript
          initialColorMode={theme.config.initialColorMode}
          type={"cookie"}
        />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}

export default Providers
