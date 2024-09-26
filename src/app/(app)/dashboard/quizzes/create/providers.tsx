"use client"

import { createContext, PropsWithChildren, useContext, useState } from "react"
import { useForm, Control, UseFormWatch } from "react-hook-form"
import { NullCallback } from "@/utils"

export type QuizCreateContextType = {
  control?: Control<any, any>
  submit: () => void
  activeQuestionIndex: number
  watch?: UseFormWatch<any>
  setActiveQuestionIndex: (value: number) => void
}

export const QuizCreateContext = createContext<QuizCreateContextType>({
  submit: NullCallback,
  setActiveQuestionIndex: NullCallback,
  activeQuestionIndex: -1,
})

export const useQuizCreateContext = () => useContext(QuizCreateContext)

export default function QuizCreateProvider({ children }: PropsWithChildren) {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      title: "Quiz Title",
      details: "Quiz details",
      questions: [],
      token: "USDC",
      hintCount: "1",
      prizeAmount: 12.12,
    },
  })

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)

  const onCreateQuiz = async (data: any) => {}

  return (
    <QuizCreateContext.Provider
      value={{
        submit: handleSubmit(onCreateQuiz),
        control,
        setActiveQuestionIndex,
        activeQuestionIndex,
        watch,
      }}
    >
      {children}
    </QuizCreateContext.Provider>
  )
}
