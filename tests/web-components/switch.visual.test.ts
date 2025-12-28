import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-switch"
import type { PlankSwitch } from "@/web-components/plank-switch"

describe("PlankSwitch (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("unchecked state", async () => {
    container.innerHTML = `<plank-switch data-testid="switch"></plank-switch>`
    await customElements.whenDefined("plank-switch")
    const switchEl = container.querySelector("plank-switch") as PlankSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-unchecked"
    )
  })

  it("checked state", async () => {
    container.innerHTML = `<plank-switch checked data-testid="switch"></plank-switch>`
    await customElements.whenDefined("plank-switch")
    const switchEl = container.querySelector("plank-switch") as PlankSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot("switch-checked")
  })

  it("disabled unchecked", async () => {
    container.innerHTML = `<plank-switch disabled data-testid="switch"></plank-switch>`
    await customElements.whenDefined("plank-switch")
    const switchEl = container.querySelector("plank-switch") as PlankSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    container.innerHTML = `<plank-switch disabled checked data-testid="switch"></plank-switch>`
    await customElements.whenDefined("plank-switch")
    const switchEl = container.querySelector("plank-switch") as PlankSwitch
    await switchEl.updateComplete

    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-checked"
    )
  })
})
