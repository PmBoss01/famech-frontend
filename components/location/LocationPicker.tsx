"use client"

import { useState } from "react"
import { LocateFixed, Loader2, MapPin } from "lucide-react"

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
      <Button type="button" variant="outline" className="w-full" onClick={useCurrentLocation} disabled={locating}>
        {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        Use my current location
      </Button>
      {value.latitude && value.longitude && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {value.latitude}, {value.longitude}
        </p>
      )}
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
