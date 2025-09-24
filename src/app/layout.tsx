import type { Metadata } from 'next'
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ConvexProvider } from 'convex/react'
import { ConvexClientProvider } from '@/components/ConvexClientProvider'
import { ConvexErrorBoundary } from '@/components/ConvexErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blossom - Flashcard Study App',
  description: 'A modern, mobile-optimized flashcard study app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}><StackProvider app={stackClientApp}><StackTheme>
        <ConvexErrorBoundary>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ConvexErrorBoundary>
      </StackTheme></StackProvider></body>
    </html>
  )
}
