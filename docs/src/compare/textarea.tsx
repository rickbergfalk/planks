import { createRoot } from "react-dom/client"
import { Textarea } from "@/components/textarea"
import { ComparisonRow } from "./comparison-row"

function TextareaComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Textarea placeholder="Enter text..." className="max-w-xs" rows={3} />
      }
      hallucnHtml={`<hal-textarea placeholder="Enter text..." class="max-w-xs" rows="3"></hal-textarea>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<TextareaComparison />)
}
