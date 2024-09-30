"use client"

import TextInput from "@/components/forms/text"
import { useUserProfileContext } from "@/context/userProfile"
import { NullCallback } from "@/utils"
import { setUsernameApi } from "@/utils/api"
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

const ProfilePage = () => {
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
    <div>
      <h3>Profile</h3>

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
    </div>
  )
}

export default ProfilePage
