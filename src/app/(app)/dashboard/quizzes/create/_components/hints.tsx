"use client"

import { Avatar, Button, Select, SelectItem } from "@nextui-org/react"
import { useQuizCreateContext } from "../providers"
import { useController } from "react-hook-form"
import { FaTrashAlt } from "react-icons/fa"

export default function Hints() {
  const { control } = useQuizCreateContext()
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "builtinHints",
  })

  return (
    <div className="mt-10 flex flex-col gap-10">
      <div className="flex items-center gap-3 justify-between">
        <h3 className="font-semibold text-lg">Built in hints</h3>
        <Button
          variant="bordered"
          onClick={() => onChange([...value, { count: 1, hint: null }])}
          isIconOnly
        >
          +
        </Button>
      </div>
      <BuiltinHints value={value} onChange={onChange} />
    </div>
  )
}

export type BuiltinHintType = {
  hint: number
  count: number
}

function BuiltinHints({
  onChange,
  value,
}: {
  onChange: (value: BuiltinHintType[]) => void
  value: BuiltinHintType[]
}) {
  const { availableHints } = useQuizCreateContext()

  return value.map((hint, key) => (
    <div key={key} className="flex items-end gap-2 flex-col md:flex-row">
      <Select
        label="Count"
        items={[
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ]}
        selectedKeys={[hint.count?.toString()]}
        onSelectionChange={(newValue) => {
          value[key].count = Number([...newValue][0])

          onChange([...value])
        }}
        placeholder="amount of hint"
        labelPlacement="outside"
      >
        {(item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        )}
      </Select>
      <Select
        selectedKeys={[hint.hint?.toString()]}
        onSelectionChange={(newValue) => {
          value[key].hint = Number([...newValue][0])

          onChange([...value])
        }}
        items={availableHints.filter(
          (hint, index) =>
            index === key || !value.map((item) => item.hint).includes(hint.id),
        )}
        label="Registered hints"
        placeholder="Select a hint"
        labelPlacement="outside"
        className="max-w-xs"
      >
        {(hint) => (
          <SelectItem key={hint.id} value={hint.id} textValue={hint.title}>
            <div className="flex gap-2 items-center">
              <Avatar
                alt={hint.title}
                className="flex-shrink-0"
                size="sm"
                src={hint.image}
              />
              <div className="flex flex-col">
                <span className="text-small">{hint.title}</span>
                <span className="text-tiny text-default-400">
                  {hint.description}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
      <Button
        onClick={() => {
          value.splice(key, 1)

          onChange([...value])
        }}
        isIconOnly
        color="danger"
        variant="bordered"
      >
        <FaTrashAlt />
      </Button>
    </div>
  ))
}
