"use client"

import { Competition, QuestionResponse, UserAnswer } from "@/types"
import { NullCallback } from "@/utils"
import {
  fetchQuizApi,
  fetchQuizQuestionApi,
  submitAnswerApi,
} from "@/utils/api"
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useUserProfileContext } from "./userProfile"
import logger from "@/core/logger"

export type QuizContextProps = {
  remainingPeople: number
  quiz?: Competition
  health: number
  hint: number
  question: QuestionResponse | null
  scoresHistory: number[]
  answerQuestion: (answerIndex: number) => void
  timer: number
  stateIndex: number
  activeQuestionChoiceIndex: number | null
  isRestTime: boolean
  setIsRestTime: (value: boolean) => void
  previousQuestion: QuestionResponse | null
  answersHistory: (number | null)[]
  userAnswersHistory: (number | null)[]
  finished: boolean
  totalParticipantsCount: number
  amountWinPerUser: number
  ping: number
  wrongAnswersCount: number
}

export const QuizContext = createContext<QuizContextProps>({
  health: -1,
  hint: -1,
  question: null,
  remainingPeople: -1,
  scoresHistory: [],
  answerQuestion: NullCallback,
  timer: 0,
  stateIndex: -1,
  activeQuestionChoiceIndex: -1,
  isRestTime: false,
  setIsRestTime: NullCallback,
  previousQuestion: null,
  answersHistory: [],
  userAnswersHistory: [],
  finished: false,
  totalParticipantsCount: 0,
  amountWinPerUser: 0,
  ping: -1,
  wrongAnswersCount: 0,
})

export const statePeriod = 15000
export const restPeriod = 5000
const totalPeriod = restPeriod + statePeriod

export const useQuizContext = () => useContext(QuizContext)

const QuizContextProvider: FC<
  PropsWithChildren & { quiz: Competition; userEnrollmentPk: number }
> = ({ children, quiz, userEnrollmentPk }) => {
  const [health, setHealth] = useState(1)
  const [hint, setHint] = useState(1)
  const [remainingPeople, setRemainingPeople] = useState(1)
  const [scoresHistory, setScoresHistory] = useState<number[]>([])
  const [totalParticipantsCount, setTotalParticipantsCount] = useState(1)
  const [amountWinPerUser, setAmountWinPerUser] = useState(quiz.prizeAmount)
  const [finished, setFinished] = useState(false)
  const [question, setQuestion] = useState<QuestionResponse | null>(null)
  const [timer, setTimer] = useState(0)
  const [stateIndex, setStateIndex] = useState(-1)
  const [previousQuestion, setPreviousQuestion] =
    useState<QuestionResponse | null>(null)

  const [ping, setPing] = useState(-1)

  const [answersHistory, setAnswersHistory] = useState<(number | null)[]>(
    Array.from(new Array(quiz.questions.length).fill(null))
  )

  const { userToken } = useUserProfileContext()

  const socket = useRef({ client: null as WebSocket | null })

  const [userAnswersHistory, setUserAnswersHistory] = useState<
    (number | null)[]
  >(Array.from(new Array(quiz.questions.length).fill(null)))

  const [isRestTime, setIsRestTime] = useState(false)

  const startAt = useMemo(() => new Date(quiz.startAt), [quiz.startAt])

  const wrongAnswersCount = useMemo(
    () =>
      userAnswersHistory.filter((item) => !answersHistory.includes(item))
        .length,
    [answersHistory, userAnswersHistory]
  )

  const answerQuestion = useCallback(
    (choiceIndex: number) => {
      userAnswersHistory[question!.number - 1] = choiceIndex

      setUserAnswersHistory([...userAnswersHistory])
    },
    [question, userAnswersHistory]
  )

  const getNextQuestionPk = useCallback(
    (index: number) => {
      const result = quiz.questions.find((item) => item.number === index)?.pk

      return result
    },
    [quiz.questions]
  )

  const recalculateState = useCallback(() => {
    const now = new Date()

    if (startAt > now) {
      return -1
    }

    const timePassed = now.getTime() - startAt.getTime()

    const newState = Math.floor(timePassed / (restPeriod + statePeriod)) + 1

    return newState
  }, [startAt])

  useEffect(() => {
    if (!userToken) return
    let isMounted = true

    let interval: NodeJS.Timeout
    let previousPing: Date | null

    const reconnect = () => {
      socket.current.client?.close()
      socket.current.client = null
      if (!isMounted) return

      socket.current.client = new WebSocket(
        process.env.NEXT_PUBLIC_WS_URL! + "/ws/quiz/" + quiz.id + "/"
      )
    }

    socket.current.client = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL! + "/ws/quiz/" + quiz.id + "/"
    )

    socket.current.client.onopen = () => {
      interval = setInterval(() => {
        try {
          previousPing = new Date()
          socket.current.client?.send(JSON.stringify({ command: "PING" }))
        } catch {
          reconnect()
        }
      }, 3000)

      previousPing = new Date()
      socket.current.client?.send(JSON.stringify({ command: "PING" }))
    }

    socket.current.client.onclose = (e) => {
      logger.log(e)
      reconnect()
      setPing(-1)
    }

    socket.current.client.onmessage = (e) => {
      if (e.data === "PONG") {
        const now = new Date()
        const timePassed = now.getTime() - previousPing!.getTime()
        setPing(timePassed)
        logger.log(timePassed)
      } else {
        const data = JSON.parse(e.data)
        logger.log(data)

        if (data.type === "new_question") {
          setQuestion(
            typeof data.question === "string"
              ? JSON.parse(data.question)
              : data.question
          )
        }

        if (data.type === "answers_history") {
          const answers =
            typeof data.data === "string" ? JSON.parse(data.data) : data.data

          setAnswersHistory(
            answers.map((item: any) =>
              item.selectedChoice.isCorrect ? item.selectedChoice.id : -1
            )
          )
          setUserAnswersHistory(
            answers.map((item: any) => item.selectedChoice.id)
          )
        }
      }
    }

    return () => {
      isMounted = false
      socket.current.client?.close()
      socket.current.client = null
      if (interval) clearInterval(interval)
    }
  }, [userToken])

  const submitUserAnswer = useCallback(async () => {
    const currentQuestionIndex = getNextQuestionPk(stateIndex)

    if (!question?.isEligible) return

    if (
      userAnswersHistory[question.number - 1] !== -1 &&
      currentQuestionIndex !== -1
    ) {
      const currentQuestion = currentQuestionIndex
      const questionNumber = question.number - 1

      const answerRes = await submitAnswerApi(
        currentQuestionIndex!,
        userEnrollmentPk,
        userAnswersHistory[questionNumber]!
      )

      setAnswersHistory((userAnswerHistory) => {
        userAnswerHistory[questionNumber] = answerRes.selectedChoice.isCorrect
          ? answerRes.selectedChoice.id
          : -1

        return [...userAnswerHistory]
      })

      // socket.current.client?.send(
      //   JSON.stringify({
      //     command: "ANSWER",
      //     args: {
      //       question_id: currentQuestionIndex,
      //       selected_choice_id: userAnswersHistory[questionNumber]!,
      //     },
      //   })
      // )
    }
  }, [
    getNextQuestionPk,
    question?.isEligible,
    question?.number,
    stateIndex,
    userAnswersHistory,
    userEnrollmentPk,
  ])

  const fetchFinalResults = useCallback(async () => {
    const res = (await fetchQuizApi(quiz.id)) as Competition & {
      winnerCount: number
      amountWon: number
    }

    setAmountWinPerUser(res.amountWon)
    setRemainingPeople(res.winnerCount)
  }, [quiz.id])

  const getQuestion = useCallback(
    async (stateIndex: number) => {
      const questionIndex = getNextQuestionPk(stateIndex)
      if (!questionIndex) {
        return
      }

      const res = await fetchQuizQuestionApi(questionIndex)

      setRemainingPeople(res.remainParticipantsCount)
      setTotalParticipantsCount(res.totalParticipantsCount)
      setAmountWinPerUser(res.amountWonPerUser)

      setQuestion((prev) => {
        if (prev) {
          setPreviousQuestion(prev)
        }

        return res
      })
    },
    [getNextQuestionPk]
  )

  // useEffect(() => {
  //   if (question) return
  //   getQuestion(stateIndex)
  // }, [getQuestion, question, stateIndex])

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newState = recalculateState()
      setStateIndex(newState)

      if (newState > quiz.questions.length) {
        setFinished(true)
        setTimer(0)
        // fetchFinalResults();
        return
      }

      if (newState !== stateIndex) {
        setPreviousQuestion(question)
        setQuestion(null)
      }

      setTimer(() => {
        const now = new Date().getTime()

        if (newState <= 0) {
          return startAt.getTime() - now
        }

        let estimatedRemaining =
          totalPeriod * newState + startAt.getTime() - now

        if (estimatedRemaining < restPeriod) {
          setIsRestTime(true)
        } else {
          estimatedRemaining -= restPeriod
          setIsRestTime(false)
        }

        return estimatedRemaining
      })
    }, 20)

    return () => {
      clearInterval(timerInterval)
    }
  }, [
    getQuestion,
    question,
    quiz.questions.length,
    recalculateState,
    startAt,
    stateIndex,
    submitUserAnswer,
    fetchFinalResults,
  ])

  useEffect(() => {
    if (!isRestTime) return

    submitUserAnswer()
  }, [isRestTime, submitUserAnswer])

  return (
    <QuizContext.Provider
      value={{
        health,
        hint,
        question,
        remainingPeople,
        scoresHistory,
        quiz,
        answerQuestion,
        timer,
        stateIndex,
        activeQuestionChoiceIndex: question
          ? userAnswersHistory[question?.number - 1]
          : -1,
        isRestTime,
        setIsRestTime,
        previousQuestion,
        answersHistory,
        userAnswersHistory,
        finished,
        totalParticipantsCount,
        amountWinPerUser,
        ping,
        wrongAnswersCount,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export default QuizContextProvider
