import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { Hint } from "@/types"
import { useState } from "react"

export default function HintItems() {
  const {
    stateIndex,
    isRestTime,
    socketInstance,
    question,
    hintData,
    wrongAnswersCount,
    userCompetition,
  } = useQuizContext()

  const [isLoading, setIsLoading] = useState(false)

  const hints = userCompetition?.registeredHints.reduce(
    (prev, curr) => {
      if (prev[curr.type]) {
        prev[curr.type].count += 1
      } else {
        prev[curr.type] = {
          ...curr,
          count: 1,
        }
      }
      return prev
    },
    {} as Record<string, Hint & { count: number }>,
  )

  return Object.values(hints || {}).map((hint, key) => (
    <button
      key={key}
      onClick={() => {
        setIsLoading(true)
        socketInstance?.send(
          JSON.stringify({
            command: "GET_HINT",
            args: {
              questionId: question?.id,
              hintType: hint.type,
              hintId: hint.id,
            },
          }),
        )

        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }}
      disabled={
        isLoading ||
        hint.count <= 0 ||
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
        iconSrc={hint.icon!}
        width="20px"
        height="20px"
      />
      <span className="py-1">{hint.title}</span>
      <span className="ml-2 border-l-2 border-gray70 py-1 pl-2">
        {hint.count}
      </span>
    </button>
  ))
}
