import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-textarea"
import type { HalTextarea } from "@/web-components/hal-textarea"

/**
 * Visual tests for HalTextarea web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalTextarea (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-textarea")
    const textareas = container.querySelectorAll("hal-textarea")
    await Promise.all(
      Array.from(textareas).map((t) => (t as HalTextarea).updateComplete)
    )
  }

  it("default textarea matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <hal-textarea placeholder="Type your message here..."></hal-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "textarea-default"
    )
  })

  it("disabled textarea matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <hal-textarea placeholder="Disabled" disabled></hal-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "textarea-disabled"
    )
  })

  it("textarea with value matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <hal-textarea value="This is some sample text in the textarea."></hal-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "textarea-with-value"
    )
  })

  it("textarea with rows matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <hal-textarea rows="6" placeholder="6 rows..."></hal-textarea>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "textarea-rows"
    )
  })
})
