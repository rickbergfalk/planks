import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-sonner"
import { toast, HalToaster } from "@/web-components/hal-sonner"

/**
 * Visual tests for hal-toaster web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("hal-toaster visual", () => {
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

  it("matches default toast appearance", async () => {
    container.innerHTML = `
      <div style="width: 400px; height: 300px; position: relative;">
        <hal-toaster position="bottom-right"></hal-toaster>
      </div>
    `
    // Move data-testid to inner div for consistent screenshot area
    container.querySelector("div")!.setAttribute("data-testid", "toast-area")
    await customElements.whenDefined("hal-toaster")
    const toaster = container.querySelector("hal-toaster")! as HalToaster
    await toaster.updateComplete

    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
    })
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("toast-area")).toMatchScreenshot(
      "sonner-default"
    )
  })

  it("matches success toast appearance", async () => {
    container.innerHTML = `
      <div style="width: 400px; height: 300px; position: relative;">
        <hal-toaster position="bottom-right"></hal-toaster>
      </div>
    `
    container.querySelector("div")!.setAttribute("data-testid", "toast-area")
    await customElements.whenDefined("hal-toaster")
    const toaster = container.querySelector("hal-toaster")! as HalToaster
    await toaster.updateComplete

    toast.success("Event has been created")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("toast-area")).toMatchScreenshot(
      "sonner-success"
    )
  })

  it("matches error toast appearance", async () => {
    container.innerHTML = `
      <div style="width: 400px; height: 300px; position: relative;">
        <hal-toaster position="bottom-right"></hal-toaster>
      </div>
    `
    container.querySelector("div")!.setAttribute("data-testid", "toast-area")
    await customElements.whenDefined("hal-toaster")
    const toaster = container.querySelector("hal-toaster")! as HalToaster
    await toaster.updateComplete

    toast.error("Event could not be created")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("toast-area")).toMatchScreenshot(
      "sonner-error"
    )
  })

  it("matches multiple toasts stacked", async () => {
    container.innerHTML = `
      <div style="width: 400px; height: 300px; position: relative;">
        <hal-toaster position="bottom-right"></hal-toaster>
      </div>
    `
    container.querySelector("div")!.setAttribute("data-testid", "toast-area")
    await customElements.whenDefined("hal-toaster")
    const toaster = container.querySelector("hal-toaster")! as HalToaster
    await toaster.updateComplete

    toast.info("First notification")
    toast.warning("Second notification")
    toast.success("Third notification")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("toast-area")).toMatchScreenshot(
      "sonner-stacked"
    )
  })
})
