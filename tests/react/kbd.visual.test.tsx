import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Kbd, KbdGroup } from "@/components/kbd"

describe("Kbd (React) - Visual", () => {
  it("single kbd key", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Kbd>K</Kbd>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-single")
  })

  it("kbd with text", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Kbd>Enter</Kbd>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-text")
  })

  it("kbd group with modifier keys", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⌃</Kbd>
        </KbdGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-modifiers"
    )
  })

  it("kbd group with separator", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-separator"
    )
  })

  it("multiple kbd groups", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>⌥</Kbd>
          <Kbd>⌃</Kbd>
        </KbdGroup>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <span>+</span>
          <Kbd>B</Kbd>
        </KbdGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-multiple-groups"
    )
  })
})
