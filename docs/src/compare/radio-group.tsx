import { createRoot } from "react-dom/client"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import { Label } from "@/components/label"
import { ComparisonRow } from "./comparison-row"

function RadioGroupComparison() {
  return (
    <ComparisonRow
      reactContent={
        <RadioGroup defaultValue="option1">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option1" id="r1" />
            <Label htmlFor="r1">Option 1</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option2" id="r2" />
            <Label htmlFor="r2">Option 2</Label>
          </div>
        </RadioGroup>
      }
      hallucnHtml={`
        <hal-radio-group value="option1">
          <div class="flex items-center gap-2">
            <hal-radio-group-item value="option1" id="pr1"></hal-radio-group-item>
            <hal-label for="pr1">Option 1</hal-label>
          </div>
          <div class="flex items-center gap-2">
            <hal-radio-group-item value="option2" id="pr2"></hal-radio-group-item>
            <hal-label for="pr2">Option 2</hal-label>
          </div>
        </hal-radio-group>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<RadioGroupComparison />)
}
