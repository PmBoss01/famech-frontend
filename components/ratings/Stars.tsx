"use client"

import { useState } from "react"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

export function Stars({
  value,
  count,
  size = "sm",
}: {
  value: number | null
  count?: number
  size?: "sm" | "md"
}) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"
  const rounded = value !== null ? Math.round(value) : 0

  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={cn(starSize, n <= rounded ? "fill-primary text-primary" : "text-border")}
          />
        ))}
      </span>
      {value !== null ? (
        <span className="text-xs font-semibold text-muted-foreground">
          {value.toFixed(1)}
          {count !== undefined && <span className="font-normal"> ({count})</span>}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground">No ratings yet</span>
      )}
    </span>
  )
}

export function StarInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState<number | null>(null)
  const shown = hover ?? value

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className="p-0.5"
        >
          <Star className={cn("h-7 w-7", n <= shown ? "fill-primary text-primary" : "text-border")} />
        </button>
      ))}
    </div>
  )
}
