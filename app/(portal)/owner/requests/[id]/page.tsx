"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Loader2, MapPin, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getRequest } from "@/lib/requests"
import { statusBadgeClass } from "@/lib/status"
import type { ServiceRequest } from "@/lib/types"

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    const data = await getRequest(id)
    setRequest(data)
  }, [id])

  useEffect(() => {
    // Initial data fetch on mount — refresh() sets state asynchronously after
    // its await, not synchronously within this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh()
  }, [refresh])

  useEffect(() => {
    if (request?.status !== "pending") return
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [request?.status, refresh])

  async function handleRefresh() {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  if (!request) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{request.description}</h1>
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
        <img src={request.photo} alt="Fault photo" className="w-full rounded-xl border object-cover" />
      )}
      {request.audio && <audio controls src={request.audio} className="w-full" />}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            {request.jobs.length === 0 ? "Looking for mechanics nearby…" : "Offers"}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={refreshing ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Refresh
          </Button>
        </div>

        {request.jobs.length === 0 && request.status === "pending" && (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            No mechanics are nearby yet. We&apos;ll notify you as soon as one is matched.
          </p>
        )}

        {request.jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-xl border bg-card p-4">
            <span className="text-sm font-medium">{job.mechanic_name}</span>
            <Badge className={statusBadgeClass(job.status)}>{job.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
