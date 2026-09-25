interface PaystackHandler {
  openIframe: () => void
}

interface PaystackPopSetupOptions {
  key: string
  email: string
  amount: number
  ref: string
  currency?: string
  onClose?: () => void
  callback?: (response: { reference: string }) => void
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackPopSetupOptions) => PaystackHandler
    }
  }
}

const SCRIPT_SRC = "https://js.paystack.co/v1/inline.js"

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"))
  if (window.PaystackPop) return Promise.resolve()

  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Failed to load Paystack")))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Paystack"))
    document.body.appendChild(script)
  })
}

export async function openPaystackCheckout({
  publicKey,
  email,
  amount,
  reference,
  onSuccess,
  onClose,
}: {
  publicKey: string
  email: string
  amount: string
  reference: string
  onSuccess: (reference: string) => void
  onClose?: () => void
}) {
  await loadPaystackScript()
  if (!window.PaystackPop) throw new Error("Paystack failed to load")

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: Math.round(Number(amount) * 100), // Paystack expects the amount in kobo/pesewas
    ref: reference,
    currency: "GHS",
    callback: (response) => onSuccess(response.reference),
    onClose,
  })
  handler.openIframe()
}
