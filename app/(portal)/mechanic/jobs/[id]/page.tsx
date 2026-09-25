"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Check, Loader2, MapPin, X } from "lucide-react"

import { RatePrompt } from "@/components/ratings/RatePrompt"
import { TopBar } from "@/components/portal/TopBar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { acceptJob, completeJob, declineJob, getJob, rateJob } from "@/lib/jobs"
import { statusBadgeClass } from "@/lib/status"
import type { Job } from "@/lib/types"

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [acting, setActing] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div className="space-y-6">
        <TopBar title="Job" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">
            This job isn&apos;t available on the current account — it may belong to a different
            account signed in earlier.
          </p>
          <Button size="sm" nativeButton={false} render={<Link href="/mechanic/dashboard" />}>
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  async function handle(action: "accept" | "decline" | "complete") {
    if (!job) return
    setActing(true)
    try {
      const updated =
        action === "accept" ? await acceptJob(job.id) : action === "decline" ? await declineJob(job.id) : await completeJob(job.id)
      setJob(updated)
      if (action === "decline") router.push("/mechanic/dashboard")
    } finally {
      setActing(false)
    }
  }

  if (!job) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const { request } = job

  return (
    <div className="space-y-6">
      <TopBar title="Job" />

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-bold tracking-tight">{request.description}</h1>
        <Badge className={statusBadgeClass(job.status)}>{job.status}</Badge>
      </div>

      {request.location_landmark && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {request.location_landmark} ({request.latitude}, {request.longitude})
        </p>
      )}

      {(request.vehicle_make || request.vehicle_model) && (
        <p className="text-sm text-muted-foreground">
          Vehicle: {[request.vehicle_year, request.vehicle_make, request.vehicle_model].filter(Boolean).join(" ")}
        </p>
      )}

      {request.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={request.photo} alt="Fault photo" className="w-full rounded-xl border object-cover" />
      )}
      {request.audio && <audio controls src={request.audio} className="w-full" />}

      {job.status === "pending" && (
        <div className="flex gap-2">
          <Button className="flex-1" disabled={acting} onClick={() => handle("accept")}>
            {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Accept
          </Button>
          <Button variant="outline" className="flex-1" disabled={acting} onClick={() => handle("decline")}>
            {acting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            Decline
          </Button>
        </div>
      )}

      {job.status === "accepted" && (
        <Button className="w-full" disabled={acting} onClick={() => handle("complete")}>
          {acting && <Loader2 className="h-4 w-4 animate-spin" />}
          Mark job complete
        </Button>
      )}

      {job.status === "completed" && !job.rated_by_me && (
        <RatePrompt
          title="Rate the car owner"
          onSubmit={async (score, comment) => {
            await rateJob(job.id, { score, comment })
            setJob({ ...job, rated_by_me: true })
          }}
        />
      )}
    </div>
  )
}
