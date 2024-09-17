import { FC, PropsWithChildren } from "react"
import Sidebar from "./sidebar"

const TapUILayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-t tap-ui bg-primary-background border-t-divider">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default TapUILayout
