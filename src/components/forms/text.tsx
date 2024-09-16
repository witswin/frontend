"use client"

import { Controller } from "react-hook-form"
import { Input } from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"
import { FieldType } from "./form"

const TextInput: FC<InputBaseType & { type?: FieldType }> = ({
  control,
  name,
  label,
  className,
  rules,
  type,
}) => {
  const validations = useMemo(() => {
    const obj: Record<string, any> = {}

    rules?.forEach((rule) => {
      obj[rule.type] = {
        message: rule.message,
        value: rule.value,
      }
    })

    return obj
  }, [rules])

  return (
    <Controller
      render={({ field, fieldState }) => {
        return (
          <Input
            type={type}
            name={name}
            onBlur={field.onBlur}
            value={field.value ?? ""}
            onChange={field.onChange}
            label={label + (validations.required ? " *" : "")}
            variant="bordered"
            className={className}
            isInvalid={fieldState.error !== undefined}
            errorMessage={fieldState.error?.message}
          />
        )
      }}
      name={name}
      control={control}
      rules={validations}
    />
  )
}

export default TextInput
