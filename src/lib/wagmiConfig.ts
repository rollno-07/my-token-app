// lib/wagmiConfig.ts
import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient } from '@tanstack/react-query';

// Get RPC URL from environment variable
// Use process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const sepoliaRpcUrl: string = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'https://sepolia.infura.io/v3/'; // Fallback

// Configure wagmi
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(), // Allows connecting via injected providers like MetaMask
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
});

// Create a query client for wagmi's internal caching
export const queryClient = new QueryClient();