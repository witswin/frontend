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

          <span className="mt-5 h-80 overflow-y-auto text-sm bg-gray20 p-5 inline-block rounded-lg">
            {winners.map((item, key) => (
              <span
                key={key}
                className="px-4 py-3 inline-flex gap-10 items-center text-gray100 font-sans rounded-xl bg-gray60"
              >
                {shortenAddress(item)}

                <span className="bg-gray50 border-2 border-gray70 rounded-lg px-4 py-2 text-xs ml-auto text-gray80">
                  Not Claimed by the winner yet
                </span>
              </span>
            ))}
            {!!winners.length || (
              <p className="text-center text-gray90">
                There where no winners for this raffle
              </p>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default QuizFinished
