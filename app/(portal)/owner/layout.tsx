import { RoleGuard } from "@/components/portal/RoleGuard"
import { BottomNav } from "@/components/portal/BottomNav"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="owner">
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-6">{children}</main>
      <BottomNav role="owner" />
    </RoleGuard>
  )
}
