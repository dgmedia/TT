import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from '@/components/providers'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const instrumentSerif = localFont({
  src: [
    {
      path: '../../public/fonts/InstrumentSerif-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/InstrumentSerif-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'Pebble Studio',
  description: 'Create beautiful scroll experiences with video backgrounds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
