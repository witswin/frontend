import { useEffect, useState } from "react"

export const setCookie = (key: string, value: string) => {
  if (process.env.NODE_ENV === "development")
    document.cookie = `${key}=${value}; Path=/;`
  else document.cookie = `${key}=${value}; Path=/; secure`
}

const useLocalStorageState = (
  key: string
): [string | null, (token: string) => void] => {
  const [userToken, setUserToken] = useState<string | null>(null)

  useEffect(() => {
    const storedUserToken = localStorage.getItem(key)
    if (storedUserToken) setUserToken(storedUserToken)
  }, [key])

  const setToken = (token: string) => {
    setUserToken(token)
    localStorage.setItem(key, token)
    setCookie(key, token)
  }

  return [userToken, setToken]
}

export default useLocalStorageState
