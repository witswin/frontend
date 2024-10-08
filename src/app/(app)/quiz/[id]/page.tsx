"use client"

import Timer from "./components/timer"
import QuestionsList from "./components/questionsList"
import WaitingIdle from "./components/waitingIdle"
import { seeResultDuration, useQuizContext } from "@/context/quizProvider"
import QuestionPrompt from "./components/questionPrompt"
import RestTime from "./components/rest-time"
import QuizFinished from "./components/finished"
import LoseModal from "./components/modals/loseModal"
import WinnerModal from "./components/modals/winnerModal"
import HintItems from "./components/hint-items"
import QuizPing from "./components/quiz-ping"

const QuizItemPage = () => {
  const { stateIndex, timer, isRestTime } = useQuizContext()

  return (
    <div className="quiz-main-wrapper relative w-full">
      <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
        <div className="mt-5 gap-2 flex pt-16 md:pt-0 flex-col md:flex-row gap-y-5 items-center justify-end px-5">
          <Timer
            timer={timer}
            includeMinutes={stateIndex <= 0}
            isRestTime={isRestTime}
          />
        </div>
        <div className="mt-12 gap-2 flex flex-col md:flex-row gap-y-5 items-center justify-end px-5">
          <HintItems />
        </div>

        <QuestionsList />

        <RenderQuizItemBody />
        <LoseModal />
        <WinnerModal />

        <div className="text-right text-sm mt-20">
          <QuizPing />
        </div>
      </main>
    </div>
  )
}

const RenderQuizItemBody = () => {
  const { stateIndex, isRestTime, finished, timer, quiz, restPeriod } =
    useQuizContext()

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
