"use client"

import { Competition, QuestionResponse, UserAnswer } from "@/types"
import { NullCallback } from "@/utils"
import { fetchQuizApi } from "@/utils/api"
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
import { Address } from "viem"

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
  winners: { userProfile_WalletAddress: Address; txHash: string }[] | null
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
  winners: null,
})

export const statePeriod = 10000
export const restPeriod = 8000
export const seeResultDuration = 3000
const totalPeriod = restPeriod + statePeriod

export const useQuizContext = () => useContext(QuizContext)

function formatTimeDifference(startAt: Date, nowUTC: Date) {
  // Step 1: Get the difference in milliseconds
  const difference = startAt.getTime() - nowUTC.getTime()

  // Step 2: Convert milliseconds to seconds
  let totalSeconds = Math.floor(difference / 1000)

  // Step 3: Calculate hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600 // Remaining seconds after extracting hours

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const formattedTime = `${hours}:${minutes}:${seconds}`

  return formattedTime
}

const setDocTitle = (title?: string) => {
  if (!title) document.title = "WITS"

  const docTitle = `WITS | ${title}`

  if (docTitle !== document.title) document.title = docTitle
}

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
  const [previousRoundLosses, setPreviousRoundLosses] = useState(0)
  const [hintData, setHintData] = useState<{
    questionId: number
    data: number[]
  } | null>(null)
  const [winnersList, setWinnersList] = useState<
    { userProfile_WalletAddress: Address; txHash: string }[] | null
  >(null)

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

    const nowUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    )

    if (startAt > nowUTC) {
      return -1
    }

    const timePassed = nowUTC.getTime() - startAt.getTime()

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
            setQuestion((prev) => {
              if (prev?.id === data.question.id) {
                return prev
              }

              return data.question
            })
            const correctAnswer = data.question.choices.find(
              (item: any) => item.isCorrect
            )
            if (correctAnswer) {
              setAnswersHistory((prev) => {
                prev[data.question.number - 1] = correctAnswer.id

                return [...prev]
              })
            }
          } else if (data.type === "add_answer") {
            const answerData = data.data
            setAnswersHistory((answerHistory) => {
              answerHistory[answerData.questionNumber - 1] =
                answerData.correctChoice
              return [...answerHistory]
            })
          } else if (data.type === "quiz_stats") {
            const stats = data.data

            setHint(stats.hintCount)
            setPreviousRoundLosses(stats.previousRoundLosses)
            setAmountWinPerUser(stats.prizeToWin)
            setTotalParticipantsCount(stats.totalParticipantsCount)
            setRemainingPeople(stats.usersParticipating)
          } else if (data.type === "quiz_finish") {
            setWinnersList(data.winnersList)
          } else if (data.type === "hint_question") {
            setHint((prev) => prev - 1)
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
    if (question?.number && question?.number > stateIndex) return
    const currentQuestionIndex = getNextQuestionPk(stateIndex)

    if (!question?.isEligible) {
      setAnswersHistory((prev) => [...prev, -1])
      socket.current.client?.send(
        JSON.stringify({
          command: "GET_QUESTION",
          args: {
            index: currentQuestionIndex,
          },
        })
      )
      return
    }

    if (
      userAnswersHistory[question.number - 1] !== -1 &&
      currentQuestionIndex !== -1
    ) {
      const questionNumber = question.number - 1

      if (
        userAnswersHistory[questionNumber] === null ||
        userAnswersHistory[questionNumber] === undefined
      ) {
        setAnswersHistory((prev) => [...prev, -1])
        socket.current.client?.send(
          JSON.stringify({
            command: "GET_QUESTION",
            args: {
              index: currentQuestionIndex,
            },
          })
        )
        return
      }

      socket.current.client?.send(
        JSON.stringify({
          command: "ANSWER",
          args: {
            questionId: currentQuestionIndex,
            selectedChoiceId: userAnswersHistory[questionNumber]!,
          },
        })
      )
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
    if (stateIndex >= 0) return

    const interval = setInterval(() => {
      socket.current.client?.send(
        JSON.stringify({
          command: "GET_STATS",
        })
      )
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [stateIndex])

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const newState = recalculateState()
      setStateIndex(newState)

      if (newState > quiz.questions.length) {
        setFinished(true)
        setDocTitle(`Quiz Finished`)
        setTimer(0)
        return
      }

      setTimer(() => {
        const now = new Date() // Current local time
        const nowUTC = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
          )
        ) // Current UTC time

        let estimatedRemaining =
          totalPeriod * newState + startAt.getTime() - nowUTC.getTime()

        if (newState <= 0) {
          const passedTime = startAt.getTime() - nowUTC.getTime()
          setDocTitle(`Start At ${formatTimeDifference(startAt, nowUTC)}`)

          return passedTime
        }

        if (estimatedRemaining < restPeriod) {
          setDocTitle(`Rest Time`)
          setIsRestTime(true)
        } else {
          estimatedRemaining -= restPeriod
          setDocTitle(`[Question] ${Math.floor(estimatedRemaining / 1000)}`)
          setIsRestTime(false)
        }

        return estimatedRemaining
      })
    }, 20)

    return () => {
      clearInterval(timerInterval)
      setDocTitle(``)
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
        winners: winnersList,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export default QuizContextProvider
