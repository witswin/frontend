"use client"

import { FAST_INTERVAL } from "@/constants"
import { Competition, Hint, HintAchivement, UserCompetition } from "@/types"
import { NullCallback } from "@/utils"
import {
  fetchHintsAndAchivements,
  fetchUsersQuizEnrollments,
} from "@/utils/api"
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh"
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"
import { useUserProfileContext } from "./userProfile"
import { useSocket } from "@/utils/hooks/socket"
import logger from "@/core/logger"

export type EnrollModalState = "closed" | "enroll"

export const QuizTapListContext = createContext<{
  quizList: Competition[]
  pageIndex: number
  next?: string
  previous?: string
  count: number
  enrollmentsList: { id: number; competition: Competition }[]
  addEnrollment: (value: { id: number; competition: Competition }) => void
  modalState: EnrollModalState
  setModalState: (state: EnrollModalState) => void
  selecetedCompetition: Competition | null
  setSelectedCompetition: (value: Competition | null) => void
  userHints: {
    achivements: HintAchivement[]
    hints: Record<number, Hint>
  }
}>({
  quizList: [],
  pageIndex: 1,
  count: 0,
  enrollmentsList: [],
  addEnrollment: NullCallback,
  modalState: "closed",
  setModalState: NullCallback,
  selecetedCompetition: null,
  setSelectedCompetition: NullCallback,
  userHints: {
    achivements: [],
    hints: [],
  },
})

export const useQuizTapListContext = () => useContext(QuizTapListContext)

const QuizTapListProvider: FC<
  PropsWithChildren & {
    competitionInitialList: Competition[]
    previousInitial?: string
    nextInitial?: string
    countInitial: number
  }
> = ({
  children,
  competitionInitialList,
  nextInitial,
  previousInitial,
  countInitial,
}) => {
  const [competitionList, setCompetitionList] = useState(competitionInitialList)
  const [modalState, setModalState] = useState("closed" as EnrollModalState)
  const [selecetedCompetition, setSelectedCompetition] = useState(
    null as Competition | null,
  )

  const [enrollmentsList, setEnrollmentsList] = useState<
    {
      id: number
      competition: Competition
    }[]
  >([])

  const [paginateStatus, setPaginateStatus] = useState({
    previous: previousInitial,
    next: nextInitial,
    count: countInitial,
    currentPage: 1,
  })

  const [hints, setHints] = useState<{
    achivements: HintAchivement[]
    hints: Record<number, Hint>
  }>({
    achivements: [],
    hints: {},
  })

  useRefreshWithInitial(
    () => {
      fetchHintsAndAchivements().then((res) => {
        setHints({
          achivements: res.achivements,
          hints: res.hints.reduce(
            (prev, curr) => {
              prev[curr.id] = curr

              return prev
            },
            {} as Record<number, Hint>,
          ),
        })
      })
    },
    FAST_INTERVAL,
    [],
  )
  const refreshCompetitionList = (currentPage: number) => {}

  const resolveMessage = useCallback(
    (data: { data: any; type: string }) => {
      switch (data.type) {
        case "user_enrolls":
          setEnrollmentsList(data.data)
          break

        case "competition_list":
          setCompetitionList(data.data)
          break

        case "update_competition":
          {
            setCompetitionList((prev) => {
              const index = prev.findIndex((item) => item.id === data.data.id)
              if (index !== -1) {
                prev[index] = data.data
              } else {
                prev.push(data.data)
              }

              return [...prev]
            })
          }
          break

        case "remove_competition":
          setCompetitionList((prev) => {
            return [...prev.filter((item) => item.id !== data.data)]
          })
          break

        case "increase_enrollment":
          const item = competitionList.find((item) => item.id === data.data)
          if (item) {
            item.participantsCount += 1
          }
          setCompetitionList([...competitionList])
          break
      }
    },
    [competitionList, setCompetitionList, enrollmentsList, setEnrollmentsList],
  )

  const {} = useSocket({
    basePath: "/ws/quiz/list/",
    onMessageEnter: resolveMessage,
  })

  return (
    <QuizTapListContext.Provider
      value={{
        count: paginateStatus.count,
        pageIndex: paginateStatus.currentPage,
        quizList: competitionList,
        next: paginateStatus.next,
        previous: paginateStatus.previous,
        enrollmentsList,
        modalState,
        setModalState,
        selecetedCompetition,
        setSelectedCompetition,
        addEnrollment: (value) =>
          setEnrollmentsList([...enrollmentsList, value]),
        userHints: hints,
      }}
    >
      {children}
    </QuizTapListContext.Provider>
  )
}

export default QuizTapListProvider
