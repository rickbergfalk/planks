import { createRoot } from "react-dom/client"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function PopoverComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      }
      hallucnHtml={`
        <hal-popover>
          <hal-popover-trigger>
            <hal-button variant="outline">Open popover</hal-button>
          </hal-popover-trigger>
          <hal-popover-content class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Dimensions</h4>
                <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
              </div>
            </div>
          </hal-popover-content>
        </hal-popover>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<PopoverComparison />)
}
