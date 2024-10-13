"use client"

import TextInput from "@/components/forms/text"
import Icon from "@/components/ui/Icon"
import { FAST_INTERVAL } from "@/constants"
import { useUserProfileContext } from "@/context/userProfile"
import { Hint, HintAchivement } from "@/types"
import { NullCallback } from "@/utils"
import { fetchHintsAndAchivements, setUsernameApi } from "@/utils/api"
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh"
import { Button, Card } from "@nextui-org/react"

import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import {
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiFarcaster } from "react-icons/si"
import { toast } from "react-toastify"

const IntegrationConnectButton: FC<{
  isConnected: boolean
  onClick: () => void
}> = ({ isConnected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isConnected}
      color={isConnected ? "success" : "default"}
      size="sm"
      className="ml-auto px-5"
    >
      {isConnected ? "Connected" : "Connect"}
    </Button>
  )
}

const ProfileFormEdit = () => {
  const { userProfile, updateUsername } = useUserProfileContext()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: userProfile?.username,
    },
  })

  const [loading, setLoading] = useState(false)

  const onSubmit = (data: any) => {
    setLoading(true)
    setUsernameApi(data.username)
      .then(() => {
        updateUsername(data.username)
        toast.success("Username updated successfully")
      })
      .finally(() => setLoading(false))
  }

  return (
    <form
      className="mt-5 p-5 border border-divider rounded-xl bg-gray20"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-2 gap-y-10 gap-3">
        <TextInput
          control={control}
          className="col-span-2"
          name="username"
          label="Username"
        />
        <TextInput control={control} name="firstName" label="Last Name" />
        <TextInput control={control} name="lastName" label="First Name" />
      </div>

      <div className="text-right mt-10">
        <Button isLoading={loading} type="submit" color="primary">
          Submit
        </Button>
      </div>
    </form>
  )
}

const ProfilePage = () => {
  return (
    <div>
      <h3>Profile</h3>
      <ProfileFormEdit />
      <hr className="my-10 border-divider" />
      <h3>Integrations</h3>

      <form className="mt-5 p-5 border border-divider rounded-xl bg-gray20">
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <FaGoogle size={20} />
            <span>Google</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <FaXTwitter size={20} />
            <span>Twitter</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <FaDiscord size={20} />
            <span>Discord</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <FaLinkedin size={20} />
            <span>Linked In</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <FaGithub size={20} />
            <span>Github</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
          <Card
            className="p-3 flex items-center flex-row gap-8 bg-gray50"
            shadow="none"
          >
            <SiFarcaster size={20} />
            <span>Farcaster</span>
            <IntegrationConnectButton
              isConnected={!!false}
              onClick={NullCallback}
            />
          </Card>
        </div>
      </form>

      <hr className="my-10 border-divider" />
      <h3>Achived Hints</h3>
      <HintsView />
    </div>
  )
}

const HintsView = () => {
  const [hints, setHints] = useState<{
    achivements: HintAchivement[]
    hints: Record<number, Hint>
  }>({
    achivements: [],
    hints: {},
  })

  useRefreshWithInitial(
    () => {
      fetchHintsAndAchivements().then((res) => {
        setHints({
          achivements: res.achivements,
          hints: res.hints.reduce(
            (prev, curr) => {
              prev[curr.id] = curr

              return prev
            },
            {} as Record<number, Hint>,
          ),
        })
      })
    },
    FAST_INTERVAL,
    [],
  )

  return (
    <div className="mt-5 p-5 mb-10 border border-divider flex-wrap flex items-center gap-4 rounded-xl bg-gray20">
      {hints.achivements.map((achivement, key) => (
        <div
          key={key}
          className={`p-2 rounded-lg border border-divider ${achivement.isUsed ? "opacity-30" : ""}`}
        >
          <div className="flex items-center gap-2">
            <div>
              <p className="text-gray100">
                {hints.hints[achivement.hint].title}
              </p>
              <p className="text-gray90 text-sm">
                {hints.hints[achivement.hint].description}
              </p>
            </div>

            {!!hints.hints[achivement.hint].icon && (
              <Icon
                iconSrc={hints.hints[achivement.hint].icon!}
                alt={hints.hints[achivement.hint].title}
                width="30"
                height="30"
                className="w-8 h-8"
              />
            )}
          </div>
          <p className="text-xs mt-3 text-gray100">
            Achived at {new Date(achivement.createdAt).toDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ProfilePage
