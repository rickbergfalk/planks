import { createRoot } from "react-dom/client"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/hover-card"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function HoverCardComparison() {
  return (
    <ComparisonRow
      reactContent={
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@shadcn</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex justify-between space-x-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@shadcn</h4>
                <p className="text-sm">
                  The creator of shadcn/ui and related tools.
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      }
      hallucnHtml={`
        <hal-hover-card>
          <hal-hover-card-trigger>
            <hal-button variant="link">@shadcn</hal-button>
          </hal-hover-card-trigger>
          <hal-hover-card-content class="w-80">
            <div class="flex justify-between space-x-4">
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@shadcn</h4>
                <p class="text-sm">The creator of shadcn/ui and related tools.</p>
              </div>
            </div>
          </hal-hover-card-content>
        </hal-hover-card>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<HoverCardComparison />)
}
