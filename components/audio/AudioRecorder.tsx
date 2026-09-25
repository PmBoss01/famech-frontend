"use client"

import { useRef, useState } from "react"
import { Mic, RotateCcw, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const MIME_CANDIDATES = ["audio/webm", "audio/mp4", "audio/ogg"]

function pickMimeType() {
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported?.(type))
}

export function AudioRecorder({ onChange }: { onChange: (blob: File | null) => void }) {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = pickMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType ?? "audio/webm" })
        const file = new File([blob], `voice-note.${mimeType?.includes("mp4") ? "m4a" : "webm"}`, {
          type: blob.type,
        })
        setAudioUrl(URL.createObjectURL(blob))
        onChange(file)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch {
      setError("Microphone access was denied or isn't available.")
    }
  }

  function stopRecording() {
    recorderRef.current?.stop()
    setRecording(false)
  }

  function reRecord() {
    setAudioUrl(null)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <Label>Voice note (optional)</Label>
      {!audioUrl ? (
        <Button type="button" variant="outline" className="w-full" onClick={recording ? stopRecording : startRecording}>
          {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {recording ? "Stop recording" : "Record a voice note"}
        </Button>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mic className="h-3.5 w-3.5" />
          </span>
          <audio controls src={audioUrl} className="h-9 flex-1 min-w-0" />
          <Button type="button" variant="ghost" size="icon" onClick={reRecord} aria-label="Re-record">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
