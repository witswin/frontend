"use client"

import { NullCallback } from "@/utils"
import { createContext, useContext } from "react"
import { Address } from "viem"

export const ProfileEditContext = createContext<{
  focusedWalletDeleteAddress: Address | null
  setFocusedWalletDeleteAddress: (walletPk: Address | null) => void
}>({
  focusedWalletDeleteAddress: null,
  setFocusedWalletDeleteAddress: NullCallback,
})

export const useProfileEditContext = () => useContext(ProfileEditContext)
