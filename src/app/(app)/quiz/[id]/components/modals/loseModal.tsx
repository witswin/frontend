"use client"

import Icon from "@/components/ui/Icon"
import { useQuizContext } from "@/context/quizProvider"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import Link from "next/link"
import { FC, useEffect, useState } from "react"

const LoseModal: FC = () => {
  const { wrongAnswersCount, finished, previousRoundLosses } = useQuizContext()

  const [isDissmissed, setIsDissmissed] = useState(false)
  const [watchAsSpectator, setWatchAsSpectator] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (wrongAnswersCount > 0 && !isDissmissed) {
      timeout = setTimeout(() => {
        setWatchAsSpectator(false)
      }, 3000)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [wrongAnswersCount, isDissmissed])

  return (
    <Modal
      className="bg-gray20"
      isOpen={!watchAsSpectator && !finished && wrongAnswersCount > 0}
      onOpenChange={() => {
        setWatchAsSpectator(true)
        setIsDissmissed(true)
      }}
    >
      <ModalContent>
        <ModalHeader className="justify-center">Quiz Over</ModalHeader>
        <ModalBody className="text-center">
          <Icon
            iconSrc="/assets/images/quizTap/spaceman-like.png"
            alt="spaceman like"
            width="100px"
            height="100px"
          />
          <p className="text-lg font-semibold text-error">Ohh! Game Over.</p>
          <p className="mt-5 text-gray100">
            <strong className="text-white underline">
              {previousRoundLosses}
            </strong>{" "}
            <span>people lost the game in the previous round.</span>
          </p>
          <p className="text-sm text-gray90">Next Questions in 5 seconds...</p>

          <button
            onClick={() => {
              setWatchAsSpectator(true)
              setIsDissmissed(true)
            }}
            className="flex mt-3 font-semibold gap-4 border-2 border-gray90 py-3 bg-gray40 rounded-xl justify-center items-center"
          >
            <span className="text-gray100">Keep Watching</span>
            <Icon
              className="opacity-70"
              iconSrc="/assets/images/provider-dashboard/ic_link_white.svg"
              width="18px"
              height="12px"
            />
          </button>
          <Link className="text-gray100 mb-5 mt-3" href="/quiz">
            Come back stronger
          </Link>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LoseModal
