"use client"

import { useCallback, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { JobCard } from "@/components/cards/JobCard"
import { listMyJobs } from "@/lib/jobs"
import type { Job } from "@/lib/types"

const HISTORY_STATUSES = ["accepted", "completed", "declined", "cancelled"] as const

export default function MechanicHistoryPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null)

  const load = useCallback(() => {
    Promise.all(HISTORY_STATUSES.map((status) => listMyJobs(status))).then((lists) => {
      const merged = lists.flat().sort((a, b) => b.created_at.localeCompare(a.created_at))
      setJobs(merged)
    })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">History</h1>

      {jobs === null && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {jobs?.length === 0 && (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No past jobs yet.
        </p>
      )}

      <div className="space-y-3">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} onUpdate={load} />
        ))}
      </div>
    </div>
  )
}
