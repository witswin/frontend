"use client"

import { useQuizContext } from "@/context/quizProvider"

export default function QuizPing() {
  const { ping } = useQuizContext()

  const className =
    ping <= 100 ? "bg-space-green" : ping <= 300 ? "bg-yellow-500" : "bg-error"

  return (
    <span className="px-2 py-1 rounded-lg bg-gray30 border border-gray70 shadow-lg inline-flex items-end space-x-2">
      <div className="flex gap-1 items-end">
        <div
          className={`${ping !== -1 && ping <= 500 ? className : "bg-gray100"} w-1 rounded h-2`}
        ></div>
        <div
          className={`${ping !== -1 && ping <= 400 ? className : "bg-gray100"} w-1 rounded h-3`}
        ></div>
        <div
          className={`${ping !== -1 && ping <= 200 ? className : "bg-gray100"} w-1 rounded h-4`}
        ></div>
        <div
          className={`${ping !== -1 && ping <= 100 ? className : "bg-gray100"} w-1 rounded h-5`}
        ></div>
      </div>
      {ping === -1 ? (
        <p className="text-xs text-gray100">Reconnecting</p>
      ) : (
        <p className="text-sm text-gray100">
          {ping} <span className="text-xs">ms</span>
        </p>
      )}
    </span>
  )
}
