import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-select"
import "@/web-components/hal-button"

describe("Select (Web Component) - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("select trigger closed", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select>
          <hal-select-trigger class="w-[180px]">
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
            <hal-select-item value="orange">Orange</hal-select-item>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-trigger-closed"
    )
  })

  it("select open with items", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; padding-bottom: 200px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select open>
          <hal-select-trigger class="w-[180px]">
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
            <hal-select-item value="orange">Orange</hal-select-item>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    // Note: Radix uses position="item-aligned" which overlays the selected item
    // over the trigger. Our web component uses standard floating positioning.
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-open",
      {
        comparatorOptions: { allowedMismatchedPixelRatio: 0.025 },
      }
    )
  })

  it("select with selected value", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select value="banana">
          <hal-select-trigger class="w-[180px]">
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
            <hal-select-item value="orange">Orange</hal-select-item>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-with-value"
    )
  })

  it("select with groups and labels", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; padding-bottom: 280px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select open>
          <hal-select-trigger class="w-[180px]">
            <hal-select-value placeholder="Select a food"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-group>
              <hal-select-label>Fruits</hal-select-label>
              <hal-select-item value="apple">Apple</hal-select-item>
              <hal-select-item value="banana">Banana</hal-select-item>
            </hal-select-group>
            <hal-select-separator></hal-select-separator>
            <hal-select-group>
              <hal-select-label>Vegetables</hal-select-label>
              <hal-select-item value="carrot">Carrot</hal-select-item>
              <hal-select-item value="broccoli">Broccoli</hal-select-item>
            </hal-select-group>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    // Note: Radix uses position="item-aligned" which overlays the selected item
    // over the trigger. Our web component uses standard floating positioning.
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-with-groups",
      { comparatorOptions: { allowedMismatchedPixelRatio: 0.025 } }
    )
  })

  it("select small size", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select>
          <hal-select-trigger size="sm" class="w-[180px]">
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-small"
    )
  })

  it("select disabled", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-select disabled>
          <hal-select-trigger class="w-[180px]">
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      </div>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-disabled"
    )
  })
})
