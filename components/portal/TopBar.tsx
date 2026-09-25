"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export function TopBar({ title }: { title: string }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3.5 px-1 pb-2">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-[10px] border bg-card"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-lg font-bold tracking-tight">{title}</span>
    </div>
  )
}
