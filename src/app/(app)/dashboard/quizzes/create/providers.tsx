"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import { useForm, Control, UseFormWatch } from "react-hook-form"
import { NullCallback } from "@/utils"
import { createQuizApi } from "@/utils/api/quiztap"
import {
  DateValue,
  CalendarDateTime,
  today,
  Time,
} from "@internationalized/date"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export type QuizCreateContextType = {
  control?: Control<any, any>
  submit: () => void
  activeQuestionIndex: number
  watch?: UseFormWatch<any>
  setActiveQuestionIndex: (value: number) => void
  forceRefresh?: boolean
  setForceRefresh: () => void
  loading: boolean
  errors?: any
}

export const quizValidation = z.object({
  title: z.string(),
  details: z.string().optional(),
  prizeAmount: z.number(),
  emailUrl: z.string().email(),
  telegramUrl: z.string().url({ message: "Invalid Telegram url" }),
  date: z.any({}),
  time: z.any({}),
  token: z.string(),
  questions: z
    .array(
      z
        .object(
          {
            text: z.string(),
            number: z.number(),
            choices: z.array(
              z.object({
                text: z.string(),
                isCorrect: z.boolean(),
                isHintChoice: z.boolean(),
              }),
            ),
          },
          {},
        )
        .refine(
          (question) => {
            const correctChoices = question.choices.filter(
              (choice) => choice.isCorrect,
            ).length
            const hintChoices = question.choices.filter(
              (choice) => choice.isHintChoice,
            ).length
            return correctChoices === 1 && hintChoices === 2
          },
          {
            message:
              "Each question must have exactly 1 correct choice and 2 hinted choices.",
          },
        ),
    )
    .min(4, { message: "Enter at least 4 questions" }),
  hintCount: z.number().min(0),
  chainId: z.number(),
  tokenAddress: z.string(),
})

type QuizCreateSchema = z.infer<typeof quizValidation>

export const QuizCreateContext = createContext<QuizCreateContextType>({
  submit: NullCallback,
  setActiveQuestionIndex: NullCallback,
  activeQuestionIndex: -1,
  setForceRefresh: NullCallback,
  loading: false,
})

export const useQuizCreateContext = () => useContext(QuizCreateContext)

export default function QuizCreateProvider({ children }: PropsWithChildren) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<QuizCreateSchema>({
    defaultValues: {
      title: "Quiz Title",
      details: "Quiz details",
      questions: [],
      token: "USDC",
      hintCount: 1,
      prizeAmount: 12.12,
      date: today("utc") as DateValue,
      time: new Time(11, 45),
      chainId: 10,
      tokenAddress: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
      emailUrl: "",
      telegramUrl: "",
    },
    resolver: zodResolver(quizValidation),
  })

  const [forceRefresh, setForceRefresh] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onCreateQuiz = async (
    data: QuizCreateSchema & { startAt?: string },
  ) => {
    const date = data.date as DateValue
    const time = data.time as Time

    const startAt = new CalendarDateTime(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
      0,
      0,
    ).toDate("utc")

    // if (startAt.getTime() < new Date().getTime()) {
    //   toast.error("Start at")
    // }

    data.startAt = startAt.toISOString()

    data.prizeAmount *= 10 ** 18

    setLoading(true)
    try {
      const res = await createQuizApi(data)

      console.log(res)

      toast.success("Quiz created successfully")
      router.push("/dashboard/quizzes")
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <QuizCreateContext.Provider
      value={{
        submit: handleSubmit(onCreateQuiz),
        control,
        setActiveQuestionIndex,
        activeQuestionIndex,
        watch,
        forceRefresh,
        setForceRefresh: () => setForceRefresh(!forceRefresh),
        loading,
        errors,
      }}
    >
      {children}
    </QuizCreateContext.Provider>
  )
}
