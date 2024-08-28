import { useEffect, useMemo, useState } from "react"

export const useTimer = (deadline?: any) => {
  const [now, setNow] = useState(new Date())

  const diff = useMemo(() => {
    if (!deadline) return 0

    const res = new Date(deadline).getTime() - now.getTime()

    return res < 0 ? 0 : res
  }, [deadline, now])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const diffAsSeconds = diff / 1000

  return {
    diff,
    seconds: Math.floor(diffAsSeconds % 60),
    minutes: Math.floor((diffAsSeconds / 60) % 60),
    hours: Math.floor(diffAsSeconds / 3600),
    days: Math.floor(diffAsSeconds / (3600 * 24)),
  }
}
