"use client"

import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { fromWei, toWei } from "@/utils"
import { getRandomItem } from "@/utils/random"
import { useWalletAccount } from "@/utils/wallet"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa"
import { isAddressEqual } from "viem"

const twitterTitles = [
  `🎉 I just won $[Amount] on @WitsWin!! 😎🏆 Think you can outsmart me? Join Wits and let’s see Who’s The Smartest! `,
  `Just bagged $[Amount] on @WitsWin! 🤑 Time to show off my web3 skills. Anyone dares challenge me? ⚔️`,
  `Flexed my Web3 knowledge and won $[Amount] on @WitsWin! 💸 Don’t miss out on the next round! `,
  `🏆 Just aced the quiz and earned $[Amount] on @WitsWin! 🚀 Think you can score a perfect game too? Jump in and earn your share!`,
  `🔥 Nailed all the questions on @WitsWin and won $[Amount]! 🤓 Ready to take the challenge? `,
]

const WinnerModal: FC = () => {
  const {
    wrongAnswersCount,
    finished,
    previousRoundLosses,
    winners,
    amountWinPerUser,
    quiz,
    cachedAudios,
  } = useQuizContext()
  const { address } = useWalletAccount()

  const [dismissWinnerModal, setDissmissWinnerModal] = useState(false)

  const onShareTwitter = () => {
    const item = getRandomItem(twitterTitles)

    const amount = `${fromWei(amountWinPerUser, quiz?.tokenDecimals)} ${quiz?.token}`

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      item.replace(/\$\[Amount\]/g, amount)
    )}&url=${encodeURIComponent("wits.win")}`

    window.open(twitterUrl, "_blank")
  }

  useEffect(() => {
    if (
      !dismissWinnerModal &&
      finished &&
      !!address &&
      !!winners?.find((winner) =>
        isAddressEqual(address, winner.userProfile_WalletAddress)
      )
    ) {
      cachedAudios.prizeClaimed?.play()
    }
  }, [dismissWinnerModal, finished, address, winners])

  return (
    <Modal
      className="bg-gray20 border-2 border-gray80"
      isOpen={
        !dismissWinnerModal &&
        finished &&
        !!address &&
        !!winners?.find((winner) =>
          isAddressEqual(address, winner.userProfile_WalletAddress)
        )
      }
      onOpenChange={() => setDissmissWinnerModal(true)}
    >
      <ModalContent>
        <ModalHeader className="justify-center">Quiz Prize</ModalHeader>
        <ModalBody className="text-center">
          <Icon
            iconSrc="/assets/images/quizTap/winn-prize.svg"
            alt="spaceman like"
            width="100px"
            height="100px"
          />
          <p className="text-lg font-semibold text-space-green">
            Way to go! You won{" "}
            <span className="bg-g-primary bg-clip-text text-transparent">
              {fromWei(amountWinPerUser, quiz?.tokenDecimals)} {quiz?.token}
            </span>
            .
          </p>
          <p className="mt-5 text-gray100">
            {winners?.length} People won this game.
          </p>
          <p className="mt-5 text-gray100">
            The total {fromWei(quiz?.prizeAmount ?? 0, quiz?.tokenDecimals)}{" "}
            {quiz?.token} Reward is distributed among the winners.
          </p>
          <Button
            onClick={onShareTwitter}
            size="lg"
            className="mx-auto bg-twitter-image text-base border-2 border-white mb-2 !w-full flex items-center gap-5 mt-7"
            style={{ backgroundColor: "#000" }}
          >
            <p>Share on</p>
            <Image src={"/x.svg"} alt="X" width={20} height={20} />
          </Button>
          <Link
            className="text-gray100 mb-5 justify-center flex items-center gap-5"
            href="/quiz"
          >
            Go back
            <FaArrowRight />
          </Link>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// {fromWei(amountWinPerUser, quiz?.tokenDecimals)}{" "}
// {quiz?.token}
//

export default WinnerModal
