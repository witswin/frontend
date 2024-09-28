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
    <input
      placeholder={placeholder}
      type={type}
      className={`w-full placeholder:text-gray90 bg-transparent border-none h-5 ${size === "large" ? "text-lg font-semibold" : ""} ${className ?? ""}`}
      name={name}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
    />
  )
}

export default TextInput
