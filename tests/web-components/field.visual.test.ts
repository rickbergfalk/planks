import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-field"
import "@/web-components/hal-input"
import "@/web-components/hal-checkbox"
import type { HalField } from "@/web-components/hal-field"

describe("HalField (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    // Wait for all field-related elements
    const fieldElements = [
      "hal-field",
      "hal-field-group",
      "hal-field-set",
      "hal-field-legend",
      "hal-field-label",
      "hal-field-title",
      "hal-field-content",
      "hal-field-description",
      "hal-field-error",
      "hal-field-separator",
      "hal-input",
      "hal-checkbox",
    ]
    await Promise.all(
      fieldElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      fieldElements.map((e) => e).join(", ")
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as HalField).updateComplete)
    )
  }

  it("basic vertical field matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field>
          <hal-field-label>Email</hal-field-label>
          <hal-input type="email" placeholder="email@example.com"></hal-input>
        </hal-field>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-basic-vertical"
    )
  })

  it("field with description matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field>
          <hal-field-label>Username</hal-field-label>
          <hal-input placeholder="johndoe"></hal-input>
          <hal-field-description>
            This will be your public display name.
          </hal-field-description>
        </hal-field>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-with-description"
    )
  })

  it("field with error matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field data-invalid="true">
          <hal-field-label>Password</hal-field-label>
          <hal-input type="password"></hal-input>
          <hal-field-error>Password must be at least 8 characters.</hal-field-error>
        </hal-field>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-with-error"
    )
  })

  it("horizontal field matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field orientation="horizontal">
          <hal-checkbox id="terms"></hal-checkbox>
          <hal-field-content>
            <hal-field-label for="terms">Accept terms and conditions</hal-field-label>
            <hal-field-description>
              You agree to our Terms of Service and Privacy Policy.
            </hal-field-description>
          </hal-field-content>
        </hal-field>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-horizontal"
    )
  })

  it("field group matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field-group>
          <hal-field>
            <hal-field-label>First name</hal-field-label>
            <hal-input placeholder="John"></hal-input>
          </hal-field>
          <hal-field>
            <hal-field-label>Last name</hal-field-label>
            <hal-input placeholder="Doe"></hal-input>
          </hal-field>
        </hal-field-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("field-group")
  })

  it("fieldset with legend matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field-set>
          <hal-field-legend>Personal Information</hal-field-legend>
          <hal-field-description>Please fill in your details below.</hal-field-description>
          <hal-field-group>
            <hal-field>
              <hal-field-label>Name</hal-field-label>
              <hal-input placeholder="Your name"></hal-input>
            </hal-field>
            <hal-field>
              <hal-field-label>Email</hal-field-label>
              <hal-input type="email" placeholder="email@example.com"></hal-input>
            </hal-field>
          </hal-field-group>
        </hal-field-set>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-fieldset"
    )
  })

  it("field separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field-group>
          <hal-field>
            <hal-field-label>Email</hal-field-label>
            <hal-input type="email" placeholder="email@example.com"></hal-input>
          </hal-field>
          <hal-field-separator>or</hal-field-separator>
          <hal-field>
            <hal-field-label>Phone</hal-field-label>
            <hal-input type="tel" placeholder="+1 (555) 000-0000"></hal-input>
          </hal-field>
        </hal-field-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "field-separator"
    )
  })

  it("field with title matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-field>
          <hal-field-title>Notification Settings</hal-field-title>
          <hal-field-description>
            Choose how you want to receive notifications.
          </hal-field-description>
        </hal-field>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("field-title")
  })
})
