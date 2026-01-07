import { createRoot } from "react-dom/client"
import { ScrollArea } from "@/components/scroll-area"
import { ComparisonRow } from "./comparison-row"

function ScrollAreaComparison() {
  return (
    <ComparisonRow
      reactContent={
        <ScrollArea className="h-48 w-48 rounded-md border p-4">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="text-sm">
                Item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      }
      hallucnHtml={`
        <hal-scroll-area class="h-48 w-48 rounded-md border p-4">
          <div class="space-y-4">
            <div class="text-sm">Item 1</div>
            <div class="text-sm">Item 2</div>
            <div class="text-sm">Item 3</div>
            <div class="text-sm">Item 4</div>
            <div class="text-sm">Item 5</div>
            <div class="text-sm">Item 6</div>
            <div class="text-sm">Item 7</div>
            <div class="text-sm">Item 8</div>
            <div class="text-sm">Item 9</div>
            <div class="text-sm">Item 10</div>
          </div>
        </hal-scroll-area>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ScrollAreaComparison />)
}
