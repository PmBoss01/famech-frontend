const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#F3E4C8] text-[#8B5E22] dark:bg-[#3A2E1A] dark:text-[#E8C77A]",
  accepted: "bg-[#E4EDE7] text-[#1F4D3B] dark:bg-[#16281F] dark:text-[#8FCBAA]",
  completed: "bg-[#F3EFE7] text-[#78716C] dark:bg-[#2B261E] dark:text-[#A8A29E]",
  declined: "bg-[#F3EFE7] text-[#78716C] dark:bg-[#2B261E] dark:text-[#A8A29E]",
  cancelled: "bg-[#F3EFE7] text-[#78716C] dark:bg-[#2B261E] dark:text-[#A8A29E]",
}

export function statusBadgeClass(status: string) {
  return STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"
}
