export type Role = "owner" | "mechanic"

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: Role
  phone_number: string
  rating_avg: string | null
  rating_count: number
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
  id_document: string | null
}

export type RequestStatus = "pending" | "accepted" | "completed" | "cancelled"
export type JobStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled"

export interface JobOfferSummary {
  id: string
  mechanic_name: string
  mechanic_verified: boolean
  mechanic_rating_avg: string | null
  mechanic_rating_count: number
  status: JobStatus
  price: string | null
  rated_by_me: boolean
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
  rated_by_me: boolean
  created_at: string
}

export interface Rating {
  id: string
  score: number
  comment: string
  created_at: string
}

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
