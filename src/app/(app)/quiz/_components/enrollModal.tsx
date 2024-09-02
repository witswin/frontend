"use client"

import Image from "next/image"
import { useQuizTapListContext } from "@/context/quiztapListProvider"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import { FC, useState } from "react"
import Icon from "@/components/ui/Icon"
import {
  ClaimAndEnrollButton,
  EnrolledButton,
} from "@/components/ui/Button/button"
import { enrollQuizApi } from "@/utils/api"
import { useTimer } from "@/utils/hooks/timer"
import Link from "next/link"
import { fromWei } from "@/utils"

const EnrollModal: FC<{}> = () => {
  const {
    modalState,
    setModalState,
    selecetedCompetition,
    addEnrollment,
    enrollmentsList,
  } = useQuizTapListContext()

  const [loading, setLoading] = useState(false)

  const competition = selecetedCompetition!

  const { minutes, seconds, hours } = useTimer(competition?.startAt)

  const isEnrolled =
    enrollmentsList.findIndex(
      (raffle) =>
        (typeof raffle.competition === "number"
          ? raffle.competition
          : raffle.competition.id) === competition?.id
    ) !== -1

  const onEnroll = () => {
    setLoading(true)
    enrollQuizApi(competition.id)
      .then((res) => {
        addEnrollment(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      isOpen={modalState !== "closed" && !!competition}
      onOpenChange={() => setModalState("closed")}
      className="bg-gray20 border-2 text-center border-gray80"
    >
      <ModalContent>
        <ModalHeader className="justify-center">Quiz Lobby</ModalHeader>
        <ModalBody className="text-gray100">
          <Image
            src={competition?.image ?? "/assets/images/quizTap/usdt.svg"}
            alt={
              fromWei(competition?.prizeAmount, competition?.tokenDecimals) +
              " " +
              competition?.token
            }
            width="135"
            className="mx-auto"
            height="133"
          />
          <h4 className="mt-3 text-white">{competition?.title}</h4>
          <p className="text-sm text-gray100">{competition?.details}</p>

          <div className="flex mt-2 gap-2 ">
            <div className="flex px-2 justify-between flex-1 py-1 items-center rounded-xl border border-gray70 bg-gray50">
              <p className="text-sm font-normal leading-[22px] text-gray100">
                Prize
              </p>
              <p className="bg-prize-text-gradient bg-clip-text text-sm font-semibold leading-[20px] text-transparent">
                {fromWei(competition?.prizeAmount, competition?.tokenDecimals) +
                  " " +
                  competition?.token}{" "}
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
                x {competition?.hintCount}
              </span>
            </div>
          </div>
          <div className="flex gap-2 ">
            <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
              <h5 className="text-white font-semibold">10 Sec</h5>
              <p className="mt-2 text-sm text-gray100">
                Time for each Question
              </p>
            </div>
            <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
              <h5 className="text-white font-semibold">
                {competition?.questions.length} Q
              </h5>
              <p className="mt-2 text-sm text-gray100">Number of Questions</p>
            </div>
          </div>
          <div className="mt-2 mb-1">
            {!isEnrolled ? (
              <ClaimAndEnrollButton
                onClick={onEnroll}
                height="48px"
                $fontSize="14px"
                disabled={loading}
                className="!w-full"
              >
                <div className="relative w-full">
                  <p className="bg-g-primary bg-clip-text text-transparent">
                    {loading ? "Enrolling..." : "Enroll"}
                  </p>
                </div>
              </ClaimAndEnrollButton>
            ) : (
              <Link href={`/quiz/${competition.id}`}>
                <EnrolledButton
                  className="!w-full"
                  height="48px"
                  $fontSize="14px"
                >
                  {hours > 0 ? (
                    `${new Date(competition.startAt).toLocaleDateString()} - ${new Date(competition.startAt).toLocaleTimeString()}`
                  ) : (
                    <div>
                      <span className={`text-white`}>
                        {minutes}{" "}
                        <span className="text-gray100 font-normal">m</span> :{" "}
                        {seconds}{" "}
                        <span className="text-gray100 font-normal">s</span>
                      </span>
                    </div>
                  )}
                </EnrolledButton>
              </Link>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EnrollModal
