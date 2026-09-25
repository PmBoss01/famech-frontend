import { api } from "@/lib/api"
import type { MechanicProfile } from "@/lib/types"

export async function getMyProfile() {
  const { data } = await api.get<MechanicProfile>("/mechanics/profile/")
  return data
}

export async function createProfile(payload: Partial<MechanicProfile>) {
  const { data } = await api.post<MechanicProfile>("/mechanics/profile/", payload)
  return data
}

export async function updateProfile(payload: Partial<MechanicProfile>) {
  const { data } = await api.patch<MechanicProfile>("/mechanics/profile/", payload)
  return data
}

export async function uploadIdDocument(file: File) {
  const formData = new FormData()
  formData.append("id_document", file)
  const { data } = await api.patch<MechanicProfile>("/mechanics/profile/", formData)
  return data
}
