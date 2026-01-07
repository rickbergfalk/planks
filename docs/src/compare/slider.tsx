import { createRoot } from "react-dom/client"
import { Slider } from "@/components/slider"
import { ComparisonRow } from "./comparison-row"

function SliderComparison() {
  return (
    <ComparisonRow
      reactContent={<Slider defaultValue={[50]} className="max-w-xs" />}
      hallucnHtml={`<hal-slider value="50" class="max-w-xs"></hal-slider>`}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SliderComparison />)
}
