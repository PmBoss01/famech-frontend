import { BadgeCheck } from "lucide-react"

export function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ background: "#E4EDE7", color: "#1F4D3B" }}
    >
      <BadgeCheck className="h-3 w-3" />
      Verified
    </span>
  )
}
