import { createRoot } from "react-dom/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table"
import { ComparisonRow } from "./comparison-row"

function TableComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bob</TableCell>
              <TableCell>Inactive</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
      hallucnHtml={`
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head>Name</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head>Role</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Alice</hal-table-cell>
              <hal-table-cell>Active</hal-table-cell>
              <hal-table-cell>Admin</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell>Bob</hal-table-cell>
              <hal-table-cell>Inactive</hal-table-cell>
              <hal-table-cell>User</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<TableComparison />)
}
