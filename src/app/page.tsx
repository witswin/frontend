"use client"
import { FaMoneyCheckAlt } from "react-icons/fa"

import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react"
import Timer from "./(app)/quiz/[id]/components/timer"
import Icon from "@/components/ui/Icon"
import { indexesToABC } from "./(app)/quiz/[id]/components/questionPrompt"
import { Button, Card, CardFooter } from "@nextui-org/react"
import Link from "next/link"

const LandingPage = () => {
  return (
    <div className="container mx-auto">
      <HeaderSection />
      <ContentCardsSection />
    </div>
  )
}

const SponsorsSection = () => {}

const HeaderSection = () => {
  return (
    <section className="mt-26 flex-col md:flex-row flex justify-between items-center gap-6">
      <div>
        <span className="leading-loose">
          <div className="bg-clip-text text-transparent bg-primary-gradient text-7xl font-bold">
            WITS
          </div>
          <p className="text-sm mt-20 text-gray100">
            Here{"’"}s a place to ask, answer, and win!
          </p>
          <p className="text-sm mt-5 text-gray100">
            Let's show everyone who is the smartest!!
          </p>
        </span>
      </div>
      <QuizEditor />
    </section>
  )
}

const QuizEditor = () => {
  const [timer, setTimer] = useState(10000)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          setIsCorrect(true)
          clearInterval(timerInterval)
          return prev
        }
        return prev - 20
      })
    }, 20)

    return () => {
      clearInterval(timerInterval)
    }
  }, [])
  return (
    <div
      className="border-2 relative transform-gpu w-[525px] min-h-32 border-gray50 quiz-main-content rounded-lg p-6"
      style={{
        transform: "rotate3d(-21.5,-80.866,0,350deg) rotate(-1deg)",
        perspective: "700px",
        boxShadow:
          "0 27.5px 40px -17.5px rgba(0,0,0,.4),46.2px 37.5px 40px -17.5px rgba(0,0,0,.4)",
      }}
    >
      <div className="">
        <Timer timer={timer} className="!top-1 bg-gray10 border-gray40" />
      </div>
      <div className="mt-14">
        <div className="flex items-center text-xl justify-center">
          <h3 className="text-base inline-block text-center font-normal bg-g-primary text-transparent bg-clip-text">
            <span className="text-2xl font-semibold">W</span>
            ho
            <span className="text-2xl font-semibold"> I</span>s
            <span className="text-2xl font-semibold"> T</span>
            he
            <span className="text-2xl font-semibold"> S</span>
            martest
            <span className="text-2xl font-semibold"> ?</span>
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 font-semibold">
          {["You", "X Yazdani", "MohRez", "MrHoney"].map((item, key) => (
            <button
              key={key}
              onClick={() => setActiveIndex(key)}
              className={`relative rounded-xl text-sm border-2 border-gray40 bg-gray20 py-3 text-center text-white transition-colors ${
                isCorrect && key === 0
                  ? "!border-space-green !bg-dark-space-green"
                  : ""
              } ${activeIndex === key ? "!border-gray100 bg-gray60" : ""} `}
            >
              <span>{item}</span>

              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray70">
                <Icon
                  iconSrc="/assets/images/quizTap/shift.png"
                  width="16px"
                  height="16px"
                  alt="shift"
                />
                <span>{indexesToABC[key + 1]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const ContentCardsSection = () => {
  return (
    <div className="grid grid-cols-2 mt-28 gap-5 flex-wrap justify-center">
      <CartItem
        className="col-span-2"
        icon={<FaMoneyCheckAlt size={30} />}
        description="Wits interactive quiz platform is here to make learning about blockchain, cryptocurrencies, DeFi, and more exciting and rewarding! Test your skills, compete with others, and earn amazing rewards as you rise to the top. ready to prove you're the ultimate Web3 expert? Let the games begin!"
        title="For Users"
      >
        <Button className="bg-space-green text-black" as={Link} href="/quiz">
          Launch App
        </Button>
      </CartItem>
      <CartItem
        icon={<FaMoneyCheckAlt size={30} />}
        description={
          <>
            <p>
              Wits empowers Web3 projects to elevate their educational outreach
              and community engagement through dynamic, incentivizing quizzes.
            </p>
            <p>
              Create custom quizzes, offer enticing rewards, and host exciting
              competitions to boost your project's community engagement.
            </p>
            <p>
              Wits seamlessly integrates with Web3 ecosystems, providing
              valuable insights and supporting user onboarding and community
              growth.
            </p>
          </>
        }
        title="For Ecosystems"
      >
        <Button className="" disabled isDisabled as={Link} href="/quiz">
          Coming soon...
        </Button>
      </CartItem>
      <CartItem
        description="Wits transforms event engagement by adding real-time quizzes that turn attendees into active participants. Organizers can offer rewards such as tokens or NFTs to drive participation. This dynamic approach ensures your content leaves a lasting impression."
        icon={<FaMoneyCheckAlt size={30} />}
        title="For Events and Speeches"
      >
        <Button color="secondary" as={Link} href="mailto:team@wits.win">
          Contact us
        </Button>
      </CartItem>
    </div>
  )
}

const CartItem: FC<
  PropsWithChildren & {
    title: string
    description: string | ReactNode
    icon?: any
    className?: string
  }
> = ({ description, title, icon, className, children }) => {
  return (
    <Card
      shadow="none"
      className={`p-10 flex gap-5 justify-between bg-contain flex-col rounded-lg bg-no-repeat ${className ?? ""}`}
    >
      <div className="flex gap-4 items-center">
        <div className="">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className="text-gray100 leading-loose">{description}</div>
      <CardFooter className="justify-end gap-4">{children}</CardFooter>
    </Card>
  )
}

export default LandingPage
