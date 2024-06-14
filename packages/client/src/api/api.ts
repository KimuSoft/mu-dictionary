import axios from "axios"

const api = axios.create({ baseURL: "/api" })

api.interceptors.request.use((config) => {
  // @ts-expect-error typing issue
  config.headers ??= {}

  // if (localStorage.accessToken) {
  //   config.headers.Authorization = `Bearer ${localStorage.accessToken}`
  // }

  return config
})

export { api }
