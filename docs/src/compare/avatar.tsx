import { createRoot } from "react-dom/client"
import { Avatar, AvatarFallback } from "@/components/avatar"
import { ComparisonRow } from "./comparison-row"

function AvatarComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex -space-x-2">
          <Avatar className="ring-2 ring-background">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar className="ring-2 ring-background">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar className="ring-2 ring-background">
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </div>
      }
      hallucnHtml={`
        <div class="flex -space-x-2">
          <hal-avatar class="ring-2 ring-background">
            <hal-avatar-fallback>A</hal-avatar-fallback>
          </hal-avatar>
          <hal-avatar class="ring-2 ring-background">
            <hal-avatar-fallback>B</hal-avatar-fallback>
          </hal-avatar>
          <hal-avatar class="ring-2 ring-background">
            <hal-avatar-fallback>C</hal-avatar-fallback>
          </hal-avatar>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<AvatarComparison />)
}
