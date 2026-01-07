import { createRoot } from "react-dom/client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable"
import { ComparisonRow } from "./comparison-row"

function ResizableComparison() {
  return (
    <ComparisonRow
      reactContent={
        <ResizablePanelGroup
          direction="horizontal"
          className="max-w-md rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-24 items-center justify-center p-6">
              <span className="font-semibold">Panel 1</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-24 items-center justify-center p-6">
              <span className="font-semibold">Panel 2</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      }
      hallucnHtml={`
        <hal-resizable-panel-group direction="horizontal" class="max-w-md rounded-lg border">
          <hal-resizable-panel default-size="50">
            <div class="flex h-24 items-center justify-center p-6">
              <span class="font-semibold">Panel 1</span>
            </div>
          </hal-resizable-panel>
          <hal-resizable-handle with-handle></hal-resizable-handle>
          <hal-resizable-panel default-size="50">
            <div class="flex h-24 items-center justify-center p-6">
              <span class="font-semibold">Panel 2</span>
            </div>
          </hal-resizable-panel>
        </hal-resizable-panel-group>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ResizableComparison />)
}
