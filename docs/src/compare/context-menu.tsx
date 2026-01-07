import { createRoot } from "react-dom/client"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/context-menu"
import { ComparisonRow } from "./comparison-row"

function ContextMenuComparison() {
  return (
    <ComparisonRow
      reactContent={
        <ContextMenu>
          <ContextMenuTrigger className="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
            Right click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Cut</ContextMenuItem>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      }
      hallucnHtml={`
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div class="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Cut</hal-context-menu-item>
            <hal-context-menu-item>Copy</hal-context-menu-item>
            <hal-context-menu-item>Paste</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ContextMenuComparison />)
}
