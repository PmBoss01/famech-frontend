import { RoleGuard } from "@/components/portal/RoleGuard"
import { PortalHeader } from "@/components/portal/PortalHeader"

export default function MechanicLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="mechanic">
      <PortalHeader role="mechanic" homeHref="/mechanic/dashboard" />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </RoleGuard>
  )
}
