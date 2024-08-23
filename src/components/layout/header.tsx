"use client"

import Image from "next/image"
import Link from "next/link"

import dynamic from "next/dynamic"
import { Button } from "@nextui-org/react"
import { FaArrowRight } from "react-icons/fa"
import { usePathname } from "next/navigation"

const UserAuthStatus = dynamic(() => import("./auth"), { ssr: false })

const Header = () => {
  const path = usePathname()
  return (
    <header className="top-0 z-20 flex w-full items-center bg-gray10 px-8 py-3 text-xs">
      <Link href={"/"}>
        <Image
          src="/assets/images/navbar/logo.svg"
          width={40}
          height={40}
          alt="unitap"
        />
      </Link>

      <UserAuthStatus />

      <div className="hidden flex-1 md:flex"></div>

      <div className="hidden md:flex">
        {path === "/" && (
          <Button
            endContent={<FaArrowRight />}
            as={Link}
            href="/quiz"
            color="primary"
          >
            Launch Now!
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
