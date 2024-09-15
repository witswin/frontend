import { Control } from "react-hook-form"
import { FieldValidation } from "./form"

export type InputBaseType = {
  label?: string
  name: string
  control: Control<any>
  className?: string
  rules?: FieldValidation[]
}
