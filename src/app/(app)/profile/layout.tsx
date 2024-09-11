"use client"

import {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react"
import { NullCallback } from "@/utils"
import { Address } from "viem"

export const ProfileEditContext = createContext<{
  focusedWalletDeleteAddress: Address | null
  setFocusedWalletDeleteAddress: (walletPk: Address | null) => void
}>({
  focusedWalletDeleteAddress: null,
  setFocusedWalletDeleteAddress: NullCallback,
})

export const useProfileEditContext = () => useContext(ProfileEditContext)

const ProfileEditLayout: FC<
  PropsWithChildren & { socialAccounts: ReactNode }
> = ({ children }) => {
  const [focusedWalletDeleteAddress, setFocusedWalletDeleteAddress] =
    useState<Address | null>(null)

  return (
    <ProfileEditContext.Provider
      value={{
        focusedWalletDeleteAddress,
        setFocusedWalletDeleteAddress,
      }}
    >
      {children}
    </ProfileEditContext.Provider>
  )
}

export default ProfileEditLayout
