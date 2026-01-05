import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-native-select"
import type {
  HalNativeSelect,
  HalNativeSelectOption,
  HalNativeSelectOptGroup,
} from "@/web-components/hal-native-select"

describe("HalNativeSelect (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalNativeSelect> {
    container.innerHTML = html
    await customElements.whenDefined("hal-native-select")
    const select = container.querySelector(
      "hal-native-select"
    ) as HalNativeSelect
    await select.updateComplete
    return select
  }

  describe("HalNativeSelect", () => {
    it("renders with data-slot attribute", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select></hal-native-select>`
      )
      expect(selectEl).toBeDefined()
      expect(selectEl.dataset.slot).toBe("native-select-wrapper")
    })

    it("contains a native select element", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select></hal-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select")
      expect(nativeSelect).toBeTruthy()
      expect(nativeSelect!.dataset.slot).toBe("native-select")
    })

    it("contains a chevron icon", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select></hal-native-select>`
      )
      const icon = selectEl.querySelector("svg")
      expect(icon).toBeTruthy()
      expect(icon!.dataset.slot).toBe("native-select-icon")
    })

    it("supports disabled attribute", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select disabled></hal-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.disabled).toBe(true)
    })

    it("supports size attribute", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select size="sm"></hal-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.dataset.size).toBe("sm")
    })

    it("supports name attribute", async () => {
      const selectEl = await renderAndWait(
        `<hal-native-select name="fruit"></hal-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.name).toBe("fruit")
    })

    it("moves child options into native select", async () => {
      const selectEl = await renderAndWait(`
        <hal-native-select>
          <hal-native-select-option value="a">Option A</hal-native-select-option>
          <hal-native-select-option value="b">Option B</hal-native-select-option>
        </hal-native-select>
      `)
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      const options = nativeSelect.querySelectorAll("option")
      expect(options.length).toBe(2)
      expect(options[0].value).toBe("a")
      expect(options[0].textContent).toBe("Option A")
      expect(options[1].value).toBe("b")
      expect(options[1].textContent).toBe("Option B")
    })

    it("supports value property", async () => {
      const selectEl = await renderAndWait(`
        <hal-native-select value="b">
          <hal-native-select-option value="a">Option A</hal-native-select-option>
          <hal-native-select-option value="b">Option B</hal-native-select-option>
        </hal-native-select>
      `)
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.value).toBe("b")
    })

    it("fires change event when selection changes", async () => {
      const selectEl = await renderAndWait(`
        <hal-native-select>
          <hal-native-select-option value="a">Option A</hal-native-select-option>
          <hal-native-select-option value="b">Option B</hal-native-select-option>
        </hal-native-select>
      `)
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement

      let eventValue: string | undefined
      selectEl.addEventListener("change", ((e: CustomEvent) => {
        eventValue = e.detail.value
      }) as EventListener)

      nativeSelect.value = "b"
      nativeSelect.dispatchEvent(new Event("change", { bubbles: true }))

      expect(eventValue).toBe("b")
    })
  })

  describe("HalNativeSelectOption", () => {
    it("renders with data-slot attribute", async () => {
      await customElements.whenDefined("hal-native-select-option")
      container.innerHTML = `<hal-native-select-option value="test">Test</hal-native-select-option>`
      const option = container.querySelector(
        "hal-native-select-option"
      ) as HalNativeSelectOption
      await option.updateComplete
      expect(option.dataset.slot).toBe("native-select-option")
    })

    it("creates native option element", async () => {
      await renderAndWait(`
        <hal-native-select>
          <hal-native-select-option value="test">Test Content</hal-native-select-option>
        </hal-native-select>
      `)
      const nativeOption = container.querySelector(
        "option"
      ) as HTMLOptionElement
      expect(nativeOption).toBeTruthy()
      expect(nativeOption.value).toBe("test")
      expect(nativeOption.textContent).toBe("Test Content")
    })

    it("supports disabled attribute", async () => {
      await renderAndWait(`
        <hal-native-select>
          <hal-native-select-option value="test" disabled>Disabled</hal-native-select-option>
        </hal-native-select>
      `)
      const nativeOption = container.querySelector(
        "option"
      ) as HTMLOptionElement
      expect(nativeOption.disabled).toBe(true)
    })
  })

  describe("HalNativeSelectOptGroup", () => {
    it("renders with data-slot attribute", async () => {
      await customElements.whenDefined("hal-native-select-optgroup")
      container.innerHTML = `<hal-native-select-optgroup label="Group"></hal-native-select-optgroup>`
      const optgroup = container.querySelector(
        "hal-native-select-optgroup"
      ) as HalNativeSelectOptGroup
      await optgroup.updateComplete
      expect(optgroup.dataset.slot).toBe("native-select-optgroup")
    })

    it("creates native optgroup element", async () => {
      await renderAndWait(`
        <hal-native-select>
          <hal-native-select-optgroup label="Fruits">
            <hal-native-select-option value="apple">Apple</hal-native-select-option>
          </hal-native-select-optgroup>
        </hal-native-select>
      `)
      const nativeOptgroup = container.querySelector(
        "optgroup"
      ) as HTMLOptGroupElement
      expect(nativeOptgroup).toBeTruthy()
      expect(nativeOptgroup.label).toBe("Fruits")
      const options = nativeOptgroup.querySelectorAll("option")
      expect(options.length).toBe(1)
      expect(options[0].value).toBe("apple")
    })

    it("supports disabled attribute", async () => {
      await renderAndWait(`
        <hal-native-select>
          <hal-native-select-optgroup label="Disabled Group" disabled>
            <hal-native-select-option value="test">Test</hal-native-select-option>
          </hal-native-select-optgroup>
        </hal-native-select>
      `)
      const nativeOptgroup = container.querySelector(
        "optgroup"
      ) as HTMLOptGroupElement
      expect(nativeOptgroup.disabled).toBe(true)
    })
  })
})
