"use client"

import { useQuizContext } from "@/context/quizProvider"

const Header = () => {
  const { quiz } = useQuizContext()
  return (
    <header className="quiztap-header rounded-xl border-2 border-gray20 p-5">
      <h3 className="text-lg font-semibold text-white">{quiz?.title}</h3>
      <p className="mt-3 text-[#B5B5C6]">{quiz?.details}</p>
    </header>
  )
}

export default Header
