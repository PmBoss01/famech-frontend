"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { getStoredRole, isAuthenticated } from "@/lib/auth"

export default function DashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login")
      return
    }
    const role = getStoredRole()
    router.replace(role === "mechanic" ? "/mechanic/dashboard" : "/owner/dashboard")
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}
