import { createRoot } from "react-dom/client"
import { Label } from "@/components/label"
import { ComparisonRow } from "./comparison-row"

function LabelComparison() {
  return (
    <ComparisonRow
      reactContent={<Label>Email address</Label>}
      hallucnHtml={`<hal-label>Email address</hal-label>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<LabelComparison />)
}
