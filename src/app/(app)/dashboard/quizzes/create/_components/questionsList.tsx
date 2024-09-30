"use client"

import { FC, Fragment, useEffect, useRef } from "react"
import { useQuizCreateContext } from "../providers"
import { useController } from "react-hook-form"
import { Question } from "@/types"
import { ReactSortable, Sortable } from "react-sortablejs"

const QuestionsList = () => {
  const { control, setActiveQuestionIndex, setForceRefresh } =
    useQuizCreateContext()
  const {
    field: { value, onChange },
  } = useController({
    control: control!,
    name: "questions",
  })

  return (
    <div className="mt-10 px-2">
      <div className="border-2 border-gray50 min-w-72 w-fit md:w-full rounded-xl flex justify-center overflow-x-auto font-semibold bg-gray20/30 p-3">
        <ReactSortable
          list={value}
          setList={(value) => {
            setForceRefresh()
            onChange([...value.filter((val) => !!val)])
          }}
          // setData={onChange}
          className="flex gap-4 justify-center"
        >
          {value
            .filter((item: Question) => !!item)
            .sort((a: Question, b: Question) => a.number - b.number)
            .map((question: Question, index: number) => (
              // <Fragment>
              <div key={question.number}>
                <QuestionItem index={index + 1} />
              </div>
              // <Separator index={index + 1} />
              // </Fragment>
            ))}
        </ReactSortable>
        <button
          onClick={() => {
            onChange([
              ...(value ?? []),
              {
                text: `Question Number ${value.length + 1}`,
                number: value.length + 1,
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
          className={`relative ml-4 grid h-9 w-9 min-w-9 min-h-9 place-content-center rounded-lg border-2 border-dashed border-gray80 bg-gray20 text-gray100`}
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
