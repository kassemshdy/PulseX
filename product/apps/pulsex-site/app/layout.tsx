import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PulseX CMS - Build Your Website in Minutes',
  description: 'Enterprise-grade headless CMS with powerful page builder, social media automation, and multi-language support',
  keywords: ['CMS', 'Content Management', 'Page Builder', 'Headless CMS', 'Website Builder'],
  openGraph: {
    title: 'PulseX CMS - Build Your Website in Minutes',
    description: 'Enterprise-grade headless CMS with powerful features',
    type: 'website',
    url: 'https://pulsex.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

