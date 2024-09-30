import { countStatsAPI } from "@/utils/api"
import Widget from "./widget"
import { FC } from "react"
import { numberWithCommas } from "@/utils"

const LandingStats: FC = async ({}) => {
  const stats = await countStatsAPI()

  return (
    <section id="home-stats" className={"flex mb-12 justify-between gap-4"}>
      <Widget
        className={
          "flex-1 px-20 !pb-7 !pt-5 after:inset-auto after:left-0 after:top-0 after:h-28 after:w-36 after:bg-stats-texture"
        }
        title={"Wits Stats"}
        titleClass={"!justify-center"}
      >
        <div
          className={
            "mt-4 flex flex-col justify-evenly gap-4 md:flex-row md:gap-0"
          }
        >
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {numberWithCommas(stats.allUsersCount)}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Wits Users
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {numberWithCommas(stats.competitionsCount)}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Competitions Created
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {numberWithCommas(stats.userEnrollmentsCount)}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Users participated
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={"text-xl font-semibold text-space-green"}>
              {stats.totalPrizeAmount}
            </p>
            <p className={"text-gradient-primary text-xs font-medium"}>
              {" "}
              Total Prize Amount
            </p>
          </div>
        </div>
      </Widget>
    </section>
  )
}

export default LandingStats
