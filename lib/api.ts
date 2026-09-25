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

// A 401 (invalid/expired token) or 403 (wrong role/not your resource — the
// only way this API ever returns 403) almost always means the session in
// localStorage no longer matches what this tab expects: localStorage is
// shared across every tab of the same origin, so signing into a different
// account in one tab silently switches the token every other open tab uses
// on its next request. Recover by clearing the stale session and sending
// the user back to log in, rather than leaving pages stuck on a raw error.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (typeof window !== "undefined" && (status === 401 || status === 403)) {
      const onAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register"
      if (!onAuthPage) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("role")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
