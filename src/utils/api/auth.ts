import { UserProfile } from "@/types"
import { axiosInstance } from "./base"
import { resolveUserTokenMethod } from "."
import { Address } from "viem"

export async function checkUsernameValid(username: string, token: string) {
  const response = await axiosInstance.post<{ exists: boolean }>(
    "/api/auth/user/check-username/",
    {
      username,
    },
    {
      headers: {
        Authorization: resolveUserTokenMethod(token),
      },
    },
  )

  return response.data
}

export async function checkUserExists(walletAddress: string): Promise<boolean> {
  const response = await axiosInstance.post<{ exists: boolean }>(
    "/api/auth/user/check-exists/",
    {
      walletAddress,
    },
  )

  return response.data.exists
}

export async function loginOrRegister(
  walletAddress: string,
  signature: string,
  message: string,
) {
  const response = await axiosInstance.post<UserProfile>(
    "/auth/authenticate/",
    {
      address: walletAddress,
      signature,
      message,
    },
  )

  response.data.username = response.data.username ?? `User${response.data?.pk}`

  return response.data
}

export async function newLoginApi(
  address: Address,
  signature: string,
  nonce: string,
) {
  const response = await axiosInstance.post<UserProfile>(
    "/auth/verify-wallet/",
    {
      address,
      signature,
      nonce,
    },
  )

  return response.data
}

export async function getUserProfileWithTokenAPI(token: string) {
  const response = await axiosInstance.get<UserProfile>(`/auth/info/`, {
    headers: {
      Authorization: resolveUserTokenMethod(token),
    },
  })

  response.data.username = response.data.username ?? `User${response.data?.pk}`
  return response.data
}

export async function sponsorAPI(address: string) {
  const response = await axiosInstance.post("/api/auth/user/sponsor/", {
    address: address,
  })
  return response.data
}

export async function setWalletAPI(
  token: string,
  wallet: string,
  walletType: string,
  message: string,
  signedMessage: string,
) {
  const response = await axiosInstance.post(
    "/api/auth/user/wallets/",
    {
      walletType: walletType,
      address: wallet,
      signature: signedMessage,
      message,
    },
    {
      headers: {
        Authorization: resolveUserTokenMethod(token),
      },
    },
  )
  return response.data
}

export const setUsernameApi = async (username: string) => {
  const response = await axiosInstance.put(
    "/auth/info/",
    {
      username,
    },
    {
      headers: {},
    },
  )

  return response.data
}

export const deleteWalletApi = async (userToken: string, walletId: number) => {
  const response = await axiosInstance.delete(
    "/api/auth/user/wallets/" + walletId,
    {
      headers: {
        Authorization: `token ${userToken}`,
      },
    },
  )

  return response.data
}

export const connectGitCoinPassport = async (address: string) => {
  const response = await axiosInstance.post(
    "api/auth/user/connect/gitcoin-passport/",
    {
      userWalletAddress: address,
    },
  )

  return response.data
}

export const connectDynamicConnection = async (
  connectionName: string,
  address: string,
) => {
  const response = await axiosInstance.post(
    "api/auth/user/connect/" + connectionName + "/",
    {
      userWalletAddress: address,
    },
  )

  return response.data
}

export const getTwitterOAuthUrlApi = async () => {
  const res = await axiosInstance.get("/api/auth/twitter/")

  return res.data.url as string
}

export const verifyTwitterApi = async (
  oauthToken: string,
  oauthVerifier: string,
) => {
  const res = await axiosInstance.get(`/api/auth/twitter/callback/`, {
    params: {
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken,
    },
  })

  return res.data
}

export const fetchMessageToSign = async (address: Address) => {
  const res = await axiosInstance.post("/auth/create-message/", {
    address,
  })

  return res.data
}
