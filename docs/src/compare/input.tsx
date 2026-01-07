import { createRoot } from "react-dom/client"
import { Input } from "@/components/input"
import { ComparisonRow } from "./comparison-row"

function InputComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Input placeholder="Enter text..." className="max-w-xs" />
      }
      hallucnHtml={`<hal-input placeholder="Enter text..." class="max-w-xs"></hal-input>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<InputComparison />)
}
