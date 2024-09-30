"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@nextui-org/react"
import { Competition } from "@/types"

import { FetchUserQuizzes } from "@/utils/api"
import { fromWei } from "@/utils"
import { FaPlusCircle } from "react-icons/fa"
import Link from "next/link"

const CompetitionTable = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([])

  useEffect(() => {
    const fetchCompetitions = async () => {
      setCompetitions(await FetchUserQuizzes())
    }

    fetchCompetitions()
  }, [])

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h3>Quiz List</h3>
        <Button
          as={Link}
          href="/dashboard/quizzes/create"
          color="primary"
          startContent={<FaPlusCircle />}
        >
          Create a Quiz
        </Button>
      </div>
      <Table aria-label="Competitions Table">
        <TableHeader>
          <TableColumn>Title</TableColumn>
          <TableColumn>Sponsors</TableColumn>
          <TableColumn>Start Date</TableColumn>
          <TableColumn>Prize Amount</TableColumn>
          <TableColumn>Details</TableColumn>
        </TableHeader>
        <TableBody>
          {competitions.map((competition) => (
            <TableRow key={competition.id}>
              <TableCell>{competition.title}</TableCell>
              <TableCell>-{/* {competition.sponsors?.join(", ")} */}</TableCell>
              <TableCell>
                {new Date(competition.startAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {fromWei(
                  competition.prizeAmount,
                  competition.tokenDecimals ?? 18,
                )}{" "}
                $
              </TableCell>
              <TableCell>{competition.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompetitionTable
