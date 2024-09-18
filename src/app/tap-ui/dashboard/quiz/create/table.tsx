"use client"

import { useState } from "react"
//import './index.css'
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  User,
  TableColumn,
} from "@nextui-org/react"
import { Input, Spacer } from "@nextui-org/react"
import React from "react"

const data = [
  {
    employeeId: "01",
    name: "John Doe",
    email: "johndoe@email.com",
    position: "Frontend Developer",
  },
  {
    employeeId: "02",
    name: "Sara",
    email: "sara@email.com",
    position: "HR Executive",
  },
  {
    employeeId: "03",
    name: "Mike",
    email: "mike@email.com",
    position: "Backend Developer",
  },
]

const EditableTable = () => {
  const [employeeData, setEmployeeData] = useState(data)

  const onChangeInput = (e, employeeId) => {
    const { name, value } = e.target

    const editData = employeeData.map((item) =>
      item.employeeId === employeeId && name
        ? { ...item, [name]: value }
        : item,
    )

    setEmployeeData(editData)
  }

  return (
    <div className="container">
      <h1 className="title">ReactJS Editable Table with NextUI Table</h1>
      <Table aria-label="Example table with static content">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          {employeeData.map(({ employeeId, name, email, position }) => (
            <TableRow key={employeeId}>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default EditableTable
