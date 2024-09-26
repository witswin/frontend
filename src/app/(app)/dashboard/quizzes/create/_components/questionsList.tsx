"use client"

import { FC, Fragment, useEffect, useRef } from "react"
import { useQuizCreateContext } from "../providers"
import { useController } from "react-hook-form"
import { Question } from "@/types"

const QuestionsList = () => {
  const { control, setActiveQuestionIndex } = useQuizCreateContext()
  const {
    field: { value, onChange },
  } = useController({
    control: control!,
    name: "questions",
  })

  return (
    <div className="mt-10 px-2 max-w-[48rem]">
      <div className="flex font-semibold overflow-x-auto  min-w-72 w-fit md:w-full justify-center rounded-xl border-2 border-gray50 bg-gray20/30 p-3">
        {value?.map((question: Question, index: number) => (
          <Fragment key={index}>
            <QuestionItem index={index + 1} />
            <Separator index={index + 1} />
          </Fragment>
        ))}

        <button
          onClick={() => {
            onChange([
              ...(value ?? []),
              {
                text: `Question Sample text`,
                choices: [
                  { text: "Choice 1", isCorrect: true, isHintChoice: false },
                  { text: "Choice 2", isCorrect: false, isHintChoice: true },
                  { text: "Choice 3", isCorrect: false, isHintChoice: true },
                  { text: "Choice 4", isCorrect: false, isHintChoice: false },
                ],
              },
            ])
            setActiveQuestionIndex(value?.length ?? 0)
          }}
          className={`relative grid h-9 w-9 min-w-9 min-h-9 place-content-center rounded-lg border-2 border-dashed border-gray80 bg-gray20 text-gray100`}
        >
          +
        </button>
      </div>
    </div>
  )
}

const Separator: FC<{ index: number }> = ({ index }) => {
  const width = 28

  return (
    <div className="relative mx-2 my-auto h-[2px] min-w-7 w-7 rounded-2xl bg-gray50">
      <div
        className="absolute bottom-0 left-0 top-0 rounded-2xl h-[2px] bg-gray80"
        style={{ width, minWidth: width }}
      ></div>
    </div>
  )
}

const QuestionItem: FC<{ index: number }> = ({ index }) => {
  const { setActiveQuestionIndex, activeQuestionIndex } = useQuizCreateContext()

  return (
    <button
      onClick={setActiveQuestionIndex.bind(null, index - 1)}
      className={`relative transition-colors grid h-9 w-9 min-w-9 min-h-9 place-content-center rounded-lg border-2 ${activeQuestionIndex === index - 1 ? "border-primary" : "border-gray100"} bg-gray20 text-gray100`}
    >
      {index}
    </button>
  )
}

export default QuestionsList
