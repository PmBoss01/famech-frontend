"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Loader2 } from "lucide-react"

import { AudioRecorder } from "@/components/audio/AudioRecorder"
import { LocationPicker, type LocationValue } from "@/components/location/LocationPicker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createRequest } from "@/lib/requests"

export function RequestForm() {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState<LocationValue>({ latitude: "", longitude: "", landmark: "" })
  const [photo, setPhoto] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!location.latitude || !location.longitude) {
      setError("Set your location so nearby mechanics can be matched.")
      return
    }

    const formData = new FormData()
    formData.append("description", description)
    formData.append("latitude", location.latitude)
    formData.append("longitude", location.longitude)
    formData.append("location_landmark", location.landmark)
    if (photo) formData.append("photo", photo)
    if (audio) formData.append("audio", audio)

    setSubmitting(true)
    try {
      const request = await createRequest(formData)
      router.push(`/owner/requests/${request.id}`)
    } catch {
      setError("Couldn't submit your request. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">What&apos;s wrong with the car?</Label>
        <Textarea
          id="description"
          placeholder="e.g. Car won't start, clicking noise when I turn the key"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
      </div>

      <LocationPicker value={location} onChange={setLocation} />

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optional)</Label>
        <label
          htmlFor="photo"
          className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground hover:border-primary/50"
        >
          <ImagePlus className="h-4 w-4" />
          {photo ? photo.name : "Add a photo of the issue"}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />
      </div>

      <AudioRecorder onChange={setAudio} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Find a mechanic
      </Button>
    </form>
  )
}
