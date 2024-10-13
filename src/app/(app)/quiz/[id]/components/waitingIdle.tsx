import { useQuizContext } from "@/context/quizProvider"
import { fromWei } from "@/utils"
import { FC, useEffect, useState } from "react"
import { HintItem } from "../../_components/enrollModal"

const WaitingIdle: FC<{}> = () => {
  const { quiz, timer, cachedAudios, stateIndex } = useQuizContext()

  const [isPlayedSound, setIsPlayedSound] = useState(false)

  useEffect(() => {
    if (timer <= 3000 && !isPlayedSound && stateIndex < 0) {
      cachedAudios.beforeStart?.play()
      setIsPlayedSound(true)
      setTimeout(() => {
        cachedAudios.quizStart?.play()
      }, 3000)
    }
  }, [timer, isPlayedSound, stateIndex])

  return (
    <div className="mt-20 text-center">
      <p className="text-lg font-semibold text-white"> Hang tight!</p>

      <p className="mt-5 text-gray100">
        the quiz begins as soon as everyone’s in.
      </p>
      <div className="w-auto md:w-96 mx-auto mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-2">
          <div className="flex px-2 justify-evenly flex-1 py-1 items-center rounded-xl border border-gray70 bg-gray50">
            <p className="text-sm font-normal leading-[22px] text-gray100">
              Prize
            </p>
            <p className="bg-prize-text-gradient bg-clip-text text-sm font-semibold leading-[20px] text-transparent">
              {fromWei(quiz?.prizeAmount ?? 0, quiz?.tokenDecimals) +
                " " +
                quiz?.token}{" "}
            </p>
          </div>
          {quiz?.builtInHints.map((hint, key) => (
            <HintItem hint={hint.hint} count={hint.count} key={key} />
          ))}
        </div>
        <div className="flex flex-wrap flex-col md:flex-row mt-2 gap-2">
          <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
            <h5 className="text-white font-semibold">
              {quiz?.questionTimeSeconds} Sec
            </h5>
            <p className="mt-2 text-sm text-gray100">Time for each Question</p>
          </div>
          <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
            <h5 className="text-white font-semibold">
              {quiz?.questions.length} Q
            </h5>
            <p className="mt-2 text-sm text-gray100">Number of Questions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingIdle
