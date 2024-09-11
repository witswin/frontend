import { Control } from "react-hook-form"

export type InputBaseType = {
  label?: string
  name: string
  control: Control<any>
  className?: string
}
