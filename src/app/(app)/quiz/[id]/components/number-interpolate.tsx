"use client"
import { FC } from "react"

const NumberEasing = require("react-number-easing").default

const NubmerInterpolate: FC<{
  value: number
  speed?: number
  decimals?: number
}> = ({ decimals = 0, speed = 300, value }) => {
  return (
    <NumberEasing
      value={value}
      speed={speed}
      decimals={decimals}
      ease="quintInOut"
    />
  )
}

export default NubmerInterpolate
