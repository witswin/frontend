import { FC, PropsWithChildren } from "react"
import { ErrorsProvider } from "./errorsProvider"
import { GlobalContextProvider } from "./globalProvider"
import { UserContextProvider } from "./userProfile"
import { Settings, UserProfile } from "@/types"
import WalletProvider from "./walletProvider"
import { cookies } from "next/headers"

export const WitsProvider: FC<PropsWithChildren> = async ({ children }) => {
  let authProfile: UserProfile | null = null

  const cookieStorage = await cookies()

  try {
    if (cookieStorage.has("userToken"))
      authProfile = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/info/`,
        {
          headers: {
            Authorization: `Token ${cookieStorage.get("userToken")?.value}`,
          },
          cache: "no-store",
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized")

          return res
        })
        .then((res) => res.json())
  } catch {}
  return (
    <ErrorsProvider>
      <GlobalContextProvider>
        <UserContextProvider initial={authProfile}>
          <WalletProvider>{children}</WalletProvider>
        </UserContextProvider>
      </GlobalContextProvider>
    </ErrorsProvider>
  )
}

export default WitsProvider
