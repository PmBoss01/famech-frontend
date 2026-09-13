import { api } from "@/lib/api"
import type { Role, User } from "@/lib/types"

export interface RegisterPayload {
  username: string
  email: string
  password: string
  role: Role
  phone_number: string
  first_name?: string
  last_name?: string
}

export async function login(username: string, password: string) {
  const { data } = await api.post<{ access: string; refresh: string }>("/auth/token/", {
    username,
    password,
  })
  localStorage.setItem("access_token", data.access)
  localStorage.setItem("refresh_token", data.refresh)
  const user = await me()
  localStorage.setItem("role", user.role)
  return user
}

export async function register(payload: RegisterPayload) {
  await api.post("/users/register/", payload)
  return login(payload.username, payload.password)
}

export async function me() {
  const { data } = await api.get<User>("/users/me/")
  return data
}

export function logout() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("role")
}

export function getStoredRole(): Role | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("role") as Role | null
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(localStorage.getItem("access_token"))
}
