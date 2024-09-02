"use client"

import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import logger from "@/core/logger"
import { getRandomItem } from "@/utils/random"
import { FC, useMemo } from "react"

const isArrayEqual = (array1: any[], array2: any[]) => {
  if (array1.length !== array2.length) return false

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) return false
  }

  return true
}

const correctTitles = ["Nailed it!", "Correct!", "Spot on!", "Nice job!"]
const wrongAnswers = [
  "Oops!",
  "Wrong answer!",
  "dang it!",
  "better luck next time!",
]

const RestTime: FC<{}> = () => {
  const {
    timer,
    userAnswersHistory,
    answersHistory,
    stateIndex,
    previousRoundLosses,
  } = useQuizContext()

  const totalSeconds = Math.floor(timer / 1000)
  const seconds = totalSeconds % 60

  const isWonLastQuestion = useMemo(() => {
    return (
      answersHistory.length === userAnswersHistory.length &&
      answersHistory.at(-1) == userAnswersHistory.at(-1)
    )
  }, [answersHistory, userAnswersHistory])

  const didAnswerLastQuestion = useMemo(() => {
    return (
      answersHistory.length === userAnswersHistory.length &&
      userAnswersHistory.length === stateIndex
    )
  }, [answersHistory, userAnswersHistory])

  const title = useMemo(
    () => getRandomItem(isWonLastQuestion ? correctTitles : wrongAnswers),
    [isWonLastQuestion]
  )

  if (answersHistory[stateIndex - 1] === null) {
    return (
      <div className="mt-10 text-center">
        <p className="text-lg font-semibold text-white">
          Processing the results....
        </p>

        <p className="mt-5 text-gray100"></p>
        <p className="mt-3 text-sm text-gray90">
          Next Questions in {seconds} seconds...
        </p>
      </div>
    )
  }

  if (!didAnswerLastQuestion) {
    return (
      <div className="mt-10 text-center">
        <Icon
          iconSrc="/assets/images/quizTap/spaceman-spectate.svg"
          alt="spaceman like"
          width="800px"
          height="200px"
        />

        <p className="-mt-5 text-gray100">
          <strong className="text-white underline">
            {previousRoundLosses}
          </strong>{" "}
          <span>players got Knocked out.</span>
        </p>
        <p className="mt-3 text-gray90">
          Next Questions in {seconds} seconds...
        </p>
      </div>
    )
  }

  if (isWonLastQuestion) {
    return (
      <div className="mt-10 relative text-center">
        <Icon
          iconSrc="/assets/images/quizTap/like-hand.svg"
          alt="spaceman like"
          width="183"
          className="absolute w-20 md:w-48 right-0 top-1/2 -translate-y-1/2 opacity-30"
          height="176"
        />
        <Icon
          iconSrc="/assets/images/quizTap/like-hand-left.svg"
          alt="spaceman like"
          width="183"
          className="absolute w-20 md:w-48 left-0 top-1/2 -translate-y-1/2 opacity-30"
          height="176"
        />
        <Icon
          iconSrc="/assets/images/quizTap/spaceman-like.png"
          alt="spaceman like"
          width="68px"
          height="68px"
        />
        <p className="text-lg font-semibold text-space-green">{title}</p>

        <p className="mt-5 text-gray100">
          <strong className="text-white underline">
            {previousRoundLosses}
          </strong>{" "}
          <span>people lost the game in the previous round</span>
        </p>
        <p className="mt-3 text-gray90">
          Next Questions in {seconds} seconds...
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10 text-center">
      <Icon
        iconSrc="/assets/images/quizTap/spaceman-like.png"
        alt="spaceman like"
        width="100px"
        height="100px"
      />
      <p className="text-lg font-semibold text-error">{title}</p>

      <p className="mt-5 text-gray100">
        <strong className="text-white underline">{previousRoundLosses}</strong>{" "}
        <span>people lost the game in the previous round.</span>
      </p>
      <p className="mt-3 text-gray90">Next Questions in {seconds} seconds...</p>
    </div>
  )
}

export default RestTime
