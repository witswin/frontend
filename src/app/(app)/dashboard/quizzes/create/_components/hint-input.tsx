"use client"

import Icon from "@/components/ui/Icon"
import { useQuizCreateContext } from "../providers"
import TextInput from "./text-input"

const HintInput = () => {
  const { control } = useQuizCreateContext()
  return (
    <div className="flex items-center rounded-xl border-2 border-gray70 bg-gray00 px-2 text-gray100">
      <Icon
        alt="hint"
        className="py-1 mr-2"
        iconSrc="/assets/images/quizTap/fifty-fifty.png"
        width="20px"
        height="20px"
      />
      <span className="py-1">50% Hint</span>

      <span className="ml-2 border-l-2 border-gray70 py-1 pl-2">
        <TextInput control={control!} name="hintCount" className="!w-4" />
      </span>
    </div>
  )
}

export default HintInput
