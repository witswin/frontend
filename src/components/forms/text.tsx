"use client"

import { Controller } from "react-hook-form"
import { Input } from "@nextui-org/react"
import { FC } from "react"
import { InputBaseType } from "./types"

const TextInput: FC<InputBaseType> = ({ control, name, label, className }) => {
  return (
    <Controller
      render={({ field, fieldState }) => (
        <Input
          name={name}
          value={field.value ?? ""}
          onChange={field.onChange}
          label={label}
          variant="bordered"
          className={className}
        />
      )}
      name={name}
      control={control}
    />
  )
}

export default TextInput
