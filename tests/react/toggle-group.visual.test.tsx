import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group"

describe("ToggleGroup (React) - Visual", () => {
  it("multiple with selection", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-multiple-selected"
    )
  })

  it("single with selection", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left" aria-label="Left">
            L
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center">
            C
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Right">
            R
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-single-selected"
    )
  })

  it("outline variant", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="multiple" variant="outline" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-outline"
    )
  })

  it("small size", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="multiple" size="sm" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-sm"
    )
  })

  it("large size", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="multiple" size="lg" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-lg"
    )
  })

  it("with disabled item", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <ToggleGroup type="multiple" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            B
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic" disabled>
            I
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            U
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-disabled-item"
    )
  })
})
