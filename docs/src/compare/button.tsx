import { createRoot } from "react-dom/client"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function ButtonComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex gap-2 flex-wrap">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      }
      hallucnHtml={`
        <div class="flex gap-2 flex-wrap">
          <hal-button>Default</hal-button>
          <hal-button variant="secondary">Secondary</hal-button>
          <hal-button variant="destructive">Destructive</hal-button>
          <hal-button variant="outline">Outline</hal-button>
          <hal-button variant="ghost">Ghost</hal-button>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ButtonComparison />)
}
