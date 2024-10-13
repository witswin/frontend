"use client"

import { FC, PropsWithChildren, ReactNode, useState } from "react"
import { Address } from "viem"
import { ProfileEditContext } from "./context"

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
