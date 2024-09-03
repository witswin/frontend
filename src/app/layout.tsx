import type { Metadata } from "next"
import { config } from "@/utils/wallet/wagmi"
import { Noto_Sans } from "next/font/google"
import WitsProvider from "@/context"
import Header from "@/components/layout/header"
import Progressbar from "@/components/progress"
import Footer from "@/components/layout/footer"
import { SpeedInsights } from "@vercel/speed-insights/next"
import StyledJsxRegistry from "@/components/styled-components"
import { ConnectWalletModal } from "@/components/containers/modals/ConnectWalletModal"
import GoogleAnalytics from "@/components/google-analytics"

import "./globals.scss"

import { headers } from "next/headers"
import { cookieToInitialState } from "wagmi"
import { Providers } from "./providers"
import AxiosApiManager from "@/components/axios-api-manager"
import EventContextProvider from "@/context/eventProvider"

const notoSansFont = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "WITS",
  description: "Who is the smartest",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(config, headers().get("cookie"))

  return (
    <html lang="en" dir="ltr" className="dark">
      <body
        className={`dark:bg-gray10 min-h-screen dark:text-white ${notoSansFont}`}
      >
        <Providers initialState={initialState}>
          <WitsProvider>
            <StyledJsxRegistry>
              <EventContextProvider>
                <div id="app">
                  <Header />
                  <div className="pt-4">{children}</div>

                  <Footer />
                </div>
              </EventContextProvider>

              <ConnectWalletModal />
            </StyledJsxRegistry>
            <AxiosApiManager />
          </WitsProvider>
        </Providers>

        <Progressbar />

        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}

        <SpeedInsights />
      </body>
    </html>
  )
}
