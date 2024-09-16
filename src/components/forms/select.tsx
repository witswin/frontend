"use client"

import { Controller } from "react-hook-form"
import { Input, Select, SelectItem } from "@nextui-org/react"
import { FC, ReactNode, useMemo } from "react"
import { InputBaseType } from "./types"

const SelectInput: FC<
  InputBaseType & { options: { label: ReactNode; value: string }[] }
> = ({ control, name, label, className, rules, options }) => {
  const validations = useMemo(() => {
    const obj: Record<string, any> = {}

    rules?.forEach((rule) => {
      obj[rule.type] = rule.value
    })

    return obj
  }, [rules])

  return (
    <Controller
      render={({ field, fieldState }) => (
        <Select
          name={name}
          selectedKeys={[field.value ?? ""]}
          onSelectionChange={(e) => field.onChange([...e].at(0))}
          label={label}
          variant="bordered"
          className={className}
          errorMessage={fieldState.error?.message}
        >
          {options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      )}
      name={name}
      control={control}
      rules={validations}
    />
  )
}

export default SelectInput
