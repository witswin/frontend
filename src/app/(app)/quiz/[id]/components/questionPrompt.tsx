import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { FC, useEffect } from "react"

const QuestionPrompt: FC = () => {
  const {
    stateIndex,
    answerQuestion,
    question: currentQuestion,
    isRestTime,
    hintData,
  } = useQuizContext()

  const question = currentQuestion

  useEffect(() => {
    const questionIndexes = ["A", "B", "C", "D"]
    const onKeyPressed = (e: KeyboardEvent) => {
      if (isRestTime || !question?.isEligible) return
      const selectedKey = e.shiftKey ? e.key.toUpperCase() : e.key

      if (questionIndexes.includes(selectedKey)) {
        answerQuestion(
          question.choices[questionIndexes.indexOf(selectedKey)].id
        )
      }
    }

    document.addEventListener("keypress", onKeyPressed)

    return () => {
      document.removeEventListener("keypress", onKeyPressed)
    }
  }, [answerQuestion, isRestTime, question?.isEligible])

  return (
    <div className="mt-10">
      <h3 className="text-base font-normal">
        {stateIndex} - {question?.text}
      </h3>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 font-semibold">
        {question?.choices.map((item, key) => (
          <QuestionChoice
            disabled={
              hintData?.questionId === question.id &&
              hintData.data.includes(item.id)
            }
            title={item.text}
            index={item.id}
            choiceIndex={key}
            key={key}
          />
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
  title: string
  disabled?: boolean
  choiceIndex: number
}> = ({ index, title, disabled, choiceIndex }) => {
  const {
    answerQuestion,
    activeQuestionChoiceIndex,
    question,
    isRestTime,
    answersHistory,
  } = useQuizContext()

  return (
    <button
      disabled={disabled}
      onClick={() =>
        isRestTime || !question?.isEligible || answerQuestion(index)
      }
      className={`relative rounded-xl border-2 border-gray40 bg-gray20 py-3 text-center text-white transition-colors ${
        question &&
        answersHistory[question.number - 1] &&
        answersHistory[question.number - 1] !== index &&
        activeQuestionChoiceIndex === index
          ? "!border-error !text-error/40 !bg-error/40"
          : ""
      } ${
        question &&
        answersHistory[question.number - 1] === index &&
        activeQuestionChoiceIndex !== -1
          ? "!border-space-green text-space-green !bg-dark-space-green"
          : ""
      } ${activeQuestionChoiceIndex === index ? "!border-gray100 bg-gray60" : ""} ${disabled ? "opacity-20" : ""}`}
    >
      <span>{title}</span>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray70">
        <Icon
          iconSrc="/assets/images/quizTap/shift.png"
          width="16px"
          height="16px"
          alt="shift"
        />
        <span>{indexesToABC[choiceIndex + 1]}</span>
      </div>
    </button>
  )
}

export default QuestionPrompt
