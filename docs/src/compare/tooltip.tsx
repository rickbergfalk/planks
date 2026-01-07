import { createRoot } from "react-dom/client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function TooltipComparison() {
  return (
    <ComparisonRow
      reactContent={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      hallucnHtml={`
        <hal-tooltip>
          <hal-tooltip-trigger>
            <hal-button variant="outline">Hover me</hal-button>
          </hal-tooltip-trigger>
          <hal-tooltip-content>Add to library</hal-tooltip-content>
        </hal-tooltip>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<TooltipComparison />)
}
