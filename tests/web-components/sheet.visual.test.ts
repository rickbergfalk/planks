import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-sheet"
import "@/web-components/hal-button"
import "@/web-components/hal-input"
import "@/web-components/hal-label"

// Small pixel variance allowed for sheet tests:
// - React Button is a native <button> element
// - hal-button is a custom element with role="button"
// - This causes minor subpixel rendering differences in borders (~1% of image)
const SHEET_SCREENSHOT_OPTIONS = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.015 },
}

describe("Sheet (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    document
      .querySelectorAll('[data-slot="sheet-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="sheet-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
  })

  it("sheet open from right (default)", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-sheet open>
          <hal-sheet-content>
            <hal-sheet-header>
              <hal-sheet-title>Edit profile</hal-sheet-title>
              <hal-sheet-description>
                Make changes to your profile here. Click save when you're done.
              </hal-sheet-description>
            </hal-sheet-header>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <hal-label for="name" class="text-right">Name</hal-label>
                <hal-input id="name" value="John Doe" class="col-span-3"></hal-input>
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <hal-label for="username" class="text-right">Username</hal-label>
                <hal-input id="username" value="@johndoe" class="col-span-3"></hal-input>
              </div>
            </div>
            <hal-sheet-footer>
              <hal-button type="submit">Save changes</hal-button>
            </hal-sheet-footer>
          </hal-sheet-content>
        </hal-sheet>
      </div>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "sheet-right",
      SHEET_SCREENSHOT_OPTIONS
    )
  })

  it("sheet open from left", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-sheet open>
          <hal-sheet-content side="left">
            <hal-sheet-header>
              <hal-sheet-title>Navigation</hal-sheet-title>
              <hal-sheet-description>
                Access the main navigation menu.
              </hal-sheet-description>
            </hal-sheet-header>
            <div class="py-4">
              <nav class="flex flex-col gap-2">
                <a href="#" class="text-sm hover:underline">Home</a>
                <a href="#" class="text-sm hover:underline">About</a>
                <a href="#" class="text-sm hover:underline">Services</a>
                <a href="#" class="text-sm hover:underline">Contact</a>
              </nav>
            </div>
          </hal-sheet-content>
        </hal-sheet>
      </div>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "sheet-left",
      SHEET_SCREENSHOT_OPTIONS
    )
  })

  it("sheet open from top", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-sheet open>
          <hal-sheet-content side="top">
            <hal-sheet-header>
              <hal-sheet-title>Notification Banner</hal-sheet-title>
              <hal-sheet-description>
                Important announcements will appear here.
              </hal-sheet-description>
            </hal-sheet-header>
            <div class="py-2">
              <p class="text-sm">Welcome to our new website! Check out our latest features.</p>
            </div>
          </hal-sheet-content>
        </hal-sheet>
      </div>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "sheet-top",
      SHEET_SCREENSHOT_OPTIONS
    )
  })

  it("sheet open from bottom", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 600px; position: relative;">
        <hal-sheet open>
          <hal-sheet-content side="bottom">
            <hal-sheet-header>
              <hal-sheet-title>Cookie Preferences</hal-sheet-title>
              <hal-sheet-description>
                Manage your cookie settings below.
              </hal-sheet-description>
            </hal-sheet-header>
            <div class="py-4 flex gap-4">
              <hal-button variant="outline">Reject All</hal-button>
              <hal-button>Accept All</hal-button>
            </div>
          </hal-sheet-content>
        </hal-sheet>
      </div>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "sheet-bottom",
      SHEET_SCREENSHOT_OPTIONS
    )
  })

  it("sheet with only title", async () => {
    container.innerHTML = `
      <div data-testid="container" style="width: 800px; height: 400px; position: relative;">
        <hal-sheet open>
          <hal-sheet-content>
            <hal-sheet-header>
              <hal-sheet-title>Simple Sheet</hal-sheet-title>
            </hal-sheet-header>
            <p class="text-sm">This is a simple sheet with just a title.</p>
          </hal-sheet-content>
        </hal-sheet>
      </div>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "sheet-simple",
      SHEET_SCREENSHOT_OPTIONS
    )
  })
})
