"use client"

import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { fromWei, toWei } from "@/utils"
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
import { FC, useState } from "react"
import { isAddressEqual } from "viem"

const WinnerModal: FC = () => {
  const {
    wrongAnswersCount,
    finished,
    previousRoundLosses,
    winners,
    amountWinPerUser,
    quiz,
  } = useQuizContext()
  const { address } = useWalletAccount()

  const [dismissWinnerModal, setDissmissWinnerModal] = useState(false)

  const onShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I've just claimed ${fromWei(amountWinPerUser, quiz?.tokenDecimals)} ${quiz?.token} from @witswin 🔥\n Participate on:`
    )}&url=${encodeURIComponent("wist.win/quiz")}`

    window.open(twitterUrl, "_blank")
  }

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
            className="mx-auto bg-twitter-image text-base border-2 border-white mb-5 !w-full flex items-center gap-5 mt-7"
            style={{ backgroundColor: "#000" }}
          >
            <p>Share on</p>
            <Image src={"/x.svg"} alt="X" width={20} height={20} />
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// {fromWei(amountWinPerUser, quiz?.tokenDecimals)}{" "}
// {quiz?.token}
//

export default WinnerModal
