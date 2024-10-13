"use client"

import Image from "next/image"
import { useQuizTapListContext } from "@/context/quiztapListProvider"
import {
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react"
import { FC, useEffect, useState } from "react"
import Icon from "@/components/ui/Icon"
import {
  ClaimAndEnrollButton,
  EnrolledButton,
} from "@/components/ui/Button/button"
import { enrollQuizApi } from "@/utils/api"
import { useTimer } from "@/utils/hooks/timer"
import Link from "next/link"
import { fromWei } from "@/utils"
import { useRouter } from "next/navigation"

import { Hint } from "@/types"
import { toast } from "react-toastify"

export const HintItem: FC<{ hint: Hint; count?: number }> = ({
  hint,
  count = 1,
}) => {
  return (
    <div className="flex px-2 flex-1 items-center justify-evenly rounded-xl border border-gray70 bg-gray50">
      <Icon
        alt="hint"
        className="py-1 mr-2"
        iconSrc={hint.icon}
        width="25px"
        height="25px"
      />
      <span className="py-1">{hint.title}</span>
      <span className="ml-auto border-l-2 text-sm border-gray70 py-1 pl-2">
        x {count}
      </span>
    </div>
  )
}

const ChooseHintEnroll: FC<{
  addedHints: number[]
  setAddedHints: (value: number[]) => void
}> = ({ addedHints, setAddedHints }) => {
  const { userHints, selecetedCompetition } = useQuizTapListContext()

  const achivements = userHints.achivements.filter(
    (c) =>
      !c.isUsed &&
      selecetedCompetition &&
      selecetedCompetition.allowedHintTypes.find((item) => item.id === c.hint),
  )

  const availableHintCount = Math.max(
    (selecetedCompetition?.hintCount ?? 0) -
      (selecetedCompetition?.builtInHints?.reduce(
        (prev, curr) => curr.count + prev,
        0,
      ) ?? 0),
    0,
  )

  if (!achivements.length) return null

  return (
    <div className="my-2">
      <p className="text-left text-sm mb-3">
        achived hints ({availableHintCount})
      </p>
      <div className="flex-wrap flex items-center gap-2">
        {achivements.map((achivement, key) => (
          <div
            key={key}
            className={"p-2 px-4 rounded-3xl bg-gray10 border border-divider"}
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={addedHints.includes(achivement.pk)}
                onChange={() => {
                  const index = addedHints.findIndex(
                    (item) => item === achivement.pk,
                  )
                  if (index !== -1) {
                    addedHints.splice(index, 1)
                    setAddedHints([...addedHints])
                  } else {
                    setAddedHints([...addedHints, achivement.pk])
                  }
                }}
                isDisabled={availableHintCount <= 0}
                size="sm"
              ></Checkbox>
              <div>
                <p className="text-gray100 text-sm">
                  {userHints.hints[achivement.hint]?.title}
                </p>
              </div>

              {!!userHints.hints[achivement.hint]?.icon && (
                <Icon
                  iconSrc={userHints.hints[achivement.hint].icon}
                  alt={userHints.hints[achivement.hint].title}
                  width="20"
                  height="20"
                  className="w-4 h-4"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EnrollModal: FC<{}> = () => {
  const {
    modalState,
    setModalState,
    selecetedCompetition,
    addEnrollment,
    enrollmentsList,
  } = useQuizTapListContext()

  const [addedHints, setAddedHints] = useState<number[]>([])

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const competition = selecetedCompetition!

  const { minutes, seconds, hours, days } = useTimer(competition?.startAt)

  const isEnrolled =
    enrollmentsList.findIndex(
      (raffle) =>
        (typeof raffle.competition === "number"
          ? raffle.competition
          : raffle.competition.id) === competition?.id,
    ) !== -1

  const onEnroll = () => {
    setLoading(true)
    enrollQuizApi(competition.id, addedHints)
      .then((res) => {
        addEnrollment(res)
      })
      .catch((err) => {
        if (err.response.data) {
          toast.error(err.response.data.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (
      days === 0 &&
      hours === 0 &&
      minutes <= 1 &&
      modalState !== "closed" &&
      !!competition &&
      isEnrolled
    ) {
      timeout = setTimeout(() => {
        router.push(`/quiz/${competition.id}/`)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [minutes, seconds, days, hours, competition])

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
          <div className="grid grid-cols-2 mt-2 gap-2 ">
            <div className="flex px-2 justify-evenly flex-1 py-1 items-center rounded-xl border border-gray70 bg-gray50">
              <p className="text-sm font-normal leading-[22px] text-gray100">
                Prize
              </p>
              <p className="bg-prize-text-gradient bg-clip-text text-sm font-semibold leading-[20px] text-transparent">
                {fromWei(competition?.prizeAmount, competition?.tokenDecimals) +
                  " " +
                  competition?.token}{" "}
              </p>
            </div>

            {competition?.builtInHints.map((hint, key) => (
              <HintItem hint={hint.hint} count={hint.count} key={key} />
            ))}
          </div>
          <div className="flex gap-2 ">
            <div className="p-3 flex-1 rounded-xl text-center border border-gray60 bg-gray40">
              <h5 className="text-white font-semibold">
                {selecetedCompetition?.questionTimeSeconds} Sec
              </h5>
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

          {isEnrolled ? (
            <div></div>
          ) : (
            <ChooseHintEnroll
              addedHints={addedHints}
              setAddedHints={setAddedHints}
            />
          )}

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
              <Link
                href={
                  hours > 0 || minutes > 15 ? "#" : `/quiz/${competition.id}`
                }
              >
                <EnrolledButton
                  className="!w-full hover:bg-space-green/20 transition-colors"
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
