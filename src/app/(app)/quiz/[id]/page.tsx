"use client"

import Icon from "@/components/ui/Icon"
import Timer from "./components/timer"
import QuestionsList from "./components/questionsList"
import WaitingIdle from "./components/waitingIdle"
import {
  restPeriod,
  seeResultDuration,
  useQuizContext,
} from "@/context/quizProvider"
import QuestionPrompt from "./components/questionPrompt"
import RestTime from "./components/restTime"
import QuizFinished from "./components/finished"
import { useEffect, useState } from "react"
import LoseModal from "./components/modals/loseModal"
import WinnerModal from "./components/modals/winnerModal"

const QuizItemPage = () => {
  const {
    hint,
    stateIndex,
    ping,
    timer,
    isRestTime,
    socketInstance,
    question,
    hintData,
    wrongAnswersCount,
  } = useQuizContext()

  const [isLoading, setIsLoading] = useState(false)

  const className =
    ping <= 100 ? "bg-space-green" : ping <= 300 ? "bg-yellow-500" : "bg-error"

  return (
    <div className="quiz-main-wrapper relative w-full">
      <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
        <div className="mt-5 flex pt-16 md:pt-0 flex-col md:flex-row gap-y-5 items-center justify-end px-5">
          {/* <p className="text-[#997EA4]">Quiz</p> */}
          <Timer
            timer={timer}
            includeMinutes={stateIndex <= 0}
            isRestTime={isRestTime}
          />

          <button
            onClick={() => {
              setIsLoading(true)
              socketInstance?.send(
                JSON.stringify({
                  command: "GET_HINT",
                  args: {
                    question_id: question?.id,
                  },
                })
              )

              setTimeout(() => {
                setIsLoading(false)
              }, 1000)
            }}
            disabled={
              isLoading ||
              hint <= 0 ||
              stateIndex <= 0 ||
              isRestTime ||
              hintData?.questionId === question?.id ||
              wrongAnswersCount > 0
            }
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
            <span className="ml-2 border-l-2 border-gray70 py-1 pl-2">
              {hint}
            </span>
          </button>
        </div>

        <QuestionsList />

        <RenderQuizItemBody />
        <LoseModal />
        <WinnerModal />

        <div className="text-right text-sm mt-20">
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
        </div>
      </main>
    </div>
  )
}

const RenderQuizItemBody = () => {
  const { stateIndex, isRestTime, finished, timer, quiz } = useQuizContext()

  if (
    finished ||
    (quiz?.questions.length === stateIndex &&
      isRestTime &&
      timer < restPeriod - seeResultDuration)
  )
    return <QuizFinished />

  if (stateIndex <= 0) {
    return <WaitingIdle />
  }

  if (isRestTime && timer < restPeriod - seeResultDuration) return <RestTime />

  return <QuestionPrompt />
}

export default QuizItemPage
