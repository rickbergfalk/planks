import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-native-select"
import type {
  PlankNativeSelect,
  PlankNativeSelectOption,
  PlankNativeSelectOptGroup,
} from "@/web-components/plank-native-select"

describe("PlankNativeSelect (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<PlankNativeSelect> {
    container.innerHTML = html
    await customElements.whenDefined("plank-native-select")
    const select = container.querySelector(
      "plank-native-select"
    ) as PlankNativeSelect
    await select.updateComplete
    return select
  }

  describe("PlankNativeSelect", () => {
    it("renders with data-slot attribute", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select></plank-native-select>`
      )
      expect(selectEl).toBeDefined()
      expect(selectEl.dataset.slot).toBe("native-select-wrapper")
    })

    it("contains a native select element", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select></plank-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select")
      expect(nativeSelect).toBeTruthy()
      expect(nativeSelect!.dataset.slot).toBe("native-select")
    })

    it("contains a chevron icon", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select></plank-native-select>`
      )
      const icon = selectEl.querySelector("svg")
      expect(icon).toBeTruthy()
      expect(icon!.dataset.slot).toBe("native-select-icon")
    })

    it("supports disabled attribute", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select disabled></plank-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.disabled).toBe(true)
    })

    it("supports size attribute", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select size="sm"></plank-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.dataset.size).toBe("sm")
    })

    it("supports name attribute", async () => {
      const selectEl = await renderAndWait(
        `<plank-native-select name="fruit"></plank-native-select>`
      )
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.name).toBe("fruit")
    })

    it("moves child options into native select", async () => {
      const selectEl = await renderAndWait(`
        <plank-native-select>
          <plank-native-select-option value="a">Option A</plank-native-select-option>
          <plank-native-select-option value="b">Option B</plank-native-select-option>
        </plank-native-select>
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
        <plank-native-select value="b">
          <plank-native-select-option value="a">Option A</plank-native-select-option>
          <plank-native-select-option value="b">Option B</plank-native-select-option>
        </plank-native-select>
      `)
      const nativeSelect = selectEl.querySelector("select") as HTMLSelectElement
      expect(nativeSelect.value).toBe("b")
    })

    it("fires change event when selection changes", async () => {
      const selectEl = await renderAndWait(`
        <plank-native-select>
          <plank-native-select-option value="a">Option A</plank-native-select-option>
          <plank-native-select-option value="b">Option B</plank-native-select-option>
        </plank-native-select>
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

  describe("PlankNativeSelectOption", () => {
    it("renders with data-slot attribute", async () => {
      await customElements.whenDefined("plank-native-select-option")
      container.innerHTML = `<plank-native-select-option value="test">Test</plank-native-select-option>`
      const option = container.querySelector(
        "plank-native-select-option"
      ) as PlankNativeSelectOption
      await option.updateComplete
      expect(option.dataset.slot).toBe("native-select-option")
    })

    it("creates native option element", async () => {
      await renderAndWait(`
        <plank-native-select>
          <plank-native-select-option value="test">Test Content</plank-native-select-option>
        </plank-native-select>
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
        <plank-native-select>
          <plank-native-select-option value="test" disabled>Disabled</plank-native-select-option>
        </plank-native-select>
      `)
      const nativeOption = container.querySelector(
        "option"
      ) as HTMLOptionElement
      expect(nativeOption.disabled).toBe(true)
    })
  })

  describe("PlankNativeSelectOptGroup", () => {
    it("renders with data-slot attribute", async () => {
      await customElements.whenDefined("plank-native-select-optgroup")
      container.innerHTML = `<plank-native-select-optgroup label="Group"></plank-native-select-optgroup>`
      const optgroup = container.querySelector(
        "plank-native-select-optgroup"
      ) as PlankNativeSelectOptGroup
      await optgroup.updateComplete
      expect(optgroup.dataset.slot).toBe("native-select-optgroup")
    })

    it("creates native optgroup element", async () => {
      await renderAndWait(`
        <plank-native-select>
          <plank-native-select-optgroup label="Fruits">
            <plank-native-select-option value="apple">Apple</plank-native-select-option>
          </plank-native-select-optgroup>
        </plank-native-select>
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
        <plank-native-select>
          <plank-native-select-optgroup label="Disabled Group" disabled>
            <plank-native-select-option value="test">Test</plank-native-select-option>
          </plank-native-select-optgroup>
        </plank-native-select>
      `)
      const nativeOptgroup = container.querySelector(
        "optgroup"
      ) as HTMLOptGroupElement
      expect(nativeOptgroup.disabled).toBe(true)
    })
  })
})
