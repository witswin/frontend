import { useCallback, useEffect, useRef, useState } from "react"
import { NullCallback } from ".."
import { useUserProfileContext } from "@/context/userProfile"

export const useSocket = ({
  basePath,
  reconnectInterval = 1000,
  onMessageEnter,
  enablePing,
  deps = [],
}: {
  enablePing?: boolean
  basePath: string
  reconnectInterval?: number
  onMessageEnter?: (data: any) => void
  deps?: any[]
}) => {
  const socket = useRef<{ client: WebSocket | null }>({ client: null })

  const [ping, setPing] = useState(-1)

  const { userToken } = useUserProfileContext()

  useEffect(() => {
    if (!socket.current.client) return

    socket.current.client.onmessage = (e) => {
      if (e.data === "PONG") {
        // const now = new Date()
        // const timePassed = previousPing
        //   ? now.getTime() - previousPing.getTime()
        //   : -1
        // setPing(timePassed)
      } else {
        const data = JSON.parse(e.data)
        console.log(data)
        onMessageEnter?.(data)
      }
    }
  }, [onMessageEnter, ping])

  useEffect(() => {
    let isMounted = true

    let interval: NodeJS.Timeout | undefined
    let reconnectTimeout: NodeJS.Timeout | undefined
    let previousPing: Date | null = null

    let socketUrl = process.env.NEXT_PUBLIC_WS_URL! + basePath

    if (userToken) {
      socketUrl += `?auth=${userToken}`
    }

    const initializeWebSocket = () => {
      if (!isMounted) return

      socket.current.client = new WebSocket(socketUrl)

      socket.current.client.onopen = () => {
        if (enablePing) {
          previousPing = new Date()
          socket.current.client?.send(JSON.stringify({ command: "PING" }))
          interval = setInterval(() => {
            try {
              previousPing = new Date()
              socket.current.client?.send(JSON.stringify({ command: "PING" }))
            } catch (error) {
              reconnect()
            }
          }, 3000)
        }
      }
      socket.current.client.onmessage = (e) => {
        if (e.data === "PONG") {
          // const now = new Date()
          // const timePassed = previousPing
          //   ? now.getTime() - previousPing.getTime()
          //   : -1
          // setPing(timePassed)
        } else {
          const data = JSON.parse(e.data)
          console.log(data)
          onMessageEnter?.(data)
        }
      }
      socket.current.client.onclose = (e) => {
        if (isMounted) reconnect()
        setPing(-1)
      }
    }

    const reconnect = () => {
      if (interval) clearInterval(interval) // Clear the existing interval before reconnecting
      if (reconnectTimeout) clearTimeout(reconnectTimeout) // Clear the existing timeout before setting a new one
      if (socket.current.client) {
        socket.current.client.onclose = () => {} // Prevent the original onclose from firing during reconnect
        socket.current.client.close()
        socket.current.client = null
      }

      reconnectTimeout = setTimeout(() => {
        if (isMounted) {
          initializeWebSocket()
        }
      }, reconnectInterval) // Wait 5 seconds before attempting to reconnect
    }

    initializeWebSocket() // Initialize the WebSocket connection

    return () => {
      isMounted = false
      if (interval) clearInterval(interval) // Clean up the interval
      if (reconnectTimeout) clearTimeout(reconnectTimeout) // Clean up the reconnect timeout
      if (socket.current.client) {
        socket.current.client.onclose = () => {} // Prevent the onclose from firing during cleanup
        socket.current.client.close()
        socket.current.client = null
      }
    }
  }, [basePath, reconnectInterval, userToken, ...deps])

  return {
    socket: socket.current,
    ping,
    sendJson: (data: any) => socket.current.client?.send(JSON.stringify(data)),
  }
}
