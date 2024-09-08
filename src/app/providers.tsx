"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"
import { type State, WagmiProvider } from "wagmi"
import { NextUIProvider } from "@nextui-org/react"
import { PrivyProvider } from "@privy-io/react-auth"

import { config } from "@/utils/wallet/wagmi"

type Props = {
  children: ReactNode
  initialState?: State
}

const queryClient = new QueryClient()

export function Providers({ children, initialState }: Props) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "https://wits.win/logo.svg",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config} initialState={initialState}>
          <NextUIProvider>{children}</NextUIProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}
