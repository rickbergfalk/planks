import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-input-otp"

/**
 * Visual tests for hal-input-otp web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("hal-input-otp visual", () => {
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

  it("matches basic OTP input", async () => {
    container.innerHTML = `
      <div style="padding: 20px;">
        <hal-input-otp max-length="6">
          <hal-input-otp-group>
            <hal-input-otp-slot index="0"></hal-input-otp-slot>
            <hal-input-otp-slot index="1"></hal-input-otp-slot>
            <hal-input-otp-slot index="2"></hal-input-otp-slot>
          </hal-input-otp-group>
          <hal-input-otp-separator></hal-input-otp-separator>
          <hal-input-otp-group>
            <hal-input-otp-slot index="3"></hal-input-otp-slot>
            <hal-input-otp-slot index="4"></hal-input-otp-slot>
            <hal-input-otp-slot index="5"></hal-input-otp-slot>
          </hal-input-otp-group>
        </hal-input-otp>
      </div>
    `
    await customElements.whenDefined("hal-input-otp")
    const otp = container.querySelector("hal-input-otp")! as any
    await otp.updateComplete

    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-otp-basic"
    )
  })

  it("matches OTP with values filled", async () => {
    container.innerHTML = `
      <div style="padding: 20px;">
        <hal-input-otp max-length="6" value="123456">
          <hal-input-otp-group>
            <hal-input-otp-slot index="0"></hal-input-otp-slot>
            <hal-input-otp-slot index="1"></hal-input-otp-slot>
            <hal-input-otp-slot index="2"></hal-input-otp-slot>
          </hal-input-otp-group>
          <hal-input-otp-separator></hal-input-otp-separator>
          <hal-input-otp-group>
            <hal-input-otp-slot index="3"></hal-input-otp-slot>
            <hal-input-otp-slot index="4"></hal-input-otp-slot>
            <hal-input-otp-slot index="5"></hal-input-otp-slot>
          </hal-input-otp-group>
        </hal-input-otp>
      </div>
    `
    await customElements.whenDefined("hal-input-otp")
    const otp = container.querySelector("hal-input-otp")! as any
    await otp.updateComplete

    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-otp-filled"
    )
  })

  it("matches OTP with multiple separators", async () => {
    container.innerHTML = `
      <div style="padding: 20px;">
        <hal-input-otp max-length="6">
          <hal-input-otp-group>
            <hal-input-otp-slot index="0"></hal-input-otp-slot>
            <hal-input-otp-slot index="1"></hal-input-otp-slot>
          </hal-input-otp-group>
          <hal-input-otp-separator></hal-input-otp-separator>
          <hal-input-otp-group>
            <hal-input-otp-slot index="2"></hal-input-otp-slot>
            <hal-input-otp-slot index="3"></hal-input-otp-slot>
          </hal-input-otp-group>
          <hal-input-otp-separator></hal-input-otp-separator>
          <hal-input-otp-group>
            <hal-input-otp-slot index="4"></hal-input-otp-slot>
            <hal-input-otp-slot index="5"></hal-input-otp-slot>
          </hal-input-otp-group>
        </hal-input-otp>
      </div>
    `
    await customElements.whenDefined("hal-input-otp")
    const otp = container.querySelector("hal-input-otp")! as any
    await otp.updateComplete

    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-otp-separators"
    )
  })
})
