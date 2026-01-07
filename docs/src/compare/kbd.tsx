import { createRoot } from "react-dom/client"
import { Kbd } from "@/components/kbd"
import { ComparisonRow } from "./comparison-row"

function KbdComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex items-center gap-2">
          <span className="text-sm">Press</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <span className="text-sm">to search</span>
        </div>
      }
      hallucnHtml={`
        <div class="flex items-center gap-2">
          <span class="text-sm">Press</span>
          <hal-kbd>⌘</hal-kbd>
          <hal-kbd>K</hal-kbd>
          <span class="text-sm">to search</span>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<KbdComparison />)
}
