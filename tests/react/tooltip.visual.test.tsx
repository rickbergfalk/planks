import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip"
import { Button } from "@/components/button"

describe("Tooltip (React) - Visual", () => {
  it("tooltip open above button", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
      </div>
    )
    // Wait for positioning to complete
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot("tooltip-top")
  })

  it("tooltip on right side", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent side="right">Add to library</TooltipContent>
        </Tooltip>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-right"
    )
  })

  it("tooltip on bottom", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Add to library</TooltipContent>
        </Tooltip>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-bottom"
    )
  })

  it("tooltip on left side", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Tooltip open={true}>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover</Button>
          </TooltipTrigger>
          <TooltipContent side="left">Add to library</TooltipContent>
        </Tooltip>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-left"
    )
  })
})
