import { Input } from "@nextui-org/react"
import { FC, ReactNode } from "react"
import { Control, useController } from "react-hook-form"

const TextInput: FC<{
  size?: "md" | "large"
  type?: "text" | "number" | "email"
  control: Control<any, any>
  name: string
  placeholder?: string
  className?: string
  label?: ReactNode
}> = ({ control, size, type, name, placeholder, className, label }) => {
  const {
    field: { value, onChange, onBlur },
  } = useController({
    name,
    control,
  })

  return (
    <Input
      aria-label={name}
      placeholder={placeholder}
      type={type}
      className={`placeholder:text-gray90 bg-transparent border-none ${className ?? ""}`}
      size={size === "large" ? "md" : "sm"}
      name={name}
      onBlur={onBlur}
      variant="underlined"
      value={value}
      onChange={(e) =>
        onChange(type === "number" ? Number(e.target.value) : e.target.value)
      }
      label={label}
    />
  )
}

export default TextInput
