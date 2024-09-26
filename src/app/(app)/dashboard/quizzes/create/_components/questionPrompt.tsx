"use client"

import Icon from "@/components/ui/Icon"
import { FC, useEffect, useState } from "react"
import { useController } from "react-hook-form"
import { useQuizCreateContext } from "../providers"
import { Choice, Question } from "@/types"
import TextInput from "./text-input"
import { Checkbox } from "@nextui-org/react"

const QuestionPrompt: FC = () => {
  const { control, setActiveQuestionIndex, activeQuestionIndex } =
    useQuizCreateContext()
  const {
    field: { value, onChange },
  } = useController({
    control: control!,
    name: "questions",
  })

  const question: Question & { choices: Choice[] } = value[activeQuestionIndex]

  if (!question) return null

  return (
    <div className="mt-10">
      <h3 className="text-base gap-2 flex items-center font-normal">
        <span>{activeQuestionIndex + 1} </span>
        <span> - </span>
        <TextInput
          size="large"
          control={control!}
          name={`questions.${activeQuestionIndex}.text`}
        />
      </h3>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 font-semibold">
        {question?.choices.map((item, key) => (
          <QuestionChoice index={item.id} choiceIndex={key} key={key} />
        ))}
      </div>
    </div>
  )
}

export const indexesToABC: Record<number, string> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
}

const QuestionChoice: FC<{
  index: number
  disabled?: boolean
  choiceIndex: number
}> = ({ index, disabled, choiceIndex }) => {
  const { activeQuestionIndex, control, watch } = useQuizCreateContext()

  return (
    <div
      className={`relative flex items-center rounded-xl pl-16 border-2 border-gray40 bg-gray20 py-3 text-center text-white transition-colors `}
    >
      <TextInput
        control={control!}
        name={`questions.${activeQuestionIndex}.choices.${choiceIndex}.text`}
      />

      <span className="text-xs w-32 mr-2 flex flex-col gap-2 font-normal">
        <Checkbox
          isDisabled={watch?.(
            `questions.${activeQuestionIndex}.choices.${choiceIndex}.isHintChoice`,
          )}
          size="sm"
          {...control!.register(
            `questions.${activeQuestionIndex}.choices.${choiceIndex}.isCorrect`,
          )}
        >
          Is Correct
        </Checkbox>
        <Checkbox
          isDisabled={watch?.(
            `questions.${activeQuestionIndex}.choices.${choiceIndex}.isCorrect`,
          )}
          size="sm"
          {...control!.register(
            `questions.${activeQuestionIndex}.choices.${choiceIndex}.isHintChoice`,
          )}
        >
          Is Hint
        </Checkbox>
      </span>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray70">
        <Icon
          iconSrc="/assets/images/quizTap/shift.png"
          width="16px"
          height="16px"
          alt="shift"
        />
        <span>{indexesToABC[choiceIndex + 1]}</span>
      </div>
    </div>
  )
}

export default QuestionPrompt
