"use client"

import { Controller, useController } from "react-hook-form"
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"
import { Field, FieldType, RenderFields } from "./form"
import { FaPlus } from "react-icons/fa"

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
    <Card className={`p-4 ${className}`}>
      <CardHeader className="justify-between">
        <h4>{label}</h4>

        <Button isIconOnly color="primary">
          <FaPlus
            onClick={() => field.onChange([...(field.value ?? []), {}])}
          />
        </Button>
      </CardHeader>

      <CardBody className="flex flex-col gap-6">
        {(field.value ?? []).map((item: any, key: number) => (
          <div key={key} className="p-2 border border-divider rounded-md">
            <p className="mb-10">Item {key + 1}</p>
            <RenderFields
              fields={fields.map((item) => ({
                ...item,
                name: `${field.name}.${key}.${item.name}`,
              }))}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default ArrayObject
