import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { AspectRatio } from "@/components/aspect-ratio"

describe("AspectRatio (React) - Visual", () => {
  it("16/9 ratio with colored background", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg" />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-16-9"
    )
  })

  it("4/3 ratio with colored background", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <AspectRatio ratio={4 / 3} className="bg-muted rounded-lg" />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-4-3"
    )
  })

  it("1/1 ratio (square) with colored background", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "200px" }}>
        <AspectRatio ratio={1} className="bg-muted rounded-lg" />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-1-1"
    )
  })

  it("21/9 ultra-wide ratio", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <AspectRatio ratio={21 / 9} className="bg-muted rounded-lg" />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-21-9"
    )
  })
})
