import { RoleGuard } from "@/components/portal/RoleGuard"
import { PortalHeader } from "@/components/portal/PortalHeader"

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard requiredRole="owner">
      <PortalHeader role="owner" homeHref="/owner/dashboard" />
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </RoleGuard>
  )
}
