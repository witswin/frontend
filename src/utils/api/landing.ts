import { axiosInstance } from "./base"

export async function countStatsAPI() {
  const response = await axiosInstance.get<{
    allUsersCount: number
    competitionsCount: number
    userEnrollmentsCount: number
    totalPrizeAmount: number
  }>("/stats/total/")

  return response.data
}

export async function countGasClaimedAPI() {
  const response = await axiosInstance.get<{ count: number }>(
    "/api/gastap/claims/count/",
  )

  return response.data.count
}
