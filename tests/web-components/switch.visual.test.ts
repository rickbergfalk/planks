import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-switch"
import type { HalSwitch } from "@/web-components/hal-switch"

describe("HalSwitch (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("unchecked state", async () => {
    container.innerHTML = `<hal-switch data-testid="switch"></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-unchecked"
    )
  })

  it("checked state", async () => {
    container.innerHTML = `<hal-switch checked data-testid="switch"></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot("switch-checked")
  })

  it("disabled unchecked", async () => {
    container.innerHTML = `<hal-switch disabled data-testid="switch"></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    container.innerHTML = `<hal-switch disabled checked data-testid="switch"></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-checked"
    )
  })
})
