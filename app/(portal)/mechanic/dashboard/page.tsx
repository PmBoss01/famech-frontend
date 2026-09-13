"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { isAxiosError } from "axios"
import { Loader2, Settings, Wrench } from "lucide-react"

import { JobCard } from "@/components/cards/JobCard"
import { AvailabilityToggle } from "@/components/mechanics/AvailabilityToggle"
import { Button } from "@/components/ui/button"
import { getMyProfile } from "@/lib/mechanics"
import { listMyJobs } from "@/lib/jobs"
import type { Job, MechanicProfile } from "@/lib/types"

export default function MechanicDashboardPage() {
  const [profile, setProfile] = useState<MechanicProfile | null | undefined>(undefined)
  const [jobs, setJobs] = useState<Job[] | null>(null)

  const loadJobs = useCallback(() => {
    listMyJobs("pending").then(setJobs)
  }, [])

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 404) setProfile(null)
      })
    loadJobs()
  }, [loadJobs])

  if (profile === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (profile === null) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <Wrench className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Set up your mechanic profile so nearby car owners can find you.
        </p>
        <Button nativeButton={false} render={<Link href="/mechanic/profile" />} size="sm">
          Set up profile
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Incoming requests</h1>
        <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/mechanic/profile" aria-label="Edit profile" />}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <AvailabilityToggle
        isAvailable={profile.is_available}
        onChange={(isAvailable) => setProfile({ ...profile, is_available: isAvailable })}
      />

      {jobs === null && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {jobs?.length === 0 && (
        <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No pending requests right now.
        </p>
      )}

      <div className="space-y-3">
        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} onUpdate={loadJobs} />
        ))}
      </div>
    </div>
  )
}
