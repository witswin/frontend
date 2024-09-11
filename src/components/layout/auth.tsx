"use client"

import { FC, useEffect, useRef, useState } from "react"
import { useOutsideClick } from "@/utils/hooks/dom"
import { useUserProfileContext } from "@/context/userProfile"
import { useUserWalletProvider, useWalletConnection } from "@/utils/wallet"
import { shortenAddress } from "@/utils"
import Image from "next/image"
import { useGlobalContext } from "@/context/globalProvider"

import Styles from "./auth.module.scss"

import { Noto_Sans_Mono } from "next/font/google"
import Link from "next/link"
import { useWalletManagementContext } from "@/context/walletProvider"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@nextui-org/react"
import { setCookie } from "@/utils/hooks"
import { getUserProfileWithTokenAPI } from "@/utils/api"

const NotoSansMono = Noto_Sans_Mono({
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
})

export const UserAuthStatus = () => {
  const divRef = useRef<HTMLDivElement>(null)

  const [dropDownActive, setDropDownActive] = useState(false)

  useOutsideClick(divRef, () => setDropDownActive(false))

  const { userProfile } = useUserProfileContext()

  return (
    <div ref={divRef} className="md:relative ml-5">
      <div className={`ml-5 p-[1px] rounded-lg mr-3`} id="profile-dropdown">
        {/* <div className="cursor-pointer flex rounded-lg h-9 items-center justify-between bg-gray40"> */}
        <div
          onClick={() => {
            if (!userProfile) return
            setDropDownActive(!dropDownActive)
          }}
          className="cursor-pointer relative z-20 pr-0.5 pl-2 flex rounded-lg h-9 items-center justify-between"
        >
          {/* <span className="ml-2 hidden md:block text-sm">
              @ {userProfile?.username}
            </span> */}

          {/* <span className="text-gray90 hidden md:block ml-8 mr-5"></span> */}
          <RenderNavbarWalletAddress />
        </div>

        {dropDownActive && (
          <ProfileDropdown setDropDownActive={setDropDownActive} />
        )}
        {/* </div> */}
      </div>
    </div>
  )
}

const WalletItem = ({
  wallet,
  isActive,
}: {
  wallet: string
  isActive?: boolean
}) => {
  const [copyMessage, setCopyMessage] = useState("")

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)

    setCopyMessage("Copied")

    setTimeout(() => {
      if (setCopyMessage) setCopyMessage("")
    }, 3000)
  }

  return (
    <div
      className={
        "flex hover:text-white text-sm my-2 items-center " +
        (isActive ? "text-white" : "text-gray90")
      }
    >
      <span
        className={
          (isActive ? "bg-white" : "bg-gray90") + " w-2 h-2 rounded-full"
        }
      />
      <span className={`ml-3 font-normal ${NotoSansMono.className}`}>
        {shortenAddress(wallet)}
      </span>
      <div className="relative">
        {copyMessage && (
          <div className="absolute top-1/2 translate-y-1/2 mb-3 w-16 left-1/2 -translate-x-1/2 py-2 bg-gray10 text-gray100 text-center border-gray70 border rounded-md text-xs">
            {copyMessage}
          </div>
        )}
        <Image
          onClick={() => copyToClipboard(wallet)}
          src="/assets/images/navbar/copy.svg"
          width={12}
          height={14}
          className="ml-3 cursor-pointer"
          alt="copy"
        />
      </div>
    </div>
  )
}

export const ProfileDropdown: FC<{
  setDropDownActive: (isActive: boolean) => void
}> = ({ setDropDownActive }) => {
  const { userProfile, logout, setHoldUserLogout } = useUserProfileContext()

  const { connection } = useUserWalletProvider()

  const { setIsAddModalOpen, setDuplicateWalletRaiseError } =
    useWalletManagementContext()

  return (
    <div className="absolute bg-gradient-to-l cursor-default from-[#de68d8] via-[#8c91c7] to-[#243a3c] to-70% left-5 rounded-xl bg-cover text-white p-[2px] z-20 top-full mt-2">
      <div className="h-[260px] rounded-xl bg-gray30 w-full  md:w-[385px] max-w-full">
        <div
          className={`p-3 rounded-t-xl ${Styles.dropdownHeader} flex items-center justify-between font-normal text-sm`}
        >
          <Link
            onClick={() => {
              setDropDownActive(false)
            }}
            href="#"
            className="mb-1 font-semibold"
          >
            <button className="relative text-left px-2 h-8 flex items-center w-40 z-10 text-white">
              <Image
                className="absolute inset-0 -z-10"
                src="/assets/images/navbar/logout-button.svg"
                alt="logout"
                width={147}
                height={28}
              />
              @ {userProfile?.username}
              <Image
                width={12}
                height={10}
                src="/assets/images/navbar/arrow-right.svg"
                className="ml-auto mr-6 mb-1"
                alt="arrow-right"
              />
            </button>
          </Link>

          <button
            onClick={() => {
              setDropDownActive(false)
              logout()
            }}
            className="rounded-lg relative text-xs z-10 px-5 py-2"
          >
            <div className="absolute rounded-lg -z-10 inset-0 bg-gray20 opacity-50" />
            Log Out
          </button>
        </div>
        <div className="px-2 overflow-y-auto h-[194px] flex flex-col">
          {!!userProfile?.walletAddress && (
            <WalletItem wallet={userProfile?.walletAddress} isActive />
          )}
        </div>
      </div>
    </div>
  )
}

export const RenderNavbarWalletAddress = () => {
  const { setIsWalletPromptOpen } = useGlobalContext()
  const { userProfile, onWalletLogin } = useUserProfileContext()

  const evmWallet = userProfile?.walletAddress
  const {
    isModalOpen,
    init,
    connectOrCreateWallet,
    linkApple,
    ready,
    login,
    user,
    forkSession,
    linkWallet,
    getAccessToken,
    authenticated,
  } = usePrivy()

  const { connection } = useUserWalletProvider()

  let address = connection.isConnected ? connection.address : evmWallet

  useEffect(() => {
    if (!authenticated || userProfile) return

    getAccessToken().then((token) => {
      if (!token) return

      setCookie("userToken", token)
      getUserProfileWithTokenAPI(token).then((res) => onWalletLogin(token, res))
    })
  }, [authenticated])

  if (!userProfile)
    return (
      <Button
        disabled={!ready}
        data-testid="wallet-connect"
        className="!w-36 h-[28px] !py-0 align-baseline"
        onClick={() => {
          login()
        }}
      >
        Connect Wallet
      </Button>
    )

  return (
    <>
      <Button
        data-testid="wallet-address"
        className={`${
          NotoSansMono.className
        } btn btn--address bg-gray10 border border-divider text-white tracking-wider font-normal btn--address--active !py-0 ml-0 md:ml-3 align-baseline h-8`}
        onClick={(e) => {
          // if (connection.isConnected) return
          // e.stopPropagation()
          // setIsWalletPromptOpen(true)
        }}
      >
        {shortenAddress(address)}
      </Button>
    </>
  )
}

export default UserAuthStatus
