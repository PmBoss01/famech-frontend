"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Wrench } from "lucide-react"

import { RequestCard } from "@/components/cards/RequestCard"
import { me } from "@/lib/auth"
import { listMyRequests } from "@/lib/requests"
import type { ServiceRequest, User } from "@/lib/types"

export default function OwnerDashboardPage() {
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null)
  const [account, setAccount] = useState<User | null>(null)

  useEffect(() => {
    listMyRequests().then(setRequests)
    me().then(setAccount)
  }, [])

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

      <Link
        href="/owner/requests/new"
        className="relative block overflow-hidden rounded-[18px] p-5"
        style={{ background: "#1C1917" }}
      >
        <div
          className="absolute -right-8 -top-8 h-32 w-32 rounded-full"
          style={{ background: "rgba(192,136,41,0.18)" }}
        />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px]" style={{ background: "#C08829" }}>
            <Wrench className="h-4 w-4" style={{ color: "#1C1917" }} />
          </span>
          <span className="text-[15.5px] font-bold text-white">Broken down?</span>
        </div>
        <p className="relative z-10 mt-3.5 text-[13.5px] leading-relaxed" style={{ color: "#D6D3D1" }}>
          Get a nearby verified mechanic to come fix it, on the spot.
        </p>
        <div
          className="relative z-10 mt-3.5 rounded-xl py-3 text-center text-sm font-bold"
          style={{ background: "#C08829", color: "#1C1917" }}
        >
          Request a mechanic
        </div>
      </Link>

      <div className="space-y-3">
        <h2 className="text-[15px] font-bold">Your requests</h2>

        {requests === null && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {requests?.length === 0 && (
          <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No requests yet — broken down? Tell us what&apos;s wrong above and we&apos;ll find a mechanic nearby.
          </p>
        )}

        {requests?.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  )
}
