import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { fromWei } from "@/utils"
import { FC } from "react"

const WaitingIdle: FC<{}> = () => {
  const { quiz } = useQuizContext()
  return (
    <div className="mt-20 text-center">
      <p className="text-lg font-semibold text-white"> Hang tight!</p>

      <p className="mt-5 text-gray100">
        the quiz begins as soon as everyone’s in.
      </p>
      <div className="mx-5 mt-5">
      <div className="flex mt-2 gap-2 ">
            <div className="flex px-2 justify-between flex-1 py-1 items-center rounded-xl border border-gray70 bg-gray50">
              <p className="text-sm font-normal leading-[22px] text-gray100">
                Prize
              </p>
              <p className="bg-prize-text-gradient bg-clip-text text-sm font-semibold leading-[20px] text-transparent">
                {fromWei(quiz?.prizeAmount ?? 0, quiz?.tokenDecimals) +
                  " " +
                  quiz?.token}{" "}
              </p>
            </div>
            <div className="flex px-2 flex-1 items-center rounded-xl border border-gray70 bg-gray50">
              <Icon
                alt="hint"
                className="py-1 mr-2"
                iconSrc="/assets/images/quizTap/fifty-fifty.png"
                width="25px"
                height="25px"
              />
              <span className="py-1">50% Hint</span>
              <span className="ml-auto border-l-2 text-sm border-gray70 py-1 pl-2">
                x {quiz?.hintCount}
              </span>
            </div>
          </div>
          <div className="flex mt-5 gap-2 ">
            <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
              <h5 className="text-white font-semibold">10 Sec</h5>
              <p className="mt-2 text-sm text-gray100">
                Time for each Question
              </p>
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
