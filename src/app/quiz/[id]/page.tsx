"use client"

import Icon from "@/components/ui/Icon"
import Timer from "./components/timer"
import QuestionsList from "./components/questionsList"
import WaitingIdle from "./components/waitingIdle"
import { useQuizContext } from "@/context/quizProvider"
import QuestionPrompt from "./components/questionPrompt"
import RestTime from "./components/restTime"
import QuizFinished from "./components/finished"

const QuizItemPage = () => {
  const { hint, stateIndex, ping, timer } = useQuizContext()

  const className =
    ping <= 100 ? "bg-space-green" : ping <= 200 ? "bg-yellow-500" : "bg-error"

  return (
    <div className="quiz-main-wrapper relative w-full">
      <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
        <div className="mt-5 flex items-center justify-between px-5">
          <p className="text-[#997EA4]">Quiz</p>
          <Timer timer={timer} />

          <button
            disabled={hint <= 0 || stateIndex <= 0}
            className="flex items-center rounded-xl border-2 border-gray70 bg-gray00 px-2 text-gray100 disabled:opacity-60"
          >
            <Icon
              alt="hint"
              className="py-1 mr-2"
              iconSrc="/assets/images/quizTap/fifty-fifty.png"
              width="20px"
              height="20px"
            />
            <span className="py-1">50% Hint</span>
            <span className="ml-2 border-l-2 border-gray70 py-1 pl-2">1</span>
          </button>
        </div>

        <QuestionsList />

        <RenderQuizItemBody />

        <div className="text-right text-sm mt-20">
          <span className="px-2 py-1 rounded-lg bg-gray30 border border-gray70 shadow-lg inline-flex items-center space-x-2">
            <div className="flex gap-1 items-end">
              <div
                className={`${ping !== -1 && ping < 100 ? className : "bg-gray100"} w-1 rounded h-2`}
              ></div>
              <div
                className={`${ping !== -1 && ping < 200 ? className : "bg-gray100"} w-1 rounded h-3`}
              ></div>
              <div
                className={`${ping !== -1 && ping < 300 ? className : "bg-gray100"} w-1 rounded h-4`}
              ></div>
              <div
                className={`${ping !== -1 && ping < 400 ? className : "bg-gray100"} w-1 rounded h-5`}
              ></div>
            </div>
            {ping === -1 ? (
              <p className="text-xs text-gray100">Reconnecting</p>
            ) : (
              <p className="text-sm text-gray100">{ping}</p>
            )}
          </span>
        </div>
      </main>
    </div>
  )
}

const RenderQuizItemBody = () => {
  const { stateIndex, isRestTime, finished } = useQuizContext()

  return <RestTime />

  if (finished) return <QuizFinished />

  if (stateIndex <= 0) {
    return <WaitingIdle />
  }

  if (isRestTime) return <RestTime />

  return <QuestionPrompt />
}

export default QuizItemPage
