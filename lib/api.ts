import axios from "axios"

export const BE_URL =
  process.env.NEXT_PUBLIC_BE_URL || "http://localhost:8000/api/v1"

export const api = axios.create({
  baseURL: BE_URL,
})

api.interceptors.request.use((config) => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})
