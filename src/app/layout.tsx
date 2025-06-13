// src/app/layout.tsx
"use client"; // This is a client component

import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from '@/lib/wagmiConfig'; // Using alias
import { Toaster } from 'sonner'; // Import the Sonner Toaster component
import React from 'react';

import '@/app/globals.css'; // Corrected path using alias

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Web3 Token Transfer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-black text-white antialiased">
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster richColors position="top-right" theme="dark" /> {/* Sonner Toaster */}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}