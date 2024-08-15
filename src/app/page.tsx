import QuizTapListProvider from "@/context/quiztapListProvider"
import { fetchQuizzesApi } from "@/utils/api"
import { FC } from "react"
import Header from "./components/header"
import QuizRaffleList from "./components/quizRaffleList"

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
    </QuizTapListProvider>
  )
}

export default QuizListPage
