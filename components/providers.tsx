'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
      }}
    >
      <ThemeProvider
        enableSystem
        attribute='class'
        defaultTheme='system'
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </ClerkProvider>
  )
}
