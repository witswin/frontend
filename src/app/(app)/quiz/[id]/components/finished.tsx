"use client"

import { useQuizContext } from "@/context/quizProvider"
import { FC } from "react"

const QuizFinished: FC<{}> = () => {
  const { timer, previousQuestion, userAnswersHistory } = useQuizContext()

  return (
    <div className="mt-10 text-center ">
      <p className="font-bold">Quiz is Finished</p>
      <div className="mt-3">Waiting for results to be calculated</div>
    </div>
  )
}

export default QuizFinished
