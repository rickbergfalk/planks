import { createRoot } from "react-dom/client"
import { Checkbox } from "@/components/checkbox"
import { Label } from "@/components/label"
import { ComparisonRow } from "./comparison-row"

function CheckboxComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex items-center gap-2">
          <Checkbox defaultChecked id="react-cb" />
          <Label htmlFor="react-cb">Accept terms</Label>
        </div>
      }
      hallucnHtml={`
        <div class="flex items-center gap-2">
          <hal-checkbox checked id="hal-cb"></hal-checkbox>
          <hal-label for="hal-cb">Accept terms</hal-label>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<CheckboxComparison />)
}
