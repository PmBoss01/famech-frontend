"use client"

import { useState } from "react"
import { LocateFixed, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface LocationValue {
  latitude: string
  longitude: string
  landmark: string
}

export function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue
  onChange: (value: LocationValue) => void
}) {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasCoordinates = Boolean(value.latitude && value.longitude)

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available on this device.")
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          ...value,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        })
        setLocating(false)
      },
      () => {
        setError("Couldn't get your location. Enter it manually or a nearby landmark below.")
        setLocating(false)
      }
    )
  }

  return (
    <div className="space-y-3">
      <Label>Location</Label>

      {hasCoordinates && (
        <div
          className="relative h-[110px] overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "var(--secondary)",
            backgroundImage:
              "repeating-linear-gradient(0deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 24px)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="var(--primary)"
            stroke="var(--background)"
            strokeWidth="1.5"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          </svg>
          <div className="absolute bottom-2.5 right-2.5 rounded-lg border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {value.latitude}, {value.longitude}
          </div>
        </div>
      )}

      <Button type="button" variant="outline" className="w-full" onClick={useCurrentLocation} disabled={locating}>
        {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        Use my current location
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Latitude"
          inputMode="decimal"
          value={value.latitude}
          onChange={(e) => onChange({ ...value, latitude: e.target.value })}
        />
        <Input
          placeholder="Longitude"
          inputMode="decimal"
          value={value.longitude}
          onChange={(e) => onChange({ ...value, longitude: e.target.value })}
        />
      </div>
      <Input
        placeholder="Nearby landmark (e.g. near Shell station, East Legon)"
        value={value.landmark}
        onChange={(e) => onChange({ ...value, landmark: e.target.value })}
      />
    </div>
  )
}
