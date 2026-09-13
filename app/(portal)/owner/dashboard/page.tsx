"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Plus, Wrench } from "lucide-react"

import { RequestCard } from "@/components/cards/RequestCard"
import { Button } from "@/components/ui/button"
import { listMyRequests } from "@/lib/requests"
import type { ServiceRequest } from "@/lib/types"

export default function OwnerDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null)

  useEffect(() => {
    listMyRequests().then(setRequests)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your requests</h1>
        <Button nativeButton={false} render={<Link href="/owner/requests/new" />}>
          <Plus className="h-4 w-4" />
          New request
        </Button>
      </div>

      {requests === null && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {requests?.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Wrench className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No requests yet. Broken down? Tell us what&apos;s wrong and we&apos;ll find a mechanic nearby.
          </p>
          <Button nativeButton={false} render={<Link href="/owner/requests/new" />} size="sm">
            <Plus className="h-4 w-4" />
            New request
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {requests?.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  )
}
