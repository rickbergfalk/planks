import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-textarea"
import type { PlankTextarea } from "@/web-components/plank-textarea"

/**
 * Visual tests for PlankTextarea web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankTextarea (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("plank-textarea")
    const textareas = container.querySelectorAll("plank-textarea")
    await Promise.all(
      Array.from(textareas).map((t) => (t as PlankTextarea).updateComplete)
    )
  }

  it("default textarea matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <plank-textarea placeholder="Type your message here..."></plank-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-default")
  })

  it("disabled textarea matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <plank-textarea placeholder="Disabled" disabled></plank-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-disabled")
  })

  it("textarea with value matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <plank-textarea value="This is some sample text in the textarea."></plank-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-with-value")
  })

  it("textarea with rows matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <plank-textarea rows="6" placeholder="6 rows..."></plank-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-rows")
  })
})
