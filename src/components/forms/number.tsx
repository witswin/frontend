import { Input } from "@nextui-org/react"
import { FC } from "react"
import { InputBaseType } from "./types"
import { Controller } from "react-hook-form"
import { useFormValidations } from "./form"

const NumberField: FC<InputBaseType> = ({
  control,
  name,
  className,
  label,
  rules,
}) => {
  const mappedRules = useFormValidations({ rules })

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
          errorMessage={fieldState.error?.message}
        />
      )}
      name={name}
      rules={mappedRules}
      control={control}
    />
  )
}

export default NumberField
