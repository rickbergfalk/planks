import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-alert-dialog"
import "@/web-components/hal-button"

describe("AlertDialog (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('[data-slot="alert-dialog-portal"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="alert-dialog-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="alert-dialog-content"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[role="alertdialog"]')
      .forEach((el) => el.remove())
  })

  it("alert dialog with confirmation", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-alert-dialog open>
          <hal-alert-dialog-content>
            <hal-alert-dialog-header>
              <hal-alert-dialog-title>Are you absolutely sure?</hal-alert-dialog-title>
              <hal-alert-dialog-description>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </hal-alert-dialog-description>
            </hal-alert-dialog-header>
            <hal-alert-dialog-footer>
              <hal-alert-dialog-cancel>Cancel</hal-alert-dialog-cancel>
              <hal-alert-dialog-action>Continue</hal-alert-dialog-action>
            </hal-alert-dialog-footer>
          </hal-alert-dialog-content>
        </hal-alert-dialog>
      </div>
    `

    await customElements.whenDefined("hal-alert-dialog")
    const alertDialog = container.querySelector("hal-alert-dialog")!
    await (alertDialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "alert-dialog-confirmation"
    )
  })

  it("alert dialog simple", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 400px; position: relative;">
        <hal-alert-dialog open>
          <hal-alert-dialog-content>
            <hal-alert-dialog-header>
              <hal-alert-dialog-title>Delete Item</hal-alert-dialog-title>
              <hal-alert-dialog-description>
                Are you sure you want to delete this item?
              </hal-alert-dialog-description>
            </hal-alert-dialog-header>
            <hal-alert-dialog-footer>
              <hal-alert-dialog-cancel>No</hal-alert-dialog-cancel>
              <hal-alert-dialog-action>Yes</hal-alert-dialog-action>
            </hal-alert-dialog-footer>
          </hal-alert-dialog-content>
        </hal-alert-dialog>
      </div>
    `

    await customElements.whenDefined("hal-alert-dialog")
    const alertDialog = container.querySelector("hal-alert-dialog")!
    await (alertDialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "alert-dialog-simple"
    )
  })
})
