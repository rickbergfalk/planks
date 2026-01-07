import { createRoot } from "react-dom/client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination"
import { ComparisonRow } from "./comparison-row"

function PaginationComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      }
      hallucnHtml={`
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-previous href="#"></hal-pagination-previous>
            </hal-pagination-item>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
            <hal-pagination-item>
              <hal-pagination-link href="#" active>2</hal-pagination-link>
            </hal-pagination-item>
            <hal-pagination-item>
              <hal-pagination-link href="#">3</hal-pagination-link>
            </hal-pagination-item>
            <hal-pagination-item>
              <hal-pagination-next href="#"></hal-pagination-next>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<PaginationComparison />)
}
