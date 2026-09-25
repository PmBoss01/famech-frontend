"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { StarInput } from "@/components/ratings/Stars"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function RatePrompt({
  title,
  onSubmit,
}: {
  title: string
  onSubmit: (score: number, comment: string) => Promise<void>
}) {
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (score === 0) {
      setError("Pick a star rating first.")
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await onSubmit(score, comment)
    } catch {
      setError("Couldn't submit your rating. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <p className="text-sm font-bold">{title}</p>
      <StarInput value={score} onChange={setScore} />
      <Textarea
        placeholder="Add a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button size="sm" onClick={handleSubmit} disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit rating
      </Button>
    </div>
  )
}
