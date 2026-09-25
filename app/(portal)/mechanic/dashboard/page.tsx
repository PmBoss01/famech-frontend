"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { isAxiosError } from "axios"
import { Loader2, ShieldAlert, Wrench } from "lucide-react"

import { JobCard } from "@/components/cards/JobCard"
import { AvailabilityToggle } from "@/components/mechanics/AvailabilityToggle"
import { Button } from "@/components/ui/button"
import { me } from "@/lib/auth"
import { getMyProfile } from "@/lib/mechanics"
import { listMyJobs } from "@/lib/jobs"
import type { Job, MechanicProfile, User } from "@/lib/types"

export default function MechanicDashboardPage() {
  const [profile, setProfile] = useState<MechanicProfile | null | undefined>(undefined)
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [account, setAccount] = useState<User | null>(null)

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
    me().then(setAccount)
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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
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
        <div>
          <p className="text-[13px] text-muted-foreground">Hello</p>
          <h1 className="text-xl font-bold tracking-tight">{account?.username ?? " "}</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
          {account?.username?.[0]?.toUpperCase()}
        </div>
      </div>

      {!profile.is_verified && (
        <div
          className="flex items-start gap-3 rounded-2xl border p-4"
          style={{ background: "#F3E4C8", borderColor: "#E0C68A" }}
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#8B5E22" }} />
          <div>
            <p className="text-[13.5px] font-bold" style={{ color: "#8B5E22" }}>
              Pending verification
            </p>
            <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "#8B5E22" }}>
              You won&apos;t be matched with requests until your account is verified. Upload an ID or
              certification on your{" "}
              <Link href="/mechanic/profile" className="underline">
                profile
              </Link>{" "}
              to speed this up.
            </p>
          </div>
        </div>
      )}

      <AvailabilityToggle
        isAvailable={profile.is_available}
        onChange={(isAvailable) => setProfile({ ...profile, is_available: isAvailable })}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold">Incoming requests</h2>
          {jobs && jobs.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {jobs.length}
            </span>
          )}
        </div>

        {jobs === null && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {jobs?.length === 0 && (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No pending requests right now.
          </p>
        )}

        {jobs?.map((job) => (
          <JobCard key={job.id} job={job} onUpdate={loadJobs} />
        ))}
      </div>
    </div>
  )
}
