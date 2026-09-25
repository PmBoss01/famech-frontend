"use client"

import { useState } from "react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/mechanics"

export function AvailabilityToggle({
  isAvailable,
  onChange,
}: {
  isAvailable: boolean
  onChange: (isAvailable: boolean) => void
}) {
  const [saving, setSaving] = useState(false)

  async function handleToggle(checked: boolean) {
    onChange(checked)
    setSaving(true)
    try {
      await updateProfile({ is_available: checked })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="flex items-center justify-between rounded-2xl border p-4"
      style={
        isAvailable
          ? { background: "#1F4D3B", borderColor: "#1F4D3B" }
          : undefined
      }
    >
      <div>
        <Label
          htmlFor="availability"
          className="text-[14.5px] font-bold"
          style={isAvailable ? { color: "#FAF8F4" } : undefined}
        >
          {isAvailable ? "Available for jobs" : "Not accepting jobs"}
        </Label>
        <p className="text-xs" style={isAvailable ? { color: "#B7CFC4" } : undefined}>
          {isAvailable ? "You'll be matched with nearby requests." : "You won't receive new requests."}
        </p>
      </div>
      <Switch
        id="availability"
        checked={isAvailable}
        onCheckedChange={handleToggle}
        disabled={saving}
        className={isAvailable ? "data-checked:bg-[#3E7A61]" : undefined}
      />
    </div>
  )
}
