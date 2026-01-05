import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-input-group"
import type {
  HalInputGroup,
  HalInputGroupTextarea,
} from "@/web-components/hal-input-group"

/**
 * Visual tests for hal-input-group web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("hal-input-group visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    container.setAttribute("data-testid", "container")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("matches input with icon addon appearance", async () => {
    container.style.padding = "20px"
    container.style.width = "300px"
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-addon>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </hal-input-group-addon>
        <hal-input-group-input placeholder="Search..."></hal-input-group-input>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    const group = container.querySelector("hal-input-group")! as HalInputGroup
    await group.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-group-icon"
    )
  })

  it("matches input with text addons appearance", async () => {
    container.style.padding = "20px"
    container.style.width = "300px"
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-addon>
          <hal-input-group-text>$</hal-input-group-text>
        </hal-input-group-addon>
        <hal-input-group-input placeholder="0.00"></hal-input-group-input>
        <hal-input-group-addon align="inline-end">
          <hal-input-group-text>USD</hal-input-group-text>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    await customElements.whenDefined("hal-input-group-text")
    const group = container.querySelector("hal-input-group")! as HalInputGroup
    await group.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-group-text"
    )
  })

  it("matches input with button addon appearance", async () => {
    container.style.padding = "20px"
    container.style.width = "300px"
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-input placeholder="Type to search..."></hal-input-group-input>
        <hal-input-group-addon align="inline-end">
          <hal-input-group-button variant="secondary">Search</hal-input-group-button>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    await customElements.whenDefined("hal-input-group-button")
    const group = container.querySelector("hal-input-group")! as HalInputGroup
    await group.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    // Allow 5% variance for text anti-aliasing differences between React and web component
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-group-button",
      { comparatorOptions: { allowedMismatchedPixelRatio: 0.05 } }
    )
  })

  it("matches textarea with block addon appearance", async () => {
    container.style.padding = "20px"
    container.style.width = "300px"
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-textarea placeholder="Enter message..."></hal-input-group-textarea>
        <hal-input-group-addon align="block-end">
          <hal-input-group-text>120 characters left</hal-input-group-text>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-textarea")
    await customElements.whenDefined("hal-input-group-text")
    const textarea = container.querySelector(
      "hal-input-group-textarea"
    )! as HalInputGroupTextarea
    await textarea.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-group-textarea"
    )
  })
})
