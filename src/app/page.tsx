"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useReadContract,
  useBalance,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseUnits, formatUnits, Address, Hex } from "viem";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ERC-20 Token ABI
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

// Supported tokens
type TokenOption = {
  name: string;
  symbol: string;
  address?: Address;
  decimals: number;
};

const TOKENS: TokenOption[] = [
  { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  {
    name: "Wrapped ETH",
    symbol: "WETH",
    address: "0xfFf9976782d46CC05630D1f6eB9Bc98210fA7378",
    decimals: 18,
  },
];

export default function HomePage() {
  const { address, isConnected, chain } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenOption>(TOKENS[0]);

  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
    chainId: sepolia.id,
  });

  const {
    data: tokenBalance,
    refetch: refetchTokenBalance,
  } = useReadContract({
    address: selectedToken.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address!],
    chainId: sepolia.id,
    query: {
      enabled: isConnected && !!selectedToken.address,
    },
  });

  const {
    data: hash,
    sendTransaction,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction Confirmed", {
        description: `Hash: ${hash}`,
      });
      setTokenAmount("");
      setRecipientAddress("");
      refetchEthBalance();
      refetchTokenBalance();
    }
  }, [isConfirmed, hash, refetchTokenBalance, refetchEthBalance]);

  useEffect(() => {
    if (sendError) {
      toast.error("Transaction Failed", { description: sendError.message });
    }
    if (confirmError) {
      toast.error("Confirmation Failed", { description: confirmError.message });
    }
  }, [sendError, confirmError]);

  const handleTransfer = () => {
    if (!isConnected || !recipientAddress || !tokenAmount) return;

    const amount = parseUnits(tokenAmount, selectedToken.decimals);

    if (!selectedToken.address) {
      // Send ETH
      sendTransaction?.({
        to: recipientAddress as Address,
        value: amount,
        account: address,
        chainId: sepolia.id,
      });
    } else {
      // Send ERC20
      const data: Hex = `0xa9059cbb${recipientAddress
        .substring(2)
        .padStart(64, "0")}${amount.toString(16).padStart(64, "0")}`;

      sendTransaction?.({
        to: selectedToken.address,
        data,
        value: 0n,
        account: address,
        chainId: sepolia.id,
      });
    }

    toast("Transaction initiated. Please confirm in wallet.");
  };

  const displayBalance =
    selectedToken.address === undefined
      ? formatUnits(BigInt(ethBalance?.value || 0), 18)
      : formatUnits(BigInt(tokenBalance || 0), selectedToken.decimals);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <Card className="w-full max-w-md bg-zinc-900 border border-radium-500 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-radium-500 text-3xl font-bold">
            Token Transfer
          </CardTitle>
          <CardDescription className="text-radium-300">
            Transfer ETH or Tokens on Sepolia Testnet
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <WalletConnectButton />

          {mounted && isConnected && (
            <>
              <div className="space-y-4 border-t pt-4 border-zinc-700">
                <p className="text-sm text-radium-300">
                  Network:{" "}
                  <span className="font-bold text-radium-100">
                    {chain?.name}
                  </span>
                </p>

                <div className="grid gap-2 ">
                  <Label>Select Token</Label>
                  <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full text-left border-radium-500 bg-radium-900">
                        {selectedToken.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {TOKENS.map((token) => (
                        <DropdownMenuItem
                          key={token.symbol}
                          onClick={() => setSelectedToken(token)}
                        >
                          {token.name} ({token.symbol})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <p className="text-sm text-radium-300">
                    Balance:
                    <span className="ml-2 font-bold text-radium-100">
                      {displayBalance} {selectedToken.symbol}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="0.0"
                    type="number"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full bg-radium-500 hover:bg-radium-600 text-white"
                  onClick={handleTransfer}
                  disabled={isSending || isConfirming}
                >
                  {isSending
                    ? "Sending..."
                    : isConfirming
                    ? "Confirming..."
                    : "Send"}
                </Button>

                {hash && (
                  <p className="text-xs text-radium-400 text-center pt-2">
                    Tx:{" "}
                    <a
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {hash.slice(0, 6)}...{hash.slice(-4)}
                    </a>
                  </p>
                )}
              </div>
            </>
          )}

          {!isConnected && mounted && (
            <p className="text-center text-radium-400">
              Connect wallet to begin.
            </p>
          )}
        </CardContent>

        <CardFooter className="text-center text-xs text-zinc-500">
          {"Ensure you're on Sepolia Testnet"}
        </CardFooter>
      </Card>
    </div>
  );
}
