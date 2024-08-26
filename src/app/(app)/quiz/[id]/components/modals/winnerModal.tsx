"use client"

import { ClaimButton } from "@/components/ui/Button/button"
import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { useWalletAccount } from "@/utils/wallet"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
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

  return (
    <Modal
      className="bg-gray20"
      isOpen={
        !dismissWinnerModal &&
        finished &&
        !!address &&
        !!winners?.find((winner) => isAddressEqual(address, winner))
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
            Congrats! You won{" "}
            <span className="bg-g-primary bg-clip-text text-transparent">
              {amountWinPerUser} {quiz?.token}
            </span>
            .
          </p>
          <p className="mt-5 text-gray100">
            This had {winners?.length} that the total prize of the game divided
            between there winners.
          </p>
          <ClaimButton onClick={() => {}} className="mx-auto mb-5 !w-full mt-7">
            <p>
              Claim {amountWinPerUser} {quiz?.token}
            </p>
          </ClaimButton>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WinnerModal
