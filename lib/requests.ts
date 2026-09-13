import { api } from "@/lib/api"
import type { Paginated, ServiceRequest } from "@/lib/types"

export async function createRequest(formData: FormData) {
  const { data } = await api.post<ServiceRequest>("/requests/requests/", formData)
  return data
}

export async function listMyRequests() {
  const { data } = await api.get<Paginated<ServiceRequest>>("/requests/requests/")
  return data.results
}

export async function getRequest(id: string) {
  const { data } = await api.get<ServiceRequest>(`/requests/requests/${id}/`)
  return data
}
