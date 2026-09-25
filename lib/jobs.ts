import { api } from "@/lib/api"
import type { Job, JobStatus, Paginated, PaymentInit, Rating } from "@/lib/types"

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

export async function rateJob(id: string, payload: { score: number; comment?: string }) {
  const { data } = await api.post<Rating>(`/requests/jobs/${id}/rate/`, payload)
  return data
}

export async function initiatePayment(id: string) {
  const { data } = await api.post<PaymentInit>(`/requests/jobs/${id}/initiate_payment/`)
  return data
}

export async function verifyPayment(id: string, reference: string) {
  const { data } = await api.post<Job>(`/requests/jobs/${id}/verify_payment/`, { reference })
  return data
}
