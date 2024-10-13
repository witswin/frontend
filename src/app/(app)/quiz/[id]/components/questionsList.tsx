import { useQuizContext } from "@/context/quizProvider"
import { FC, Fragment, useEffect, useRef } from "react"

const QuestionsList = () => {
  const { quiz } = useQuizContext()
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex min-w-72 w-fit sm:w-full justify-center rounded-xl border-2 border-gray50 bg-gray20/30 p-3">
        {quiz?.questions.map((question, index) => (
          <Fragment key={index}>
            <QuestionItem index={index + 1} />
            {index < quiz.questions.length - 1 && (
              <Separator index={index + 1} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

const Separator: FC<{ index: number }> = ({ index }) => {
  const { stateIndex, timer, isRestTime, restPeriod } = useQuizContext()

  const width =
    isRestTime && index === stateIndex
      ? Math.min((28 * (restPeriod - timer)) / restPeriod, restPeriod)
      : stateIndex > index
        ? 28
        : 0

  return (
    <div className="relative mx-2 my-auto h-[2px] w-7 rounded-2xl bg-gray50">
      <div
        className="absolute bottom-0 left-0 top-0 rounded-2xl h-[2px] bg-gray100"
        style={{ width, minWidth: width }}
      ></div>
    </div>
  )
}

const QuestionItem: FC<{ index: number }> = ({ index }) => {
  const {
    stateIndex,
    timer,
    isRestTime,
    answersHistory,
    userAnswersHistory,
    statePeriod,
  } = useQuizContext()

  const ref = useRef<SVGRectElement>(null)

  useEffect(() => {
    var progress: any = ref.current

    if (!progress) return
    let frameCount = 0
    let anim: number

    const timeout = setTimeout(() => {
      var borderLen = progress.getTotalLength() + 5,
        offset = borderLen
      progress.style.strokeDashoffset = borderLen
      progress.style.strokeDasharray = borderLen + "," + borderLen

      let durationInSeconds =
        statePeriod / 1000 - (statePeriod / 1000 - timer / 1000)

      durationInSeconds += durationInSeconds / 18

      const framesPerSecond = 60

      const totalFrames = durationInSeconds * framesPerSecond
      const decrementAmount = borderLen / totalFrames

      let startTime: number | null = null

      function progressBar(timestamp: number) {
        if (!startTime) {
          startTime = timestamp
        }

        const elapsed = timestamp - startTime
        const progressPercent = elapsed / (durationInSeconds * 1000)
        offset = borderLen - progressPercent * borderLen
        progress.style.strokeDashoffset = offset

        if (elapsed < durationInSeconds * 1000) {
          anim = window.requestAnimationFrame(progressBar)
        } else {
          window.cancelAnimationFrame(anim)
        }
      }

      // Start animation
      anim = window.requestAnimationFrame(progressBar)
    }, 0)

    // Clean up on component unmount or state change
    return () => {
      window.cancelAnimationFrame(anim)
      clearTimeout(timeout)
    }
  }, [stateIndex])

  if (stateIndex > index || isRestTime)
    return (
      <div
        className={`relative grid h-9 w-9 min-w-9 min-h-9 place-content-center rounded-lg border-2 ${index > stateIndex ? "border-gray50" : userAnswersHistory[index - 1] === null || userAnswersHistory[index - 1] === undefined || answersHistory[index - 1] === undefined || answersHistory[index - 1] === null ? "border-gray100" : userAnswersHistory[index - 1] === answersHistory[index - 1] ? "border-mid-dark-space-green" : "border-error/40"} bg-gray20 text-gray100`}
      >
        {index}
      </div>
    )

  return (
    <div
      className={`progress relative min-w-9 min-h-9 h-9 w-9 rounded-lg  ${index > stateIndex ? "border-2 border-gray50" : index === stateIndex ? "" : "border-2 border-dark-space-green"} bg-gray20 text-gray100`}
    >
      <div className="absolute inset-0 grid place-content-center text-sm">
        {index}
      </div>
      {index === stateIndex && (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={ref}
            x="1"
            y="1"
            width="34"
            height="34"
            rx="7"
            stroke="#b5b5c6"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  )
}

export default QuestionsList
