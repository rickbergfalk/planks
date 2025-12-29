import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-dialog"
import "@/web-components/plank-button"

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
        <plank-dialog open>
          <plank-dialog-content>
            <plank-dialog-header>
              <plank-dialog-title>Edit profile</plank-dialog-title>
              <plank-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </plank-dialog-description>
            </plank-dialog-header>
            <div class="py-4">
              <p class="text-sm">Dialog content goes here.</p>
            </div>
            <plank-dialog-footer>
              <plank-button variant="outline">Cancel</plank-button>
              <plank-button>Save changes</plank-button>
            </plank-dialog-footer>
          </plank-dialog-content>
        </plank-dialog>
      </div>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot("dialog-open")
  })

  it("dialog with only title", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 400px; position: relative;">
        <plank-dialog open>
          <plank-dialog-content>
            <plank-dialog-header>
              <plank-dialog-title>Simple Dialog</plank-dialog-title>
            </plank-dialog-header>
            <p class="text-sm">This is a simple dialog with just a title.</p>
          </plank-dialog-content>
        </plank-dialog>
      </div>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dialog-simple"
    )
  })
})
