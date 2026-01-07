import { createRoot } from "react-dom/client"
import { Badge } from "@/components/badge"
import { ComparisonRow } from "./comparison-row"

function BadgeComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      }
      hallucnHtml={`
        <div class="flex gap-2 flex-wrap">
          <hal-badge>Default</hal-badge>
          <hal-badge variant="secondary">Secondary</hal-badge>
          <hal-badge variant="destructive">Destructive</hal-badge>
          <hal-badge variant="outline">Outline</hal-badge>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<BadgeComparison />)
}
