import Link from "next/link"
import { MapPin, Image as ImageIcon, Mic } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { statusBadgeClass } from "@/lib/status"
import type { ServiceRequest } from "@/lib/types"

export function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <Link
      href={`/owner/requests/${request.id}`}
      className="block rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 text-sm font-medium">{request.description}</p>
        <Badge className={statusBadgeClass(request.status)}>{request.status}</Badge>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        {request.location_landmark && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {request.location_landmark}
          </span>
        )}
        {request.photo && (
          <span className="flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
          </span>
        )}
        {request.audio && (
          <span className="flex items-center gap-1">
            <Mic className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="ml-auto">{request.jobs.length} offer{request.jobs.length === 1 ? "" : "s"}</span>
      </div>
    </Link>
  )
}
