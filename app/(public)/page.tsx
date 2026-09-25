"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Camera, Check, Clock, MapPin, Mic, Wrench } from "lucide-react"

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
    description: "Nearby, verified mechanics are notified immediately and can accept in seconds.",
  },
]

const STEPS = [
  {
    number: "01",
    title: "Describe the fault",
    description: "Text, a photo, or a voice note — whichever is easiest by the roadside.",
  },
  {
    number: "02",
    title: "Get matched",
    description: "The nearest available, verified mechanics are notified and can accept instantly.",
  },
  {
    number: "03",
    title: "Get back on the road",
    description: "Your mechanic comes to you, fixes the issue on the spot, and you're on your way.",
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <div className="flex items-center gap-2">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-primary text-primary-foreground">
            <Wrench className="h-4.5 w-4.5" />
          </span>
          <span className="text-xl font-bold tracking-tight">FAMECH</span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link href="/register" />}>
            Get started
          </Button>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-14 px-6 py-10 lg:flex-row lg:items-center lg:py-16">
        <motion.div {...fadeUp} className="flex flex-1 flex-col items-start gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-accent-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Now live across Accra
          </div>
          <h1 className="text-4xl font-bold leading-[1.06] tracking-tight text-balance sm:text-5xl">
            Broken down? Get a mechanic to <span className="text-primary">you.</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-balance">
            Describe the fault, drop your pin, and the nearest verified mechanic comes to fix it on the spot —
            wherever you are in Ghana.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
              Request a mechanic
            </Button>
            <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/register" />}>
              I&apos;m a mechanic
            </Button>
          </div>
          <div className="flex items-center gap-5 pt-1 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" style={{ color: "#1F4D3B" }} />
              Verified mechanics only
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" style={{ color: "#1F4D3B" }} />
              No account needed to browse
            </span>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="relative w-full max-w-[300px] flex-shrink-0"
        >
          <div
            className="absolute -right-5 -top-10 h-80 w-80 rounded-full opacity-70"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />
          <div className="relative z-10 flex flex-col gap-3 rounded-[32px] border bg-card p-3.5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-muted-foreground">Job request</span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-accent-foreground">
                1.2 km
              </span>
            </div>
            <div className="rounded-2xl border bg-background p-3.5">
              <p className="text-[13.5px] font-semibold leading-snug">
                Car won&apos;t start, clicking noise when I turn the key
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Near Osu Mall, Oxford St
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-[10px] bg-primary py-2.5 text-center text-[13px] font-bold text-primary-foreground">
                Accept
              </div>
              <div className="flex-1 rounded-[10px] border py-2.5 text-center text-[13px] font-bold">Decline</div>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.15 }}
        className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-8 sm:grid-cols-3"
      >
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-[18px] border bg-card p-7">
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4.5 text-base font-bold">{feature.title}</h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </motion.section>

      <section style={{ background: "#1C1917" }} className="py-20 dark:bg-card">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center text-[30px] font-bold tracking-tight text-white">How it works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col gap-3.5">
                <span className="text-[13px] font-bold" style={{ color: "#C08829" }}>
                  {step.number}
                </span>
                <h4 className="text-[17px] font-bold text-white">{step.title}</h4>
                <p className="text-[14.5px] leading-relaxed" style={{ color: "#A8A29E" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-6 py-20 text-center">
        <h2 className="text-[28px] font-bold tracking-tight">Ready when your car isn&apos;t.</h2>
        <div className="flex gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
            Request a mechanic
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/register" />}>
            I&apos;m a mechanic
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mic className="h-3.5 w-3.5" />
          Text, photo, or voice — describe it however is easiest.
        </p>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t px-6 py-7">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Wrench className="h-3 w-3" />
          </span>
          FAMECH — on-demand mechanic dispatch, Ghana
        </div>
        <span className="text-[13px] text-muted-foreground/70">© 2026 FAMECH</span>
      </footer>
    </div>
  )
}
