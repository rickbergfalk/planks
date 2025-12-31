import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import React from "react"
import { createRoot } from "react-dom/client"
import { ScrollArea, ScrollBar } from "@/components/scroll-area"
import { Separator } from "@/components/separator"

describe("ScrollArea - Visual", () => {
  let container: HTMLElement
  let root: ReturnType<typeof createRoot>

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "16px"
    container.style.width = "300px"
    document.body.appendChild(container)
    root = createRoot(container)
    return () => {
      root.unmount()
      container.remove()
    }
  })

  // Generate tags like the demo
  const tags = Array.from({ length: 20 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
  )

  it("vertical scroll area with visible scrollbar", async () => {
    root.render(
      <ScrollArea className="h-48 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
          {tags.map((tag) => (
            <React.Fragment key={tag}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "scroll-area-vertical"
    )
  })

  it("horizontal scroll area", async () => {
    root.render(
      <ScrollArea className="w-64 rounded-md border whitespace-nowrap">
        <div className="flex gap-4 p-4" style={{ width: "max-content" }}>
          <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
            Item 1
          </div>
          <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
            Item 2
          </div>
          <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
            Item 3
          </div>
          <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
            Item 4
          </div>
          <div className="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
            Item 5
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )

    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "scroll-area-horizontal"
    )
  })
})
