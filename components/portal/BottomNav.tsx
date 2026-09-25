"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Role } from "@/lib/types"

interface Tab {
  href: string
  label: string
  icon: (props: { active: boolean }) => React.ReactNode
}

const iconProps = (active: boolean) => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: active ? 2.3 : 2.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
})

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg {...iconProps(active)}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
)

const PlusIcon = ({ active }: { active: boolean }) => (
  <svg {...iconProps(active)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

const ClockIcon = ({ active }: { active: boolean }) => (
  <svg {...iconProps(active)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

const UserIcon = ({ active }: { active: boolean }) => (
  <svg {...iconProps(active)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
)

const TABS: Record<Role, Tab[]> = {
  owner: [
    { href: "/owner/dashboard", label: "Home", icon: HomeIcon },
    { href: "/owner/requests/new", label: "New request", icon: PlusIcon },
    { href: "/owner/profile", label: "Profile", icon: UserIcon },
  ],
  mechanic: [
    { href: "/mechanic/dashboard", label: "Home", icon: HomeIcon },
    { href: "/mechanic/history", label: "History", icon: ClockIcon },
    { href: "/mechanic/profile", label: "Profile", icon: UserIcon },
  ],
}

export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const tabs = TABS[role]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-card px-7 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-1"
              style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              <tab.icon active={active} />
              <span className={`text-[11px] ${active ? "font-bold" : "font-semibold"}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
