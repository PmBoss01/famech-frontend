"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { logout } from "@/lib/auth"
import type { Role } from "@/lib/types"

export function PortalHeader({ role, homeHref }: { role: Role; homeHref: string }) {
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href={homeHref} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold tracking-tight">FAMECH</span>
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize">
            {role}
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
