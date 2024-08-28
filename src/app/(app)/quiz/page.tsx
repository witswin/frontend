import QuizTapListProvider from "@/context/quiztapListProvider"
import { fetchQuizzesApi } from "@/utils/api"
import { FC } from "react"
import Header from "../components/header"
import QuizRaffleList from "../components/quizRaffleList"
import EnrollModal from "./_components/enrollModal"

const QuizListPage: FC = async () => {
  const res = await fetchQuizzesApi()

  return (
    <QuizTapListProvider
      competitionInitialList={res.results}
      countInitial={res.count}
      nextInitial={res.next}
      previousInitial={res.previous}
    >
      <Header />
      <QuizRaffleList />
      <EnrollModal />
    </QuizTapListProvider>
  )
}

export default QuizListPage
