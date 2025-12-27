import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Button } from "@/components/button"

describe("Button (React) - Visual", () => {
  it("default variant", async () => {
    render(<Button data-testid="button">Button</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-default")
  })

  it("destructive variant", async () => {
    render(<Button variant="destructive" data-testid="button">Delete</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-destructive")
  })

  it("outline variant", async () => {
    render(<Button variant="outline" data-testid="button">Outline</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-outline")
  })

  it("secondary variant", async () => {
    render(<Button variant="secondary" data-testid="button">Secondary</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-secondary")
  })

  it("ghost variant", async () => {
    render(<Button variant="ghost" data-testid="button">Ghost</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-ghost")
  })

  it("link variant", async () => {
    render(<Button variant="link" data-testid="button">Link</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-link")
  })

  it("small size", async () => {
    render(<Button size="sm" data-testid="button">Small</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-size-sm")
  })

  it("large size", async () => {
    render(<Button size="lg" data-testid="button">Large</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-size-lg")
  })

  it("disabled state", async () => {
    render(<Button disabled data-testid="button">Disabled</Button>)
    await expect(page.getByTestId("button")).toMatchScreenshot("button-disabled")
  })
})
