"use client"

import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { shortenAddress } from "@/utils"
import { FC } from "react"

const QuizFinished: FC<{}> = () => {
  const { winners } = useQuizContext()

  return (
    <div className="mt-10 text-center ">
      {winners === null ? (
        <>
          <p className="font-bold">Quiz is Finished</p>
          <div className="mt-3">Waiting for results to be calculated</div>
        </>
      ) : (
        <div>
          <h3 className="text-left">Winners List</h3>

          <span className="mt-5 h-80 inline-flex gap-4 flex-col overflow-y-auto text-sm bg-gray20 p-2 md:p-5 rounded-lg">
            {winners.map((item, key) => (
              <span
                key={key}
                className="px-4 py-3 inline-flex gap-10 items-center text-gray100 font-sans rounded-xl bg-gray60"
              >
                {shortenAddress(item.userProfile_WalletAddress)}

                {/* {item.txHash ? ( */}
                <a
                  target="_blank"
                  href={`https://polygonscan.com/tx/${item.txHash}`}
                  className="ml-auto text-xs font-semibold border-mid-dark-space-green border-2 rounded-lg bg-dark-space-green px-2 text-space-green flex items-center gap-1 py-1 underline"
                >
                  Claimed
                  <Icon
                    iconSrc="/assets/images/prize-tap/ic_link_green.svg"
                    className="ml-1"
                  />
                  <Icon
                    height="25px"
                    iconSrc="/assets/images/prize-tap/diamond.svg"
                    className="ml-2"
                  />
                </a>
                {/* // ) : (
                //   <span className="bg-gray50 border-2 border-gray70 rounded-lg px-4 py-2 text-xs ml-auto text-gray80">
                //     Not Claimed by the winner yet
                //   </span>
                // )} */}
              </span>
            ))}
            {!!winners.length || (
              <p className="text-center text-gray90">
                There were no winners for this raffle
              </p>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export default QuizFinished
