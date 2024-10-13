"use client"

import Icon from "@/components/ui/Icon"
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
          <h3 className="text-center">Winners List</h3>

          <span className="mt-5 h-80 inline-flex gap-4 flex-col overflow-y-auto text-sm p-2 md:p-5 rounded-lg">
            {winners.map((item, key) => (
              <span
                key={key}
                className="px-4 w-52 justify-center tracking-widest py-3 inline-flex gap-10 items-center text-gray100 font-sans rounded-xl bg-gray60"
              >
                {shortenAddress(item.userProfile_WalletAddress)}
              </span>
            ))}
            {!!winners.length || (
              <p className="text-center text-gray90">
                There were no winners for this quiz
              </p>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default QuizFinished
