import { createRoot } from "react-dom/client"
import { Progress } from "@/components/progress"
import { ComparisonRow } from "./comparison-row"

function ProgressComparison() {
  return (
    <ComparisonRow
      reactContent={<Progress value={66} className="max-w-xs" />}
      hallucnHtml={`<hal-progress value="66" class="max-w-xs"></hal-progress>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ProgressComparison />)
}
