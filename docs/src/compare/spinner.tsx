import { createRoot } from "react-dom/client"
import { Spinner } from "@/components/spinner"
import { ComparisonRow } from "./comparison-row"

function SpinnerComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex items-center gap-4">
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="size-8" />
        </div>
      }
      hallucnHtml={`
        <div class="flex items-center gap-4">
          <hal-spinner></hal-spinner>
          <hal-spinner class="size-6"></hal-spinner>
          <hal-spinner class="size-8"></hal-spinner>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SpinnerComparison />)
}
