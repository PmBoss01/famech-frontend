import Link from "next/link"
import { MapPin, Image as ImageIcon, Mic } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { statusBadgeClass } from "@/lib/status"
import type { ServiceRequest } from "@/lib/types"

export function RequestCard({ request }: { request: ServiceRequest }) {
  const acceptedJob = request.jobs.find((job) => job.status === "accepted" || job.status === "completed")

  return (
    <Link
      href={`/owner/requests/${request.id}`}
      className="block rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 text-sm font-semibold">{request.description}</p>
        <Badge className={statusBadgeClass(request.status)}>{request.status}</Badge>
      </div>
      <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
        {acceptedJob ? (
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {acceptedJob.mechanic_name[0]?.toUpperCase()}
            </span>
            {acceptedJob.mechanic_name}
          </span>
        ) : (
          request.location_landmark && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {request.location_landmark}
            </span>
          )
        )}
        {request.photo && (
          <span
            title="Photo attached"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-secondary text-secondary-foreground"
          >
            <ImageIcon className="h-3 w-3" />
          </span>
        )}
        {request.audio && (
          <span
            title="Voice note attached"
            className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-secondary text-secondary-foreground"
          >
            <Mic className="h-3 w-3" />
          </span>
        )}
        <span className="ml-auto">
          {request.jobs.length} offer{request.jobs.length === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  )
}
