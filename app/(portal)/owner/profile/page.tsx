"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logout, me, updateMe } from "@/lib/auth"
import type { User } from "@/lib/types"

export default function OwnerProfilePage() {
  const router = useRouter()
  const [account, setAccount] = useState<User | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    me().then((user) => {
      setAccount(user)
      setPhoneNumber(user.phone_number)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateMe({ phone_number: phoneNumber })
      setAccount(updated)
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    logout()
    router.push("/login")
  }

  if (!account) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

      <div className="rounded-2xl border bg-card p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
            {account.username[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-base font-bold">{account.username}</p>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <Button type="submit" variant="secondary" size="sm" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </Button>
        </form>
      </div>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  )
}
