const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  accepted: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  declined: "bg-muted text-muted-foreground",
  cancelled: "bg-muted text-muted-foreground",
}

export function statusBadgeClass(status: string) {
  return STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
}
