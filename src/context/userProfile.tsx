"use client"

import { APIErrorsSource, Settings, UserProfile } from "@/types"
import { deleteWalletApi, getUserProfileWithTokenAPI } from "@/utils/api/auth"
import useLocalStorageState, { setCookie } from "@/utils/hooks"
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { ErrorsContext } from "./errorsProvider"
import { getRemainingClaimsAPI, getWeeklyChainClaimLimitAPI } from "@/utils/api"
import {
  useFastRefresh,
  useMediumRefresh,
  useRefreshWithInitial,
} from "@/utils/hooks/refresh"
import { FAST_INTERVAL, IntervalType } from "@/constants"
import { useWalletAccount } from "@/utils/wallet"
import { NullCallback } from "@/utils"
import { Address, isAddressEqual } from "viem"
import { useDisconnect } from "wagmi"

export const UserProfileContext = createContext<
  Partial<Settings> & {
    userProfile: UserProfile | null
    onWalletLogin: (userToken: string, userProfile: UserProfile) => void
    loading: boolean
    userProfileLoading: boolean
    nonEVMWalletAddress: string
    setNonEVMWalletAddress: (address: string) => void
    userToken: string | null
    updateUsername: (username: string) => void
    holdUserLogout: boolean
    setHoldUserLogout: (arg: boolean) => void
    logout: Function
    updateProfile: (arg: UserProfile) => void
  }
>({
  userProfile: null,
  isGasTapAvailable: true,
  loading: false,
  tokentapRoundClaimLimit: 0,
  gastapRoundClaimLimit: 0,
  userProfileLoading: false,
  nonEVMWalletAddress: "",
  userToken: null,
  onWalletLogin: NullCallback,
  holdUserLogout: false,
  setHoldUserLogout: NullCallback,
  setNonEVMWalletAddress: NullCallback,
  updateUsername: NullCallback,
  logout: NullCallback,
  updateProfile: NullCallback,
})

export const UserContextProvider: FC<
  PropsWithChildren & { initial: UserProfile | null }
> = ({ children, initial }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initial)
  const [loading, setLoading] = useState(false)
  const [userToken, setToken] = useLocalStorageState("userToken")
  const [holdUserLogout, setHoldUserLogout] = useState(false)

  const { address, isConnected } = useWalletAccount()
  const { disconnect } = useDisconnect()

  const [userProfileLoading, setUserProfileLoading] = useState(false)
  const [nonEVMWalletAddress, setNonEVMWalletAddress] = useState("")

  const onWalletLogin = (userToken: string, userProfile: UserProfile) => {
    setCookie("userToken", userToken)
    setUserProfile(userProfile)
    setToken(userToken)
  }

  const updateUsername = (username: string) => {
    setUserProfile({
      ...userProfile!,
      username,
    })
  }

  useRefreshWithInitial(
    () => {
      const getUserProfileWithToken = async () => {
        setUserProfileLoading(true)
        try {
          const userProfileWithToken: UserProfile =
            await getUserProfileWithTokenAPI(userToken!)
          setUserProfile(userProfileWithToken)
          setCookie("userToken", userToken!)
        } finally {
          setUserProfileLoading(false)
        }
      }
      setCookie("userToken", userToken!)

      if (userToken) {
        getUserProfileWithToken()
      }
    },
    FAST_INTERVAL,
    [userToken, setUserProfile]
  )

  const logout = () => {
    disconnect?.()
    localStorage.clear()
    setCookie("userToken", "")

    setUserProfile(null)
    setToken("")
  }

  useEffect(() => {
    if (holdUserLogout) {
      // if (isConnected && !userToken) {
      //   disconnect?.();
      // }
      return
    }

    if (
      userToken &&
      isConnected &&
      userProfile &&
      isAddressEqual(userProfile.walletAddress, address!)
    )
      return

    console.log(userProfile, isConnected, userToken)

    const timeout = setTimeout(() => {
      disconnect?.()
      localStorage.removeItem("userToken")
      setCookie("userToken", "")

      setUserProfile(null)
      setToken("")
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [userToken, isConnected, holdUserLogout, userProfile, address, disconnect])

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        onWalletLogin,
        loading,
        userToken,
        userProfileLoading,
        nonEVMWalletAddress,
        setNonEVMWalletAddress,
        updateUsername,
        updateProfile: (userProfile) => setUserProfile(userProfile),
        holdUserLogout,
        setHoldUserLogout,
        logout,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfileContext = () => useContext(UserProfileContext)
