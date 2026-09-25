"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Loader2, MapPin, RefreshCw } from "lucide-react"

import { RatePrompt } from "@/components/ratings/RatePrompt"
import { Stars } from "@/components/ratings/Stars"
import { VerifiedBadge } from "@/components/mechanics/VerifiedBadge"
import { TopBar } from "@/components/portal/TopBar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { rateJob } from "@/lib/jobs"
import { getRequest } from "@/lib/requests"
import { statusBadgeClass } from "@/lib/status"
import type { ServiceRequest } from "@/lib/types"

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await getRequest(id)
      setRequest(data)
    } catch {
      // Most likely cause: this browser is now signed in as a different
      // account than the one that owns this request (e.g. a second account
      // was created in the same tab) — stop polling a dead endpoint rather
      // than retry forever with no feedback.
      setNotFound(true)
    }
  }, [id])

  useEffect(() => {
    // Initial data fetch on mount — refresh() sets state asynchronously after
    // its await, not synchronously within this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  useEffect(() => {
    if (request?.status !== "pending" || notFound) return
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [request?.status, notFound, refresh])

  async function handleRefresh() {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <TopBar title="Request" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">
            This request isn&apos;t available on the current account — it may belong to a different
            account signed in earlier.
          </p>
          <Button size="sm" nativeButton={false} render={<Link href="/owner/dashboard" />}>
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const completedJob = request.jobs.find((job) => job.status === "completed")

  return (
    <div className="space-y-6">
      <TopBar title="Request" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{request.description}</h1>
          {request.location_landmark && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {request.location_landmark}
            </p>
          )}
        </div>
        <Badge className={statusBadgeClass(request.status)}>{request.status}</Badge>
      </div>

      {request.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={request.photo} alt="Fault photo" className="w-full rounded-2xl border object-cover" />
      )}
      {request.audio && <audio controls src={request.audio} className="w-full" />}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-muted-foreground">
            {request.jobs.length === 0 ? "Looking for mechanics nearby…" : "Offers"}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Refresh
          </Button>
        </div>

        {request.jobs.length === 0 && request.status === "pending" && (
          <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
            No mechanics are nearby yet. We&apos;ll notify you as soon as one is matched.
          </p>
        )}

        {request.jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-2xl border bg-card p-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                {job.mechanic_name}
                {job.mechanic_verified && <VerifiedBadge />}
              </span>
              <Stars value={job.mechanic_rating_avg ? Number(job.mechanic_rating_avg) : null} count={job.mechanic_rating_count} />
            </div>
            <Badge className={statusBadgeClass(job.status)}>{job.status}</Badge>
          </div>
        ))}
      </div>

      {completedJob && !completedJob.rated_by_me && (
        <RatePrompt
          title="Rate this mechanic"
          onSubmit={async (score, comment) => {
            await rateJob(completedJob.id, { score, comment })
            await refresh()
          }}
        />
      )}
    </div>
  )
}
