import { Input } from "@nextui-org/react"
import { FC } from "react"
import { Control, useController } from "react-hook-form"

const TextInput: FC<{
  size?: "md" | "large"
  type?: "text" | "number"
  control: Control<any, any>
  name: string
  placeholder?: string
  className?: string
}> = ({ control, size, type, name, placeholder, className }) => {
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
      onChange={onChange}
    />
  )
}

export default TextInput
