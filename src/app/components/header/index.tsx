import { Noto_Sans } from "next/font/google"

const headerFont = Noto_Sans({})

const Header = () => {
  return (
    <header
      className={`mb-6 w-full overflow-hidden rounded-2xl border-3 text-left border-gray30 bg-gray20 bg-[url('/assets/images/quizTap/Lines.svg')] bg-cover bg-center bg-no-repeat p-4 ${headerFont.className}`}
    >
      <div className="mt-8 h-auto items-center">
        <span className="">
          <div className="bg-clip-text text-transparent bg-primary-gradient text-3xl font-bold">
            WITS
          </div>
          <p className="text-gray100 mt-4 font-semibold">Who Is The Smartest</p>
          <p className="text-sm mt-4 text-gray100">
            Here{"’"}s a place to ask, answer, and win!
          </p>
          <p className="text-sm mt-1 text-gray100">
            Let's show everyone who is the smartest!!
          </p>
        </span>
      </div>
    </header>
  )
}

export default Header
