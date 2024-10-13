"use client"

import { useQuizCreateContext } from "../providers"
import Hints from "./hints"
import TextInput from "./text-input"

export default function PersonalData() {
  const { control } = useQuizCreateContext()

  return (
    <div>
      <TextInput
        control={control!}
        name="emailUrl"
        placeholder="Email"
        type="email"
        label="Email"
      />

      <TextInput
        control={control!}
        name="telegramUrl"
        placeholder="Telegram"
        className="mt-10"
        label="Telegram URL"
      />

      <TextInput
        control={control!}
        name="discordUrl"
        placeholder="Discord Url"
        className="mt-10"
        label="Discord URL"
      />

      <Hints />
    </div>
  )
}
