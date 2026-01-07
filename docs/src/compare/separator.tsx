import { createRoot } from "react-dom/client"
import { Separator } from "@/components/separator"
import { ComparisonRow } from "./comparison-row"

function SeparatorComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="w-full max-w-xs">
          <Separator />
        </div>
      }
      hallucnHtml={`<div class="w-full max-w-xs"><hal-separator></hal-separator></div>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SeparatorComparison />)
}
