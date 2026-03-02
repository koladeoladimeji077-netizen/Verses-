'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // In production, set NEXT_PUBLIC_TONCONNECT_MANIFEST_URL to your domain.
  const manifestUrl =
    process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ||
    'http://localhost:3000/tonconnect-manifest.json';

  return <TonConnectUIProvider manifestUrl={manifestUrl}>{children}</TonConnectUIProvider>;
}
