"use client"

import Header from "./_components/header"

import "../../../quiz/[id]/styles.scss"
import QuizTapSidebar from "./_components/sidebar"
import QuizCreateProvider, { useQuizCreateContext } from "./providers"
import QuizEditor from "./_components/editor"
import { Tabs, Tab, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react"
import PersonalData from "./_components/personal-data"

const CreateQuizPage = () => {
  return (
    <QuizCreateProvider>
      <Breadcrumbs size="lg">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/quizzes">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/quizzes/create">
          Create Quiz
        </BreadcrumbItem>
      </Breadcrumbs>
      <FormErrorsVisualizer />
      <div className="mt-5 p-2">
        <Tabs aria-label="Form Titles">
          <Tab key="personal" title="Personal Data">
            <div className="mt-10">
              <PersonalData />
            </div>
          </Tab>
          <Tab key="quiz-data" title="Quiz">
            <Header />
            <div className="flex flex-col-reverse gap-2 md:flex-row mt-5">
              <div className="quiz-main-wrapper pb-28 relative w-full">
                <QuizEditor />
              </div>

              <QuizTapSidebar />
            </div>
          </Tab>
        </Tabs>
      </div>
    </QuizCreateProvider>
  )
}

const FormErrorsVisualizer = () => {
  const { errors } = useQuizCreateContext()

  if (!errors || Object.values(errors).length === 0) return null

  return (
    <ul className="bg-red-500/30 rounded-lg mt-10 list-disc p-3 pl-10 text-sm flex flex-col gap-4">
      {Object.values(errors).map((item: any, key) => (
        <li key={key} className="text-error">
          {typeof item === "string" ? item : item.message}
        </li>
      ))}
    </ul>
  )
}

export default CreateQuizPage
