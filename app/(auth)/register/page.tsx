"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Wrench, Car } from "lucide-react"
import { isAxiosError } from "axios"

import { AuthCard } from "@/components/auth/AuthCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { register } from "@/lib/auth"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/types"

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("owner")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register({ username, email, phone_number: phoneNumber, password, role })
      router.push("/dashboard")
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        const firstError = Object.values(err.response.data).flat()[0]
        setError(typeof firstError === "string" ? firstError : "Could not create account.")
      } else {
        setError("Could not create account.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Join FAMECH as a car owner or a mechanic">
      <Tabs value={role} onValueChange={(v) => setRole(v as Role)} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="owner" className="gap-1.5">
            <Car className="h-4 w-4" />
            Car owner
          </TabsTrigger>
          <TabsTrigger value="mechanic" className="gap-1.5">
            <Wrench className="h-4 w-4" />
            Mechanic
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone number</Label>
          <Input
            id="phone_number"
            type="tel"
            placeholder="0241234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        {error && <p className={cn("text-sm text-destructive")}>{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
