import { TopBar } from "@/components/portal/TopBar"
import { RequestForm } from "@/components/forms/RequestForm"

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <TopBar title="New request" />
      <p className="-mt-4 text-sm text-muted-foreground">
        Describe the problem and your location — nearby mechanics will be notified right away.
      </p>
      <RequestForm />
    </div>
  )
}
