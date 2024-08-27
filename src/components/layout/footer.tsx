import { FC } from "react"
import Icon from "../ui/Icon"
import Link from "next/link"

const Footer: FC = () => {
  return (
    <footer className="hidden h-16 w-full items-center justify-center p-3 gap-4 md:flex">
      <Link href="https://t.me/WitsWin" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/telegram.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>

      <Link href="https://twitter.com/WitsWin" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/twitter.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>

      <Link href="https://github.com/UnitapApp" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/github.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>
      <Link href="https://discord.com/invite/JGM7thc5" target="_blank">
        <Icon
          iconSrc="/assets/images/footer/discord.svg"
          width="34px"
          height="auto"
          className="mr-4"
          hoverable
        ></Icon>
      </Link>
      <Link
        className="!absolute right-10"
        target="_blank"
        href="https://unitap.app"
      >
        <Icon iconSrc="/PoweredbyUnitap.svg" width="160px" height="auto"></Icon>
      </Link>
    </footer>
  )
}

export default Footer
