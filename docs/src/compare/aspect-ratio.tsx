import { createRoot } from "react-dom/client"
import { AspectRatio } from "@/components/aspect-ratio"
import { ComparisonRow } from "./comparison-row"

function AspectRatioComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="w-48">
          <AspectRatio ratio={16 / 9}>
            <div className="bg-muted rounded-md flex items-center justify-center h-full">
              16:9
            </div>
          </AspectRatio>
        </div>
      }
      hallucnHtml={`
        <div class="w-48">
          <hal-aspect-ratio ratio="1.778">
            <div class="bg-muted rounded-md flex items-center justify-center h-full">16:9</div>
          </hal-aspect-ratio>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<AspectRatioComparison />)
}
