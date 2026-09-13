export type Role = "owner" | "mechanic"

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: Role
  phone_number: string
}

export interface MechanicProfile {
  id: string
  business_name: string
  bio: string
  specialties: string[]
  years_experience: number | null
  latitude: string
  longitude: string
  location_landmark: string
  service_radius_km: number
  is_available: boolean
  is_verified: boolean
}

export type RequestStatus = "pending" | "accepted" | "completed" | "cancelled"
export type JobStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled"

export interface JobOfferSummary {
  id: string
  mechanic_name: string
  status: JobStatus
  price: string | null
}

export interface ServiceRequest {
  id: string
  owner: string
  description: string
  latitude: string
  longitude: string
  location_landmark: string
  photo: string | null
  audio: string | null
  vehicle_make: string
  vehicle_model: string
  vehicle_year: number | null
  status: RequestStatus
  jobs: JobOfferSummary[]
  created_at: string
}

export interface RequestSummary {
  id: string
  description: string
  latitude: string
  longitude: string
  location_landmark: string
  photo: string | null
  audio: string | null
  vehicle_make: string
  vehicle_model: string
  vehicle_year: number | null
}

export interface Job {
  id: string
  request: RequestSummary
  mechanic: User
  status: JobStatus
  price: string | null
  responded_at: string | null
  completed_at: string | null
  created_at: string
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
