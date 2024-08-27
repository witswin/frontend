"use client"

import { useState, useRef } from "react"

const baseUnitTime = 1000 // ms
const FPS = 60
export const useNumberLinearInterpolate = ({
  initial,
  duration,
  isInt = false, // Default to false if not specified
}: {
  initial: number
  duration: number
  isInt?: boolean
}) => {
  const [number, setNumber] = useState(initial)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const onChange = (value: number) => {
    const isIncreamentMode = value > number

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const frames = (duration * FPS) / baseUnitTime
    const increment = (value - number) / frames

    intervalRef.current = setInterval(() => {
      setNumber((prevNumber) => {
        let nextNumber = prevNumber + increment

        if (isIncreamentMode) {
          nextNumber = Math.round(nextNumber)
        } else {
          nextNumber = Math.floor(nextNumber)
        }

        if (
          (increment > 0 && nextNumber >= value) ||
          (increment < 0 && nextNumber <= value)
        ) {
          clearInterval(intervalRef.current!)
          return isInt
            ? isIncreamentMode
              ? Math.round(value)
              : Math.floor(value)
            : value
        }

        return nextNumber
      })
    }, baseUnitTime / FPS)
  }

  return {
    value: number,
    onChange,
  }
}
