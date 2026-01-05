import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-dialog"
import "@/web-components/hal-button"

// Small pixel variance allowed for dialog tests:
// - React Button is a native <button> element
// - hal-button is a custom element with role="button"
// - This causes minor subpixel rendering differences in borders (~1% of image)
const DIALOG_SCREENSHOT_OPTIONS = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.015 },
}

describe("Dialog (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    document
      .querySelectorAll('[data-slot="dialog-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="dialog-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
  })

  it("dialog open with header and description", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-dialog open>
          <hal-dialog-content>
            <hal-dialog-header>
              <hal-dialog-title>Edit profile</hal-dialog-title>
              <hal-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </hal-dialog-description>
            </hal-dialog-header>
            <div class="py-4">
              <p class="text-sm">Dialog content goes here.</p>
            </div>
            <hal-dialog-footer>
              <hal-button variant="outline">Cancel</hal-button>
              <hal-button>Save changes</hal-button>
            </hal-dialog-footer>
          </hal-dialog-content>
        </hal-dialog>
      </div>
    `

    await customElements.whenDefined("hal-dialog")
    const dialog = container.querySelector("hal-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dialog-open",
      DIALOG_SCREENSHOT_OPTIONS
    )
  })

  it("dialog with only title", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 400px; position: relative;">
        <hal-dialog open>
          <hal-dialog-content>
            <hal-dialog-header>
              <hal-dialog-title>Simple Dialog</hal-dialog-title>
            </hal-dialog-header>
            <p class="text-sm">This is a simple dialog with just a title.</p>
          </hal-dialog-content>
        </hal-dialog>
      </div>
    `

    await customElements.whenDefined("hal-dialog")
    const dialog = container.querySelector("hal-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dialog-simple",
      DIALOG_SCREENSHOT_OPTIONS
    )
  })
})
