"use client"
import { Checkbox } from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"
import { useController } from "react-hook-form"
import React from "react"

const CheckboxField: FC<InputBaseType> = ({
  control,
  name,
  className,
  label,
  rules,
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

  const { field, fieldState } = useController({
    name,
    control,
    rules: validations,
  })

  return (
    <Checkbox
      name={name}
      checked={field.value}
      onChange={field.onChange}
      className={className}
    >
      {label}
    </Checkbox>
  )
}

export default CheckboxField
