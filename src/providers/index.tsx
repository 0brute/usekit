"use client"

import { env } from "@/env"
import { Analytics } from "@vercel/analytics/next"
import NextTopLoader from "nextjs-toploader"

import { THEMES } from "@/config/colors"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ThemeProvider } from "./theme-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ThemeProvider
        themes={THEMES}
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TooltipProvider>
          <div className="relative flex min-h-svh flex-col bg-background">
            {children}
            {env.NEXT_PUBLIC_NODE_ENV === "production" && <Analytics />}
          </div>
          <Toaster />
          <NextTopLoader showForHashAnchor={false} />
        </TooltipProvider>
      </ThemeProvider>
    </>
  )
}
