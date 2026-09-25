"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Wrench } from "lucide-react"

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-bold tracking-tight">FAMECH</span>
        </Link>

        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
