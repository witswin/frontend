"use client"

import { useQuizTapListContext } from "@/context/quiztapListProvider"
import QuizCard from "./quizCard"

const QuizRaffleList = () => {
  const { quizList } = useQuizTapListContext()

  console.log(quizList)

  return (
    <div>
      {quizList.map((quiz, index) => (
        <QuizCard key={index} competition={quiz} />
      ))}
    </div>
  )
}

export default QuizRaffleList
