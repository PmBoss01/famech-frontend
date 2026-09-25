"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Image as ImageIcon, Loader2, MapPin, Mic, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { acceptJob, declineJob } from "@/lib/jobs"
import { statusBadgeClass } from "@/lib/status"
import type { Job } from "@/lib/types"

export function JobCard({ job, onUpdate }: { job: Job; onUpdate: () => void }) {
  const [pending, setPending] = useState<"accept" | "decline" | null>(null)

  async function handle(action: "accept" | "decline") {
    setPending(action)
    try {
      if (action === "accept") await acceptJob(job.id)
      else await declineJob(job.id)
      onUpdate()
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/mechanic/jobs/${job.id}`} className="line-clamp-2 flex-1 text-sm font-semibold hover:underline">
          {job.request.description}
        </Link>
        <Badge className={statusBadgeClass(job.status)}>{job.status}</Badge>
      </div>
      <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
        {job.request.location_landmark && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.request.location_landmark}
          </span>
        )}
        {job.request.photo && (
          <span
            title="Photo attached"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-secondary text-secondary-foreground"
          >
            <ImageIcon className="h-3 w-3" />
          </span>
        )}
        {job.request.audio && (
          <span
            title="Voice note attached"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-secondary text-secondary-foreground"
          >
            <Mic className="h-3 w-3" />
          </span>
        )}
      </div>
      {job.status === "pending" && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" disabled={pending !== null} onClick={() => handle("accept")}>
            {pending === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            disabled={pending !== null}
            onClick={() => handle("decline")}
          >
            {pending === "decline" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            Decline
          </Button>
        </div>
      )}
    </div>
  )
}
