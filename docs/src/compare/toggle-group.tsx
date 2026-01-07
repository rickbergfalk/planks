import { createRoot } from "react-dom/client"
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group"
import { ComparisonRow } from "./comparison-row"

function ToggleGroupComparison() {
  return (
    <ComparisonRow
      reactContent={
        <ToggleGroup type="multiple" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      }
      hallucnHtml={`
        <hal-toggle-group type="multiple" value="bold">
          <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
          <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
          <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
        </hal-toggle-group>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ToggleGroupComparison />)
}
