import { createRoot } from "react-dom/client"
import { Skeleton } from "@/components/skeleton"
import { ComparisonRow } from "./comparison-row"

function SkeletonComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      }
      hallucnHtml={`
        <div class="flex items-center gap-4">
          <hal-skeleton class="h-12 w-12 rounded-full"></hal-skeleton>
          <div class="space-y-2">
            <hal-skeleton class="h-4 w-32"></hal-skeleton>
            <hal-skeleton class="h-4 w-24"></hal-skeleton>
          </div>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SkeletonComparison />)
}
