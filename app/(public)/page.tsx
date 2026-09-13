"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Clock, MapPin, Mic, Wrench } from "lucide-react"

import { Button } from "@/components/ui/button"

const FEATURES = [
  {
    icon: MapPin,
    title: "Pin your location",
    description: "No street address needed — drop a pin or describe a nearby landmark.",
  },
  {
    icon: Camera,
    title: "Show the problem",
    description: "Attach a photo, or record a quick voice note describing the fault.",
  },
  {
    icon: Clock,
    title: "Get matched fast",
    description: "Nearby, available mechanics are notified immediately and can accept in seconds.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">FAMECH</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link href="/register" />}>Get started</Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 py-16 text-center sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Broken down? Get a mechanic to <span className="text-primary">you</span>, not the other way around.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
            Describe the fault, drop your location, and the nearest available mechanic comes to fix it —
            wherever you are in Ghana.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
              Request a mechanic
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/register" />}>
              I&apos;m a mechanic
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid w-full gap-4 sm:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border bg-card p-6 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <feature.icon className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Mic className="h-3.5 w-3.5" />
          Text, photo, or voice — describe it however is easiest.
        </motion.div>
      </main>
    </div>
  )
}
