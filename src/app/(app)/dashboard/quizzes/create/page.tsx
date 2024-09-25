import Header from "./_components/header"
import Icon from "@/components/ui/Icon"

import "../../../quiz/[id]/styles.scss"
import QuizTapSidebar from "./_components/sidebar"

const CreateQuizPage = () => {
  return (
    <div>
      <h3>Create a Quiz</h3>
      <div className="mt-5 p-2">
        <Header />
        <div className="flex flex-col-reverse gap-2 md:flex-row mt-5">
          <div className="quiz-main-wrapper pb-28 relative w-full">
            <main className="quiz-main-content h-full w-full flex-1 rounded-2xl p-3">
              <div className="mt-5 flex pt-16 md:pt-0 flex-col md:flex-row gap-y-5 items-center justify-end px-5">
                <button className="flex items-center rounded-xl border-2 border-gray70 bg-gray00 px-2 text-gray100 disabled:opacity-60">
                  <Icon
                    alt="hint"
                    className="py-1 mr-2"
                    iconSrc="/assets/images/quizTap/fifty-fifty.png"
                    width="20px"
                    height="20px"
                  />
                  <span className="py-1">50% Hint</span>
                  <span className="ml-2 border-l-2 border-gray70 py-1 pl-2">
                    1
                  </span>
                </button>
              </div>
            </main>
          </div>

          <QuizTapSidebar />
        </div>
      </div>
    </div>
  )
}

export default CreateQuizPage
