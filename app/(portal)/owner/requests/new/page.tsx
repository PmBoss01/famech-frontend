import { RequestForm } from "@/components/forms/RequestForm"

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Get a mechanic</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the problem and your location — nearby mechanics will be notified right away.
        </p>
      </div>
      <RequestForm />
    </div>
  )
}
