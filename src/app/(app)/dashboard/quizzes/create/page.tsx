import Header from "./_components/header"

import "../../../quiz/[id]/styles.scss"
import QuizTapSidebar from "./_components/sidebar"
import QuizCreateProvider from "./providers"
import HintInput from "./_components/hint-input"
import QuestionsList from "./_components/questionsList"
import QuestionPrompt from "./_components/questionPrompt"

const CreateQuizPage = () => {
  return (
    <QuizCreateProvider>
      <h3>Create a Quiz</h3>
      <div className="mt-5 p-2">
        <Header />
        <div className="flex flex-col-reverse gap-2 md:flex-row mt-5">
          <div className="quiz-main-wrapper pb-28 relative w-full">
            <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
              <div className="mt-5 flex pt-16 md:pt-0 flex-col md:flex-row gap-y-5 items-center justify-end px-5">
                <HintInput />
              </div>
              <QuestionsList />

              <QuestionPrompt />
            </main>
          </div>

          <QuizTapSidebar />
        </div>
      </div>
    </QuizCreateProvider>
  )
}

export default CreateQuizPage
