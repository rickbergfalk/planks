import { createRoot } from "react-dom/client"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/empty"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function EmptyComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Empty className="border max-w-sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </EmptyMedia>
            <EmptyTitle>No messages</EmptyTitle>
            <EmptyDescription>
              Your inbox is empty. New messages will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Compose</Button>
          </EmptyContent>
        </Empty>
      }
      hallucnHtml={`
        <hal-empty class="border max-w-sm">
          <hal-empty-header>
            <hal-empty-media variant="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
            </hal-empty-media>
            <hal-empty-title>No messages</hal-empty-title>
            <hal-empty-description>Your inbox is empty. New messages will appear here.</hal-empty-description>
          </hal-empty-header>
          <hal-empty-content>
            <hal-button size="sm">Compose</hal-button>
          </hal-empty-content>
        </hal-empty>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<EmptyComparison />)
}
