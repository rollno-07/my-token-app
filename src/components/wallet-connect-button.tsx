// components/wallet-connect-button.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '../../../my-token-pp/src/components/ui/button'; // Shadcn Button
import { toast } from 'sonner'; // Import toast from sonner

export function WalletConnectButton() {
  const [mounted, setMounted] = useState(false); // State to track if component is mounted on client
  useEffect(() => {
    setMounted(true); // Set mounted to true once the component hydrates on the client
  }, []);

  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = (connector: typeof connectors[number]) => {
    connect({ connector });
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info("Wallet disconnected successfully.");
  };

  // Render a placeholder on the server and until the component mounts on the client
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        {/* Placeholder for server render to avoid hydration mismatch */}
        <div className="h-10 w-full bg-black-light/30 rounded-md animate-pulse"></div>
        <div className="h-10 w-full bg-black-light/30 rounded-md animate-pulse"></div>
      </div>
    );
  }

  // Once mounted, render the actual UI based on wallet connection status
  if (isConnected) {
    return (
      <div className="flex flex-col gap-2 p-4 border rounded-xl border-radium-500 bg-black-light/50">
        <p className="text-sm text-radium-300">
          Connected to: <span className="font-mono text-radium-100 break-all">{address}</span>
        </p>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="w-full text-radium-500 border-radium-500 hover:bg-radium-900 hover:text-white"
        >
          Disconnect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => handleConnect(connector)}
          className="w-full bg-radium-500 text-white hover:bg-radium-600 focus:ring-radium-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          disabled={status === 'pending' && connector.id === connectors.find(c => c.id === connector.id)?.id}
        >
          {status === 'pending' && connector.id === connectors.find(c => c.id === connector.id)?.id ? 'Connecting...' : `Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
}
