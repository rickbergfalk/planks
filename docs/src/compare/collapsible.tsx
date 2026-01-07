import { createRoot } from "react-dom/client"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/collapsible"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function CollapsibleComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Collapsible className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Click to toggle</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="rounded-md border px-3 py-2 text-sm">
              Hidden content
            </div>
          </CollapsibleContent>
        </Collapsible>
      }
      hallucnHtml={`
        <hal-collapsible class="w-full max-w-xs flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-sm">Click to toggle</span>
            <hal-collapsible-trigger>
              <hal-button variant="ghost" size="sm">Toggle</hal-button>
            </hal-collapsible-trigger>
          </div>
          <hal-collapsible-content>
            <div class="rounded-md border px-3 py-2 text-sm">Hidden content</div>
          </hal-collapsible-content>
        </hal-collapsible>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<CollapsibleComparison />)
}
