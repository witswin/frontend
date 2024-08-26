"use client"

import { useQuizContext } from "@/context/quizProvider"
import { shortenAddress } from "@/utils"
import { FC } from "react"

const QuizFinished: FC<{}> = () => {
  const { winners } = useQuizContext()

  return (
    <div className="mt-10 text-center ">
      {winners === null ? (
        <>
          <p className="font-bold">Quiz is Finished</p>
          <div className="mt-3">Waiting for results to be calculated</div>
        </>
      ) : (
        <div>
          <h3 className="text-left">Winners List</h3>

          <div className="mt-5 h-80 overflow-y-auto text-sm bg-gray20 p-5 rounded-lg">
            {winners.map((item, key) => (
              <div
                key={key}
                className="px-4 py-3 rounded-lg border border-gray70 bg-gray30 text-white font-mono"
              >
                {shortenAddress(item)}
              </div>
            ))}
            {!!winners.length || (
              <p className="text-center text-gray90">
                There where no winners for this raffle
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizFinished
