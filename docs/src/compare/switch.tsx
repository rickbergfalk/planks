import { createRoot } from "react-dom/client"
import { Switch } from "@/components/switch"
import { ComparisonRow } from "./comparison-row"

function SwitchComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex items-center gap-2">
          <Switch defaultChecked />
          <span className="text-sm">Enabled</span>
        </div>
      }
      hallucnHtml={`
        <div class="flex items-center gap-2">
          <hal-switch checked></hal-switch>
          <span class="text-sm">Enabled</span>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SwitchComparison />)
}
