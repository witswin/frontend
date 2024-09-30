import { Competition, CompetitionStatus, QuestionResponse } from "@/types"
import { WithPagination } from "../pagination"
import { serverFetch } from "."
import { axiosInstance } from "./base"

export const fetchQuizzesApi = async (
  pageIndex?: number,
): Promise<WithPagination<Competition>> => {
  const response: WithPagination<Competition> = await serverFetch(
    "/quiz/competitions/" + (pageIndex ? `?page=${pageIndex}` : ""),
  )

  return response
}

export const fetchQuizQuestionApi = async (questionId: number) => {
  const response = await axiosInstance.get<QuestionResponse>(
    "/quiz/questions/" + questionId,
  )

  return response.data
}

export const submitAnswerApi = async (
  questionId: number,
  userEnrollmentPk: number,
  choicePk: number,
) => {
  const response = await axiosInstance.post(
    "/quiz/competitions/submit-answer/",
    {
      userCompetition: userEnrollmentPk,
      selectedChoice: choicePk,
      question: questionId,
    },
  )

  return response.data
}

export const createQuizApi = async (quiz: any) => {
  const response = await axiosInstance.post(
    "/quiz/dashboard/competitions/",
    quiz,
  )

  return response.data
}

export const FetchUserQuizzes = async () => {
  const response = await axiosInstance.get("/quiz/dashboard/competitions/")

  return response.data
}

export const enrollQuizApi = async (id: number) => {
  const response: { id: number; competition: Competition } = (
    await axiosInstance.post("/quiz/competitions/enroll/", {
      competition: id,
    })
  ).data

  return response
}

export const fetchQuizApi = async (id: number): Promise<Competition> => {
  const response: Competition = await serverFetch(
    "/quiz/competitions/" + id + "/",
  )

  return response
}

export const fetchUserQuizEnrollment = async (
  userToken: string,
  competitionPk: number,
) => {
  const res = await axiosInstance.get<{ id: number }[]>(
    "/quiz/competitions/enroll/?competition_pk=" + competitionPk,
    {
      headers: {
        Authorization: `TOKEN ${userToken}`,
      },
    },
  )

  return res.data[0]?.id
}

export const fetchUsersQuizEnrollments = async () => {
  const res = await axiosInstance.get<
    { id: number; competition: Competition }[]
  >("/quiz/competitions/enroll/")

  return res.data
}
