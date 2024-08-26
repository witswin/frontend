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
  socketInstance: WebSocket | null
  hintData: { questionId: number; data: number[] } | null
  previousRoundLosses: number
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
  socketInstance: null,
  hintData: null,
  previousRoundLosses: 0,
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
  const [previousRoundLosses, setPreviousRoundLosses] = useState(0)
  const [hintData, setHintData] = useState<{
    questionId: number
    data: number[]
  } | null>(null)
  const [winnersList, setWinnersList] = useState([])

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

  const wrongAnswersCount = useMemo(() => {
    const userAnswerHistoryCount = userAnswersHistory.filter((item) =>
      answersHistory.includes(item)
    ).length

    return answersHistory.length - userAnswerHistoryCount
  }, [answersHistory, userAnswersHistory, stateIndex])

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

    let interval: NodeJS.Timeout | undefined
    let reconnectTimeout: NodeJS.Timeout | undefined
    let previousPing: Date | null = null

    const initializeWebSocket = () => {
      if (!isMounted) return

      const socketUrl =
        process.env.NEXT_PUBLIC_WS_URL! + "/ws/quiz/" + quiz.id + "/"
      socket.current.client = new WebSocket(socketUrl)

      socket.current.client.onopen = () => {
        previousPing = new Date()
        socket.current.client?.send(JSON.stringify({ command: "PING" }))
        interval = setInterval(() => {
          try {
            previousPing = new Date()
            socket.current.client?.send(JSON.stringify({ command: "PING" }))
          } catch (error) {
            reconnect()
          }
        }, 3000)
      }

      socket.current.client.onclose = (e) => {
        if (isMounted) reconnect() // Reconnect only if the component is still mounted
        setPing(-1)
      }

      socket.current.client.onmessage = (e) => {
        if (e.data === "PONG") {
          const now = new Date()
          const timePassed = previousPing
            ? now.getTime() - previousPing.getTime()
            : -1
          setPing(timePassed)
        } else {
          const data = JSON.parse(e.data)

          if (data.type === "new_question") {
            setQuestion(
              typeof data.question === "string"
                ? JSON.parse(data.question)
                : data.question
            )
          } else if (data.type === "quiz_stats") {
            const stats = data.data

            setHint(stats.hintCount)
            setPreviousRoundLosses(stats.previousRoundLosses)
            setAmountWinPerUser(stats.prizeToWin)
            setTotalParticipantsCount(stats.totalParticipantsCount)
            setRemainingPeople(stats.usersParticipating)
          } else if (data.type === "hint_question") {
            setHintData({
              data: data.data,
              questionId: data.questionId,
            })
          } else if (data.type === "answers_history") {
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
    }

    const reconnect = () => {
      if (interval) clearInterval(interval) // Clear the existing interval before reconnecting
      if (reconnectTimeout) clearTimeout(reconnectTimeout) // Clear the existing timeout before setting a new one
      if (socket.current.client) {
        socket.current.client.onclose = () => {} // Prevent the original onclose from firing during reconnect
        socket.current.client.close()
        socket.current.client = null
      }

      reconnectTimeout = setTimeout(() => {
        if (isMounted) {
          initializeWebSocket()
        }
      }, 5000) // Wait 5 seconds before attempting to reconnect
    }

    initializeWebSocket() // Initialize the WebSocket connection

    return () => {
      isMounted = false
      if (interval) clearInterval(interval) // Clean up the interval
      if (reconnectTimeout) clearTimeout(reconnectTimeout) // Clean up the reconnect timeout
      if (socket.current.client) {
        socket.current.client.onclose = () => {} // Prevent the onclose from firing during cleanup
        socket.current.client.close()
        socket.current.client = null
      }
    }
  }, [userToken])

  const submitUserAnswer = useCallback(async () => {
    const currentQuestionIndex = getNextQuestionPk(stateIndex)

    if (!question?.isEligible) {
      setAnswersHistory((prev) => [...prev, -1])

      return
    }

    if (
      userAnswersHistory[question.number - 1] !== -1 &&
      currentQuestionIndex !== -1
    ) {
      const currentQuestion = currentQuestionIndex
      const questionNumber = question.number - 1

      if (
        userAnswersHistory[questionNumber] === null ||
        userAnswersHistory[questionNumber] === undefined
      ) {
        setAnswersHistory((prev) => [...prev, -1])
        return
      }

      const answerRes = await submitAnswerApi(
        currentQuestionIndex!,
        userEnrollmentPk,
        userAnswersHistory[questionNumber]
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

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newState = recalculateState()
      setStateIndex(newState)

      const now = new Date().getTime()

      let estimatedRemaining = totalPeriod * newState + startAt.getTime() - now

      if (
        newState > quiz.questions.length ||
        (estimatedRemaining < restPeriod && newState === quiz.questions.length)
      ) {
        setFinished(true)
        setTimer(0)
        return
      }

      if (newState !== stateIndex) {
        setPreviousQuestion(question)
        setQuestion(null)
      }

      setTimer(() => {
        const now = new Date().getTime()

        let estimatedRemaining =
          totalPeriod * newState + startAt.getTime() - now

        if (newState <= 0) {
          return startAt.getTime() - now
        }

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
        socketInstance: socket.current.client,
        hintData,
        previousRoundLosses,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export default QuizContextProvider
