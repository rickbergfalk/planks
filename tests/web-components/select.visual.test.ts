import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-select"
import "@/web-components/plank-button"

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
        <plank-select>
          <plank-select-trigger class="w-[180px]">
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
            <plank-select-item value="banana">Banana</plank-select-item>
            <plank-select-item value="orange">Orange</plank-select-item>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
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
        <plank-select open>
          <plank-select-trigger class="w-[180px]">
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
            <plank-select-item value="banana">Banana</plank-select-item>
            <plank-select-item value="orange">Orange</plank-select-item>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
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
        <plank-select value="banana">
          <plank-select-trigger class="w-[180px]">
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
            <plank-select-item value="banana">Banana</plank-select-item>
            <plank-select-item value="orange">Orange</plank-select-item>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
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
        <plank-select open>
          <plank-select-trigger class="w-[180px]">
            <plank-select-value placeholder="Select a food"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-group>
              <plank-select-label>Fruits</plank-select-label>
              <plank-select-item value="apple">Apple</plank-select-item>
              <plank-select-item value="banana">Banana</plank-select-item>
            </plank-select-group>
            <plank-select-separator></plank-select-separator>
            <plank-select-group>
              <plank-select-label>Vegetables</plank-select-label>
              <plank-select-item value="carrot">Carrot</plank-select-item>
              <plank-select-item value="broccoli">Broccoli</plank-select-item>
            </plank-select-group>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
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
        <plank-select>
          <plank-select-trigger size="sm" class="w-[180px]">
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
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
        <plank-select disabled>
          <plank-select-trigger class="w-[180px]">
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      </div>
    `

    await customElements.whenDefined("plank-select")
    const select = container.querySelector("plank-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "select-disabled"
    )
  })
})
