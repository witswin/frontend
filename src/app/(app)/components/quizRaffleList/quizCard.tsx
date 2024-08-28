import {
  ClaimAndEnrollButton,
  EnrolledButton,
  PrimaryOutlinedButton,
} from "@/components/ui/Button/button"
import Tooltip from "@/components/ui/Tooltip"
import { Competition } from "@/types"
import { FC, useMemo, useState } from "react"
import CompetitionCardTimer from "../timer"
import Image from "next/image"
import Icon from "@/components/ui/Icon"
import { enrollQuizApi } from "@/utils/api"
import { useQuizTapListContext } from "@/context/quiztapListProvider"
import Link from "next/link"

const QuizCard: FC<{ competition: Competition }> = ({ competition }) => {
  const [showAllPermissions, setShowAllPermissions] = useState(false)

  const [loading, setLoading] = useState(false)
  const [enterState, setEnterState] = useState(0)
  const {
    enrollmentsList,
    addEnrollment,
    setModalState,
    setSelectedCompetition,
  } = useQuizTapListContext()

  const onEnroll = () => {
    // setLoading(true)

    // enrollQuizApi(competition.id)
    //   .then((res) => {
    //     addEnrollment(res)
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //   })

    setSelectedCompetition(competition)
    setModalState("enroll")
  }

  const isEnrolled =
    enrollmentsList.findIndex(
      (raffle) =>
        (typeof raffle.competition === "number"
          ? raffle.competition
          : raffle.competition.id) === competition.id
    ) !== -1

  return (
    <div className="quiz_card_wrap bg-quiz-header-bg relative !mb-5 flex flex-col items-center justify-center rounded-2xl border-2 border-gray60 sm:flex-row lg:border-l-gray10 ">
      <div className="left-side relative flex min-h-[175px] min-w-[165px] items-center rounded-br-[100px] rounded-tr-[100px] before:h-[21px] before:w-5 before:rounded-bl-[150px] before:rounded-tl-[150px] before:content-[''] after:absolute after:h-[23px] after:w-5 after:rounded-bl-[100px] after:rounded-tl-[100px] after:content-[''] lg:bg-[#10101B]  lg:shadow-[inset_-2px_0px_0_2px_#242431]  lg:before:absolute  lg:before:left-20  lg:before:top-[-18px]  lg:before:bg-[#1e1e273a]  lg:before:shadow-[-26px_-0px_0_15px_#10101B,inset_1px_1px_0_1px_#242431]  lg:after:bottom-[-19px]  lg:after:left-[80px]  lg:after:bg-[#1d1d273f]  lg:after:shadow-[-23px_-0px_0_15px_#10101B,inset_1px_0px_0_1px_#242431]">
        <div className="relative h-[135px] w-[135px] rounded-[100%] content-[''] lg:before:absolute lg:before:bottom-[-45px] lg:before:h-[30px] lg:before:w-[60px] lg:before:bg-[#10101B] lg:before:content-[''] lg:after:absolute lg:after:top-[-45px] lg:after:h-[30px] lg:after:w-[60px] lg:after:bg-[#10101B]">
          <Image
            src={competition.image ?? "/assets/images/quizTap/usdt.svg"}
            alt={competition.prizeAmount + " " + competition.token}
            width="135"
            height="133"
          />
        </div>
      </div>
      <div className="right-side w-full rounded-2xl p-5">
        <div className="top mb-3 flex flex-col items-start justify-between gap-3 lg:mb-0 lg:flex-row lg:gap-0">
          <div className="title-wrap flex flex-col justify-center gap-1 md:flex-row md:items-center">
            <div className="title flex items-center gap-1 text-base font-semibold leading-5 text-white">
              {competition.title}
              <div className="h-1 w-1 rounded-full bg-[#D9D9D9]"></div>
            </div>
            <div className="text-sm font-normal leading-5 text-gray100">
              {competition.details}
            </div>
          </div>
          {competition.sponsors.length ? (
            <div className="sponsors flex h-[38px] items-center justify-between gap-5 rounded-xl bg-gray10 px-5">
              <p className="text-xs font-medium leading-[22px] text-gray90">
                Sponsored By
              </p>
              {competition.sponsors.map((sponsor, key) => (
                <Link href={sponsor.link} key={key} target="_blank">
                  <Icon
                    className="h-5 w-5 grayscale"
                    iconSrc={sponsor.image}
                    alt="polygon"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="prize_amount flex h-[30px] max-w-[149px] items-center justify-center gap-[10px] rounded-md border border-gray70 bg-gray50">
          <p className="text-xs font-normal leading-[22px] text-gray100">
            Prize
          </p>
          <p className="bg-prize-text-gradient bg-clip-text text-sm font-semibold leading-[20px] text-transparent">
            {competition.prizeAmount + " " + competition.token}{" "}
          </p>
        </div>
        <div className="requirements mt-4 flex h-[22px] gap-2"></div>

        <div className="footer mt-3 flex w-full flex-col justify-between gap-4 lg:flex-row lg:items-center ">
          <div className="counter flex w-full max-w-[520px] flex-col justify-between rounded-xl border-2 border-gray60 bg-gray10 px-4 py-2 md:flex-row md:items-center md:p-0 md:pl-16 md:pr-12">
            <p className="text-2xs font-medium leading-[13.62px] text-gray100">
              {competition.participantsCount} people enrolled
            </p>
            <CompetitionCardTimer
              setEnterState={setEnterState}
              startTime={competition.startAt}
            />
          </div>

          {enterState < -20 ? (
            <Link
              href={`/quiz/${competition.id}`}
              className="px-5 flex font-semibold gap-4 border-2 border-gray90 py-2 bg-gray40 rounded-xl items-center"
            >
              <div className="relative w-full">
                <span className="text-gray100">Watch as spectator</span>
              </div>
              <Icon
                className="opacity-70"
                iconSrc="assets/images/provider-dashboard/ic_link_white.svg"
                width="18px"
                height="12px"
              />
            </Link>
          ) : isEnrolled ? (
            enterState < 60 * 30 ? (
              <Link href={`/quiz/${competition.id}`}>
                <PrimaryOutlinedButton
                  height="48px"
                  $fontSize="14px"
                  $width="252px"
                  className="!w-full before:!bg-g-dark-primary-gradient min-w-[552px] md:!w-[352px]"
                >
                  <div className="relative w-full">
                    {enterState < 0 ? (
                      <div className="flex items-center w-full justify-between">
                        <p className="bg-g-primary bg-clip-text text-transparent">
                          Start
                        </p>
                        <div className="text-white font-normal font-digital-numbers">
                          {enterState.toFixed(0)}
                        </div>
                      </div>
                    ) : (
                      <p className="bg-g-primary bg-clip-text text-transparent">
                        {"Go to Lobby"}
                      </p>
                    )}
                  </div>
                </PrimaryOutlinedButton>
              </Link>
            ) : (
              <EnrolledButton
                onClick={onEnroll}
                className="!w-full  min-w-[552px] md:!w-[352px]"
                height="48px"
                $fontSize="14px"
              >
                <div className="relative">
                  <div
                    className={`bg-g-primary text-center bg-clip-text text-transparent`}
                  >
                    Enrolled
                  </div>
                </div>
              </EnrolledButton>
            )
          ) : (
            <ClaimAndEnrollButton
              onClick={onEnroll}
              height="48px"
              $fontSize="14px"
              $width="252px"
              disabled={loading}
              className="!w-full min-w-[552px] md:!w-[352px]"
            >
              <div className="relative w-full">
                <p className="bg-g-primary bg-clip-text text-transparent">
                  {loading ? "Enrolling..." : "Enroll"}
                </p>
              </div>
            </ClaimAndEnrollButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizCard
