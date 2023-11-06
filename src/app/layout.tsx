import { Analytics } from '@vercel/analytics/react';
import { WebRTCProvider } from '@/contexts/WebRTCContext'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WebRTCProvider>
          {children}
        </WebRTCProvider>
        <Analytics/>
      </body>
    </html>
  )
}
