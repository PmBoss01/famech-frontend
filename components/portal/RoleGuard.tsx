"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { getStoredRole, isAuthenticated } from "@/lib/auth"
import type { Role } from "@/lib/types"

export function RoleGuard({
  requiredRole,
  children,
}: {
  requiredRole: Role
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login")
      return
    }
    const role = getStoredRole()
    if (role !== requiredRole) {
      router.replace(role === "mechanic" ? "/mechanic/dashboard" : "/owner/dashboard")
      return
    }
    // localStorage is only readable client-side, so this check can't run during
    // server render — gating on a post-mount effect avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
  }, [requiredRole, router])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
