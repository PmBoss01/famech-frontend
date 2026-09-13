"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAxiosError } from "axios"
import { Loader2 } from "lucide-react"

import { LocationPicker, type LocationValue } from "@/components/location/LocationPicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProfile, getMyProfile, updateProfile } from "@/lib/mechanics"

export default function MechanicProfilePage() {
  const router = useRouter()
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [businessName, setBusinessName] = useState("")
  const [bio, setBio] = useState("")
  const [radius, setRadius] = useState("10")
  const [location, setLocation] = useState<LocationValue>({ latitude: "", longitude: "", landmark: "" })

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        setExists(true)
        setBusinessName(profile.business_name)
        setBio(profile.bio)
        setRadius(String(profile.service_radius_km))
        setLocation({
          latitude: profile.latitude,
          longitude: profile.longitude,
          landmark: profile.location_landmark,
        })
      })
      .catch((err) => {
        if (!(isAxiosError(err) && err.response?.status === 404)) throw err
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!location.latitude || !location.longitude) {
      setError("Set your base location so owners can be matched to you.")
      return
    }

    const payload = {
      business_name: businessName,
      bio,
      service_radius_km: Number(radius),
      latitude: location.latitude,
      longitude: location.longitude,
      location_landmark: location.landmark,
    }

    setSaving(true)
    try {
      if (exists) await updateProfile(payload)
      else await createProfile(payload)
      router.push("/mechanic/dashboard")
    } catch {
      setError("Couldn't save your profile. Please try again.")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {exists ? "Edit your profile" : "Set up your profile"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This is what car owners see when you&apos;re matched to their request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="business_name">Business / shop name</Label>
          <Input id="business_name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About you</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Years of experience, specialties, etc."
            rows={3}
          />
        </div>

        <LocationPicker value={location} onChange={setLocation} />

        <div className="space-y-2">
          <Label htmlFor="radius">Service radius (km)</Label>
          <Input
            id="radius"
            type="number"
            min={1}
            max={100}
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {exists ? "Save changes" : "Create profile"}
        </Button>
      </form>
    </div>
  )
}
