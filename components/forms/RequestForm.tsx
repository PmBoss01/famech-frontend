"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { isAxiosError } from "axios"
import { Loader2, Plus } from "lucide-react"

import { AudioRecorder } from "@/components/audio/AudioRecorder"
import { LocationPicker, type LocationValue } from "@/components/location/LocationPicker"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { compressImage } from "@/lib/image"
import { createRequest } from "@/lib/requests"

export function RequestForm() {
  const router = useRouter()
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState<LocationValue>({ latitude: "", longitude: "", landmark: "" })
  const [photo, setPhoto] = useState<File | null>(null)
  const [compressingPhoto, setCompressingPhoto] = useState(false)
  const [audio, setAudio] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const photoUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }, [photoUrl])

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setError(null)
    setCompressingPhoto(true)
    try {
      // Phone cameras routinely produce photos well over the backend's 5MB
      // cap, and patchy roadside data makes a large upload slow anyway — so
      // compress before it ever leaves the device rather than surface a
      // server-side size error after the fact.
      setPhoto(await compressImage(file))
    } catch {
      setError("Couldn't process that photo. Try a different one.")
    } finally {
      setCompressingPhoto(false)
    }
  }

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
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        const firstError = Object.values(err.response.data).flat()[0]
        setError(typeof firstError === "string" ? firstError : "Couldn't submit your request. Please try again.")
      } else {
        setError("Couldn't submit your request. Please try again.")
      }
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
        <div className="flex gap-2.5">
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Selected fault photo" className="h-[68px] w-[68px] rounded-xl border object-cover" />
          )}
          <label
            htmlFor="photo"
            className="flex h-[68px] w-[68px] cursor-pointer items-center justify-center rounded-xl border border-dashed text-muted-foreground hover:border-primary/50"
          >
            {compressingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
          </label>
        </div>
        <input
          id="photo"
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={compressingPhoto}
          onChange={handlePhotoChange}
        />
      </div>

      <AudioRecorder onChange={setAudio} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={submitting || compressingPhoto}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Find a mechanic
      </Button>
    </form>
  )
}
