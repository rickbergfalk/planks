import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-field"
import type { HalField } from "@/web-components/hal-field"

describe("HalField (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-field")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalField).updateComplete)
    )
  }

  it("Field renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field>Content</hal-field>`)
    const field = container.querySelector("hal-field")
    expect(field?.dataset.slot).toBe("field")
  })

  it("Field renders with role=group", async () => {
    await renderAndWait(`<hal-field>Content</hal-field>`)
    const field = container.querySelector("hal-field")
    expect(field?.getAttribute("role")).toBe("group")
  })

  it("Field defaults to vertical orientation", async () => {
    await renderAndWait(`<hal-field>Content</hal-field>`)
    const field = container.querySelector("hal-field")
    expect(field?.dataset.orientation).toBe("vertical")
  })

  it("Field supports horizontal orientation", async () => {
    await renderAndWait(
      `<hal-field orientation="horizontal">Content</hal-field>`
    )
    const field = container.querySelector("hal-field")
    expect(field?.dataset.orientation).toBe("horizontal")
  })

  it("FieldGroup renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-group>Content</hal-field-group>`)
    const group = container.querySelector("hal-field-group")
    expect(group?.dataset.slot).toBe("field-group")
  })

  it("FieldSet renders with role=group", async () => {
    await renderAndWait(`<hal-field-set>Content</hal-field-set>`)
    const fieldset = container.querySelector("hal-field-set")
    expect(fieldset?.dataset.slot).toBe("field-set")
    expect(fieldset?.getAttribute("role")).toBe("group")
  })

  it("FieldLegend renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-legend>Title</hal-field-legend>`)
    const legend = container.querySelector("hal-field-legend")
    expect(legend?.dataset.slot).toBe("field-legend")
    expect(legend?.textContent).toContain("Title")
  })

  it("FieldLegend supports variant attribute", async () => {
    await renderAndWait(
      `<hal-field-legend variant="label">Label Title</hal-field-legend>`
    )
    const legend = container.querySelector("hal-field-legend")
    expect(legend?.dataset.variant).toBe("label")
  })

  it("FieldLabel renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-label>Email</hal-field-label>`)
    const label = container.querySelector("hal-field-label")
    expect(label?.dataset.slot).toBe("field-label")
  })

  it("FieldTitle renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-title>Settings</hal-field-title>`)
    const title = container.querySelector("hal-field-title")
    expect(title?.dataset.slot).toBe("field-label")
  })

  it("FieldContent renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-content>Content</hal-field-content>`)
    const content = container.querySelector("hal-field-content")
    expect(content?.dataset.slot).toBe("field-content")
  })

  it("FieldDescription renders with data-slot attribute", async () => {
    await renderAndWait(
      `<hal-field-description>Help text</hal-field-description>`
    )
    const desc = container.querySelector("hal-field-description")
    expect(desc?.dataset.slot).toBe("field-description")
    expect(desc?.textContent).toContain("Help text")
  })

  it("FieldError renders with role=alert", async () => {
    await renderAndWait(`<hal-field-error>Error message</hal-field-error>`)
    const error = container.querySelector("hal-field-error")
    expect(error?.dataset.slot).toBe("field-error")
    expect(error?.getAttribute("role")).toBe("alert")
  })

  it("FieldSeparator renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-field-separator></hal-field-separator>`)
    const separator = container.querySelector("hal-field-separator")
    expect(separator?.dataset.slot).toBe("field-separator")
  })

  it("FieldSeparator supports content", async () => {
    await renderAndWait(`<hal-field-separator>or</hal-field-separator>`)
    const separator = container.querySelector("hal-field-separator")
    expect(separator?.dataset.content).toBe("true")
    expect(separator?.textContent).toContain("or")
  })

  it("renders full field composition", async () => {
    await renderAndWait(`
      <hal-field-group>
        <hal-field>
          <hal-field-label>Email</hal-field-label>
          <input type="email" placeholder="email@example.com" />
          <hal-field-description>Your email address</hal-field-description>
        </hal-field>
      </hal-field-group>
    `)
    const group = container.querySelector("hal-field-group")
    expect(group?.textContent).toContain("Email")
    expect(group?.textContent).toContain("Your email address")
  })
})
