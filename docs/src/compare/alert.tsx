import { createRoot } from "react-dom/client"
import { Alert, AlertTitle, AlertDescription } from "@/components/alert"
import { ComparisonRow } from "./comparison-row"

function AlertComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Alert className="max-w-sm">
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>This is an important message.</AlertDescription>
        </Alert>
      }
      hallucnHtml={`
        <hal-alert class="max-w-sm">
          <hal-alert-title>Heads up!</hal-alert-title>
          <hal-alert-description>This is an important message.</hal-alert-description>
        </hal-alert>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<AlertComparison />)
}
