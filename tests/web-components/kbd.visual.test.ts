import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-kbd"

describe("HalKbd (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-kbd")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as any).updateComplete)
    )
  }

  it("single kbd key", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-kbd>K</hal-kbd>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-single")
  })

  it("kbd with text", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-kbd>Enter</hal-kbd>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-text")
  })

  it("kbd group with modifier keys", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-kbd-group>
          <hal-kbd>⌘</hal-kbd>
          <hal-kbd>⇧</hal-kbd>
          <hal-kbd>⌥</hal-kbd>
          <hal-kbd>⌃</hal-kbd>
        </hal-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-modifiers"
    )
  })

  it("kbd group with separator", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-kbd-group>
          <hal-kbd>Ctrl</hal-kbd>
          <span>+</span>
          <hal-kbd>B</hal-kbd>
        </hal-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-separator"
    )
  })

  it("multiple kbd groups", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; display: flex; flex-direction: column; gap: 8px">
        <hal-kbd-group>
          <hal-kbd>⌘</hal-kbd>
          <hal-kbd>⇧</hal-kbd>
          <hal-kbd>⌥</hal-kbd>
          <hal-kbd>⌃</hal-kbd>
        </hal-kbd-group>
        <hal-kbd-group>
          <hal-kbd>Ctrl</hal-kbd>
          <span>+</span>
          <hal-kbd>B</hal-kbd>
        </hal-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-multiple-groups"
    )
  })
})
