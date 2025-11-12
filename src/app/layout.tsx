import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DocSum AI - Smart Document Summarization',
  description: 'Transform lengthy documents into concise, intelligent summaries with AI-powered analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}