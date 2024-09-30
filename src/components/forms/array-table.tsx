"use client"

import { Controller, useController } from "react-hook-form"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react"
import { FC, useMemo } from "react"
import { InputBaseType } from "./types"
import { Field, FieldType, FormField, RenderFields } from "./form"
import { FaPlus, FaTrashAlt } from "react-icons/fa"

const ArrayTableField: FC<InputBaseType & { fields: Field[] }> = ({
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
      <Table className="mt-6" aria-label={label + "| Table form"}>
        <TableHeader>
          {fields
            .map((item, key) => (
              <TableColumn key={key}>{item.label}</TableColumn>
            ))
            .concat([<TableColumn key={-1}>Actions</TableColumn>])}
        </TableHeader>
        <TableBody>
          {field.value?.map((row: any, key: number) => (
            <TableRow key={key}>
              {fields
                .map((item, key2) => (
                  <TableCell key={key2}>
                    <FormField
                      field={{
                        ...item,
                        name: `${name}.${key}.${item.name}`,
                        label: "",
                      }}
                    />
                  </TableCell>
                ))
                .concat([
                  <TableCell key={-1}>
                    <FaTrashAlt
                      className="text-error/60 cursor-pointer"
                      onClick={() => {
                        field.value.splice(key, 1)
                        field.onChange([...field.value])
                      }}
                    />
                  </TableCell>,
                ])}
              {/* <TableCell>
                <Input
                  aria-label="test"
                  name="name"
                  value={name}
                  type="text"
                  onChange={(e) => onChangeInput(e, employeeId)}
                />
              </TableCell>
              <TableCell>
                <Input
                  aria-label="test"
                  name="name"
                  value={position}
                  type="text"
                  onChange={(e) => onChangeInput(e, employeeId)}
                />
              </TableCell>
              <TableCell>
                <Input
                  aria-label="test"
                  name="name"
                  value={email}
                  type="text"
                  onChange={(e) => onChangeInput(e, employeeId)}
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ArrayTableField
