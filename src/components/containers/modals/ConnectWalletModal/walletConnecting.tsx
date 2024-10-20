"use client"

import Icon from "@/components/ui/Icon"
import { useUserProfileContext } from "@/context/userProfile"
import { loginOrRegister, newLoginApi } from "@/utils/api"
import { useWalletAccount, useWalletNetwork } from "@/utils/wallet"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useSignMessage, useSignTypedData } from "wagmi"
import { WalletState } from "."
import { ClaimButton } from "@/components/ui/Button/button"

const WalletConnecting: FC<{
  imageUrl: string
  label?: string
  loadingImage: string
  error?: string
  setWalletState: (state: WalletState) => void
  isNewUser: boolean
  signData: { nonce: string; message: string }
  previousWalletState: WalletState | null
}> = ({
  imageUrl,
  label,
  loadingImage,
  setWalletState,
  isNewUser,
  previousWalletState,
  signData,
}) => {
  const { address, connector } = useWalletAccount()
  const [error, setError] = useState("")

  const { chain } = useWalletNetwork()

  const chainId = chain?.id

  const { userToken, userProfile, onWalletLogin } = useUserProfileContext()

  const [now, setNow] = useState(new Date().toISOString())

  const isMounted = useRef(false)

  const onSuccess = useCallback(
    async (hashed: string) => {
      if (!address || !signData.nonce) return

      const res = await newLoginApi(
        address,
        hashed,
        signData.nonce,
        // JSON.stringify({
        //   message: {
        //     message: "Wits Sign In",
        //     URI: "https://wits.win",
        //     IssuedAt: now,
        //   },
        //   primaryType: "Wits",
        //   account: address,
        //   domain: {
        //     name: "WITS Connect",
        //     version: "1",
        //     chainId: chainId ?? 1,
        //     verifyingContract: "0x0000000000000000000000000000000000000000",
        //   },
        //   types: {
        //     EIP712Domain: [
        //       { name: "name", type: "string" },
        //       { name: "version", type: "string" },
        //       { name: "chainId", type: "uint256" },
        //       { name: "verifyingContract", type: "address" },
        //     ],
        //     Unitap: [
        //       { name: "message", type: "string" },
        //       { name: "URI", type: "string" },
        //       { name: "IssuedAt", type: "string" },
        //     ],
        //   },
        // }),
      )

      onWalletLogin(res.token, res)

      setWalletState(
        previousWalletState === WalletState.AddNewWallet
          ? WalletState.AddWalletSuccess
          : isNewUser
            ? WalletState.SetUsername
            : WalletState.LoggedIn,
      )
    },
    [
      address,
      chainId,
      isNewUser,
      now,
      onWalletLogin,
      previousWalletState,
      setWalletState,
    ],
  )

  const { isError, signMessageAsync } = useSignMessage({})

  useEffect(() => {
    if (isMounted.current) return

    if (!address || !signData.nonce) return

    console.log(signData)

    signMessageAsync({
      message: signData.message,
    })
      .then((res) => onSuccess(res))
      .catch((err) => {
        console.warn(err)
        setError(err.message)
      })

    isMounted.current = true

    return () => {}
  }, [address, signData, chainId, connector, now, onSuccess, signMessageAsync])

  if (error)
    return (
      <div className="w-full">
        <div className="text-center">
          <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
            <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
          </div>

          <p className="font-semibold text-warn mt-8">Sign message Failed</p>

          <p className="mt-2 text-gray100 text-xs">{error}</p>

          <ClaimButton
            onClick={() => {
              setNow(new Date().toISOString())
              isMounted.current = false
              setError("")
            }}
            className="mx-auto !w-full mt-7"
          >
            <p>Try Again</p>
          </ClaimButton>
        </div>
      </div>
    )

  return (
    <div className="text-center">
      <div className="h-32 w-32 mx-auto bg-[#4C4C5C] rounded-full flex items-center justify-center">
        <Icon
          alt="loading"
          iconSrc={loadingImage}
          width="128px"
          height="128px"
          className="animate-spin absolute"
        />
        <Icon iconSrc={imageUrl} alt={label} width="60px" height="60px" />
      </div>
      <p className="font-bold mt-8">Waiting...</p>

      <p className="text-gray100 text-xs mt-6 mb-12">
        Please sign the message in your wallet to complete the authentication
        process.
      </p>
    </div>
  )
}

export default WalletConnecting
