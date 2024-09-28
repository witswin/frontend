import Header from "./_components/header"

import "../../../quiz/[id]/styles.scss"
import QuizTapSidebar from "./_components/sidebar"
import QuizCreateProvider, { useQuizCreateContext } from "./providers"
import QuizEditor from "./_components/editor"

const CreateQuizPage = () => {
  return (
    <QuizCreateProvider>
      <h3>Create a Quiz</h3>
      <div className="mt-5 p-2">
        <Header />
        <div className="flex flex-col-reverse gap-2 md:flex-row mt-5">
          <div className="quiz-main-wrapper pb-28 relative w-full">
            <QuizEditor />
          </div>

          <QuizTapSidebar />
        </div>
      </div>
    </QuizCreateProvider>
  )
}

export default CreateQuizPage
