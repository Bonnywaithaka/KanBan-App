import Providers from '@/components/Providers'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Kanban app',
  description: 'Used by team to manage work been done',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
        {children}
          </Providers></body>
    </html>
  )
}
