import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { ClientProviders } from '@/components/ClientProviders'

export const metadata = {
  title: 'SpyTON Hunters',
  description: 'Find TON gems — recently added, top upvoted, top gainers.',
  icons: {
    icon: '/spyton-logo.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <SiteHeader />
          <div className="container">{children}</div>
        </ClientProviders>
      </body>
    </html>
  )
}
