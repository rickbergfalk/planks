import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-kbd"

describe("PlankKbd (Web Component) - Visual", () => {
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
    await customElements.whenDefined("plank-kbd")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as any).updateComplete)
    )
  }

  it("single kbd key", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-kbd>K</plank-kbd>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-single")
  })

  it("kbd with text", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-kbd>Enter</plank-kbd>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("kbd-text")
  })

  it("kbd group with modifier keys", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-kbd-group>
          <plank-kbd>⌘</plank-kbd>
          <plank-kbd>⇧</plank-kbd>
          <plank-kbd>⌥</plank-kbd>
          <plank-kbd>⌃</plank-kbd>
        </plank-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-modifiers"
    )
  })

  it("kbd group with separator", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-kbd-group>
          <plank-kbd>Ctrl</plank-kbd>
          <span>+</span>
          <plank-kbd>B</plank-kbd>
        </plank-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-group-separator"
    )
  })

  it("multiple kbd groups", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; display: flex; flex-direction: column; gap: 8px">
        <plank-kbd-group>
          <plank-kbd>⌘</plank-kbd>
          <plank-kbd>⇧</plank-kbd>
          <plank-kbd>⌥</plank-kbd>
          <plank-kbd>⌃</plank-kbd>
        </plank-kbd-group>
        <plank-kbd-group>
          <plank-kbd>Ctrl</plank-kbd>
          <span>+</span>
          <plank-kbd>B</plank-kbd>
        </plank-kbd-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "kbd-multiple-groups"
    )
  })
})
