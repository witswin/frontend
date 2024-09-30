import LandingStats from "@/components/containers/landing/stats"
import { HeaderSection, ContentCardsSection } from "./_components"

const LandingPage = () => {
  return (
    <div className="container mx-auto">
      <HeaderSection />
      <ContentCardsSection />
      <LandingStats />
    </div>
  )
}

export default LandingPage
