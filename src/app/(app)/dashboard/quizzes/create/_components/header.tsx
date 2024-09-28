"use client"

import { Button } from "@nextui-org/react"
import { useQuizCreateContext } from "../providers"
import TextInput from "./text-input"
import { FaSave } from "react-icons/fa"

const Header = () => {
  const { control } = useQuizCreateContext()

  return (
    <header className="quiztap-header rounded-xl border-2 border-gray20 p-5">
      <div className="flex items-center justify-between">
        <TextInput
          size="large"
          control={control!}
          name="title"
          placeholder="Quiz Title"
        />

        <Button startContent={<FaSave />}>Save</Button>
      </div>
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
