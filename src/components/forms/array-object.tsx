"use client"

import { Controller, useController } from "react-hook-form"
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"
import { Field, FieldType, RenderFields } from "./form"
import { FaPlus, FaTrashAlt } from "react-icons/fa"

const ArrayObject: FC<InputBaseType & { fields: Field[] }> = ({
  control,
  name,
  label,
  rules,
  fields,
  className = "",
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
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3>{label}</h3>

        <Button
          onClick={() =>
            field.onChange(field.value ? [...field.value, {}] : [{}])
          }
          isIconOnly
          color="primary"
        >
          <FaPlus />
        </Button>
      </div>

      <div className="flex mt-5 flex-col gap-6">
        {(field.value ?? []).map((item: any, key: number) => (
          <div key={key} className="p-2 pb-5 border-b border-divider">
            <div className="flex px-2 items-center justify-between mb-10">
              <p className="">Item {key + 1}</p>
              <FaTrashAlt
                className="text-error/60 cursor-pointer"
                onClick={() => {
                  field.value.splice(key, 1)
                  field.onChange([...field.value])
                }}
              />
            </div>
            <RenderFields
              fields={fields.map((item) => ({
                ...item,
                name: `${field.name}.${key}.${item.name}`,
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArrayObject
