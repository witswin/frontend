import { FC, PropsWithChildren } from "react"

import "./styles.scss"
import Header from "./components/header"
import { fetchQuizApi, fetchUserQuizEnrollment } from "@/utils/api"
import QuizContextProvider from "@/context/quizProvider"
import QuizTapSidebar from "./components/sidebar"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const QuizLayout: FC<PropsWithChildren & { params: { id: string } }> = async ({
  children,
  params,
}) => {
  const cookieStorage = cookies()

  const quiz = await fetchQuizApi(Number(params.id))
  let enrollment
  try {
    enrollment = await fetchUserQuizEnrollment(
      cookieStorage.get("userToken")?.value!,
      Number(params.id)
    )
  } catch (e) {
    console.log(e)
    redirect("/quiz")
  }

  return (
    <QuizContextProvider quiz={quiz} userEnrollmentPk={enrollment}>
      <Header />

      <div className="mt-5 select-none flex flex-col gap-2 md:flex-row">
        {children}

        <QuizTapSidebar />
      </div>
    </QuizContextProvider>
  )
}

export default QuizLayout
