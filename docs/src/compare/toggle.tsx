import { createRoot } from "react-dom/client"
import { Toggle } from "@/components/toggle"
import { ComparisonRow } from "./comparison-row"

function ToggleComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex gap-2">
          <Toggle defaultPressed aria-label="Bold">
            B
          </Toggle>
          <Toggle aria-label="Italic">I</Toggle>
        </div>
      }
      hallucnHtml={`
        <div class="flex gap-2">
          <hal-toggle pressed aria-label="Bold">B</hal-toggle>
          <hal-toggle aria-label="Italic">I</hal-toggle>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ToggleComparison />)
}
