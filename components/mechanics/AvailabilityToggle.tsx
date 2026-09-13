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
    <div className="flex items-center justify-between rounded-xl border bg-card p-4">
      <div>
        <Label htmlFor="availability" className="text-sm font-medium">
          {isAvailable ? "Available for jobs" : "Not accepting jobs"}
        </Label>
        <p className="text-xs text-muted-foreground">
          {isAvailable ? "You'll be matched with nearby requests." : "You won't receive new requests."}
        </p>
      </div>
      <Switch id="availability" checked={isAvailable} onCheckedChange={handleToggle} disabled={saving} />
    </div>
  )
}
