import { FC, PropsWithChildren } from "react"

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="m-auto flex min-h-[calc(100vh_-_130px)] w-full max-w-screen-2xl flex-col px-4 sm:px-6 lg:px-8 xl:px-40 xl1440:px-60">
      {children}
    </main>
  )
}

export default AppLayout
