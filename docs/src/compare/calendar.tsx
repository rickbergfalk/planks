import { createRoot } from "react-dom/client"
import { Calendar } from "@/components/calendar"
import { ComparisonRow } from "./comparison-row"

function CalendarComparison() {
  return (
    <ComparisonRow
      reactContent={<Calendar className="rounded-md border" />}
      hallucnHtml={`<hal-calendar class="rounded-md border"></hal-calendar>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<CalendarComparison />)
}
