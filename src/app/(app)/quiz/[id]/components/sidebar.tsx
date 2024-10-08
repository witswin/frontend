"use client"

import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { useNumberLinearInterpolate } from "@/utils/interpolate"
import Link from "next/link"
import { FC, useEffect } from "react"
import NubmerInterpolate from "./number-interpolate"
import { fromWei, toWei } from "@/utils"

const QuizTapSidebar: FC = () => {
  const {
    totalParticipantsCount,
    remainingPeople,
    amountWinPerUser,
    quiz,
    wrongAnswersCount,
  } = useQuizContext()

  const isUserLost = wrongAnswersCount > 0

  return (
    <aside className="quiz-sidebar flex md:w-72 flex-col gap-1 rounded-2xl p-1">
      <div className="flex flex-col md:flex-row items-center justify-between rounded-lg bg-gray10 p-5">
        <p className="text-gray100">Lives</p>

        <div className="flex items-center gap-4">
          <span className="text-lg">{Math.max(1 - wrongAnswersCount, 0)}</span>

          <Icon
            width="30px"
            height="30px"
            iconSrc="/assets/images/quizTap/quiz-health.png"
            alt="health"
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between rounded-lg bg-gray10 p-5">
        <div className="text-gray100">
          <p>Number of Players</p>

          <p className="mt-2">
            <strong className="text-white">
              <NubmerInterpolate value={remainingPeople} />
            </strong>{" "}
            / {totalParticipantsCount}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Icon
            width="35px"
            height="35px"
            iconSrc="/assets/images/quizTap/people.png"
            alt="health"
          />
        </div>
      </div>
      <div className="mt-1 flex justify-between rounded-lg bg-gray10 p-5">
        <div className="text-gray100">
          <p>Your Prize so Far</p>

          <p className="mt-2">
            <strong className="text-white">
              <NubmerInterpolate
                value={
                  isUserLost
                    ? 0
                    : Number(fromWei(amountWinPerUser, quiz?.tokenDecimals))
                }
                decimals={2}
              />
            </strong>{" "}
            <span
              className={`transition-colors ${isUserLost ? "text-error" : "text-space-green"}`}
            >
              {quiz?.token}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Icon
            width="35px"
            height="35px"
            iconSrc="/assets/images/quizTap/prize.png"
            alt="health"
          />
        </div>
      </div>
      <div className="mt-3"></div>
      {!!quiz?.sponsors.length && (
        <div className="mt-0 md:mt-auto justify-self-end rounded-2xl bg-gray10 p-3">
          <Icon
            className="mx-auto w-48"
            iconSrc="/assets/images/quizTap/sponsored.png"
            alt="health"
          />
          <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3">
            {quiz?.sponsors.map((sponsor, key) => (
              <Link href={sponsor.link} key={key} target="_blank">
                <Icon
                  className="h-5 w-5 grayscale"
                  iconSrc={sponsor.image}
                  alt="polygon"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default QuizTapSidebar
