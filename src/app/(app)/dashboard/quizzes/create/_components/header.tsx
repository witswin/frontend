"use client"

import { useQuizCreateContext } from "../providers"
import TextInput from "./text-input"

const Header = () => {
  const { control } = useQuizCreateContext()

  return (
    <header className="quiztap-header rounded-xl border-2 border-gray20 p-5">
      <TextInput
        size="large"
        control={control!}
        name="title"
        placeholder="Quiz Title"
      />
      <TextInput
        className="mt-3"
        control={control!}
        name="details"
        placeholder="This is the quiz details"
      />
    </header>
  )
}

export default Header
