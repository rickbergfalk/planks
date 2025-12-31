import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-sonner"
import { toast, PlankToaster } from "@/web-components/plank-sonner"

describe("plank-toaster visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    container.style.width = "400px"
    container.style.height = "300px"
    container.style.position = "relative"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("matches default toast appearance", async () => {
    container.innerHTML = `<plank-toaster position="bottom-right"></plank-toaster>`
    await customElements.whenDefined("plank-toaster")
    const toaster = container.querySelector("plank-toaster")! as PlankToaster
    await toaster.updateComplete

    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
    })
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/sonner-default-chromium.png`
    )
  })

  it("matches success toast appearance", async () => {
    container.innerHTML = `<plank-toaster position="bottom-right"></plank-toaster>`
    await customElements.whenDefined("plank-toaster")
    const toaster = container.querySelector("plank-toaster")! as PlankToaster
    await toaster.updateComplete

    toast.success("Event has been created")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/sonner-success-chromium.png`
    )
  })

  it("matches error toast appearance", async () => {
    container.innerHTML = `<plank-toaster position="bottom-right"></plank-toaster>`
    await customElements.whenDefined("plank-toaster")
    const toaster = container.querySelector("plank-toaster")! as PlankToaster
    await toaster.updateComplete

    toast.error("Event could not be created")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/sonner-error-chromium.png`
    )
  })

  it("matches multiple toasts stacked", async () => {
    container.innerHTML = `<plank-toaster position="bottom-right"></plank-toaster>`
    await customElements.whenDefined("plank-toaster")
    const toaster = container.querySelector("plank-toaster")! as PlankToaster
    await toaster.updateComplete

    toast.info("First notification")
    toast.warning("Second notification")
    toast.success("Third notification")
    await toaster.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/sonner-stacked-chromium.png`
    )
  })
})
