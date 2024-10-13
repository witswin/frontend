"use client"

import Icon from "@/components/ui/Icon"

import Link from "next/link"
import { FC } from "react"
import TextInput from "./text-input"
import { useQuizCreateContext } from "../providers"
import { DateInput, TimeInput } from "@nextui-org/react"
import { Controller } from "react-hook-form"

const QuizTapSidebar: FC = () => {
  const { control } = useQuizCreateContext()

  return (
    <aside className="quiz-sidebar flex md:w-72 flex-col gap-1 rounded-2xl p-1">
      <div className="flex flex-col md:flex-row items-center justify-between rounded-lg bg-gray10 p-5">
        <p className="text-gray100">Lives</p>

        <div className="flex items-center gap-4">
          <span className="text-lg">1</span>

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
          <p>Quiz Execution Date</p>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DateInput
                aria-label="date"
                variant="underlined"
                className="mt-2"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="time"
            render={({ field }) => (
              <TimeInput
                aria-label="time"
                variant="underlined"
                value={field.value}
                onChange={field.onChange}
                className="mt-2"
              />
            )}
          />
        </div>
      </div>
      <div className="mt-1 flex justify-between rounded-lg bg-gray10 p-5">
        <div className="text-gray100">
          <p>Total Prize</p>

          <div className="mt-2 inline-flex items-center gap-2">
            <TextInput
              className="font-bold !w-14"
              control={control!}
              name="prizeAmount"
              type="number"
            />
            <span className={`transition-colors text-space-green`}>USDC</span>
          </div>
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
      <div className="mt-0 md:mt-auto justify-self-end rounded-2xl bg-gray10 p-3">
        <Icon
          className="mx-auto w-48"
          iconSrc="/assets/images/quizTap/sponsored.png"
          alt="health"
        />
        <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-3">
          {/* {quiz?.sponsors.map((sponsor, key) => (
            <Link href={sponsor.link} key={key} target="_blank">
              <Icon
                className="h-5 w-5 grayscale"
                iconSrc={sponsor.image}
                alt={sponsor.name}
              />
            </Link>
          ))} */}

          <button
            className={`relative ml-4 grid h-9 w-9 min-w-9 min-h-9 place-content-center rounded-lg border-2 border-dashed border-gray80 bg-gray20 text-gray100`}
          >
            +
          </button>
        </div>
      </div>
    </aside>
  )
}

export default QuizTapSidebar
