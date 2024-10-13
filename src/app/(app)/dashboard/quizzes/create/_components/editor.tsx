"use client"

import { useQuizCreateContext } from "../providers"
import HintInput from "./hint-input"
import QuestionPrompt from "./questionPrompt"
import QuestionsList from "./questionsList"

const QuizEditor = () => {
  const { forceRefresh } = useQuizCreateContext()
  return (
    <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
      {/* <div className="mt-5 flex pt-16 md:pt-0 flex-col md:flex-row gap-y-5 items-center justify-end px-5">
        <HintInput />
      </div> */}
      <QuestionsList />

      <QuestionPrompt key={Number(forceRefresh)} />
    </main>
  )
}

export default QuizEditor
