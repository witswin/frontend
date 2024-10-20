"use client"

import Icon from "@/components/ui/Icon"
import { FC } from "react"

const Timer: FC<{
  timer: number
  className?: string
  isRestTime?: boolean
  includeMinutes?: boolean
}> = ({ timer, className, isRestTime, includeMinutes }) => {
  const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000)
    const seconds = totalSeconds % 60
    const minutes = (totalSeconds / 60) % 60
    const milliseconds = time % 60000

    const formattedMilliseconds = String(milliseconds).padStart(2, "0")
    const formattedSeconds = String(seconds).padStart(2, "0")

    return {
      seconds,
      formattedSeconds: formattedSeconds,
      formattedMilliSeconds: formattedMilliseconds.slice(-3, -1),
      minutes: Math.floor(minutes),
      totalSeconds,
    }
  }

  const time = formatTime(timer)

  return (
    <div
      className={`absolute left-1/2 top-5 -translate-x-1/2 rounded-xl border-2 border-gray20 bg-[#1E1E2C33] p-2 ${className ?? ""}`}
    >
      <div
        className={`flex items-center ${time.totalSeconds < 3 && (time.seconds !== 0 || time.formattedMilliSeconds !== "0") ? "timer-blink" : ""} gap-3`}
      >
        <Icon
          alt="timer"
          className="hidden md:inline-block"
          iconSrc="/assets/images/quizTap/timer.png"
          width="30px"
          height="31px"
        />

        <p
          className={`font-digital-numbers text-2xl ${time.totalSeconds > 5 ? "text-white" : time.totalSeconds > 2 ? "text-warn" : "text-error"} `}
        >
          {`${includeMinutes ? `${time.minutes}:` : ""}${time.formattedSeconds}:${time.formattedMilliSeconds}`}
        </p>
      </div>
    </div>
  )
}

export default Timer
