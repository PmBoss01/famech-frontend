import { api } from "@/lib/api"
import type { Job, JobStatus, Paginated } from "@/lib/types"

export async function listMyJobs(status?: JobStatus) {
  const { data } = await api.get<Paginated<Job>>("/requests/jobs/", {
    params: status ? { status } : undefined,
  })
  return data.results
}

export async function getJob(id: string) {
  const { data } = await api.get<Job>(`/requests/jobs/${id}/`)
  return data
}

export async function acceptJob(id: string) {
  const { data } = await api.post<Job>(`/requests/jobs/${id}/accept/`)
  return data
}

export async function declineJob(id: string) {
  const { data } = await api.post<Job>(`/requests/jobs/${id}/decline/`)
  return data
}

export async function completeJob(id: string) {
  const { data } = await api.post<Job>(`/requests/jobs/${id}/complete/`)
  return data
}
