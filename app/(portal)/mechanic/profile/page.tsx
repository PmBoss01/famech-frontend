"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAxiosError } from "axios"
import { FileText, LogOut, Loader2 } from "lucide-react"

import { Stars } from "@/components/ratings/Stars"
import { VerifiedBadge } from "@/components/mechanics/VerifiedBadge"
import { LocationPicker, type LocationValue } from "@/components/location/LocationPicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProfile, getMyProfile, updateProfile, uploadIdDocument } from "@/lib/mechanics"
import { logout, me, updateMe } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function MechanicProfilePage() {
  const router = useRouter()
  const [exists, setExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [account, setAccount] = useState<User | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [savingAccount, setSavingAccount] = useState(false)

  const [businessName, setBusinessName] = useState("")
  const [bio, setBio] = useState("")
  const [radius, setRadius] = useState("10")
  const [location, setLocation] = useState<LocationValue>({ latitude: "", longitude: "", landmark: "" })
  const [isVerified, setIsVerified] = useState(false)
  const [idDocumentUrl, setIdDocumentUrl] = useState<string | null>(null)
  const [uploadingDocument, setUploadingDocument] = useState(false)

  useEffect(() => {
    me().then((user) => {
      setAccount(user)
      setPhoneNumber(user.phone_number)
    })
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
        setIsVerified(profile.is_verified)
        setIdDocumentUrl(profile.id_document)
      })
      .catch((err) => {
        if (!(isAxiosError(err) && err.response?.status === 404)) throw err
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault()
    setSavingAccount(true)
    try {
      const updated = await updateMe({ phone_number: phoneNumber })
      setAccount(updated)
    } finally {
      setSavingAccount(false)
    }
  }

  async function handleDocumentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setUploadingDocument(true)
    try {
      const updated = await uploadIdDocument(file)
      setIdDocumentUrl(updated.id_document)
    } finally {
      setUploadingDocument(false)
    }
  }

  function handleLogout() {
    logout()
    router.push("/login")
  }

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
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      {/* Account */}
      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
            {account?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">{account?.username}</p>
            <p className="text-xs text-muted-foreground">{account?.email}</p>
          </div>
          <Stars value={account?.rating_avg ? Number(account.rating_avg) : null} count={account?.rating_count} />
        </div>
        <form onSubmit={handleSaveAccount} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="account_phone">Phone number</Label>
            <Input id="account_phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="secondary" size="sm" disabled={savingAccount}>
              {savingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="ml-auto">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </form>
      </div>

      {/* Business profile */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {exists ? "Business profile" : "Set up your business profile"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This is what car owners see when you&apos;re matched to their request.
            </p>
          </div>
          {exists &&
            (isVerified ? (
              <VerifiedBadge />
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
                Pending verification
              </span>
            ))}
        </div>

        {exists && !isVerified && (
          <div className="space-y-2 rounded-2xl border border-dashed p-4">
            <Label htmlFor="id_document">ID or certification (optional, speeds up verification)</Label>
            <label
              htmlFor="id_document"
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-semibold text-muted-foreground hover:border-primary/50"
            >
              {uploadingDocument ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {idDocumentUrl ? "Document uploaded — replace" : "Upload a document"}
            </label>
            <input
              id="id_document"
              type="file"
              accept="image/*,.pdf"
              className="sr-only"
              disabled={uploadingDocument}
              onChange={handleDocumentChange}
            />
          </div>
        )}

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
    </div>
  )
}
