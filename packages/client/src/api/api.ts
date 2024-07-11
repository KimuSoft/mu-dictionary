import axios from "axios"
import { isServer } from "@tanstack/react-query"
import "dotenv/config"

const api = axios.create({
  baseURL: isServer
    ? process.env["MUDICT_API_ENDPOINT"]
    : process.env["NEXT_PUBLIC_MUDICT_API_ENDPOINT"],
})

api.interceptors.request.use((config) => {
  // @ts-expect-error typing issue
  config.headers ??= {}

  // if (localStorage.accessToken) {
  //   config.headers.Authorization = `Bearer ${localStorage.accessToken}`
  // }

  return config
})

export { api }
