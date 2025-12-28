import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/plank-tabs"
import type {
  PlankTabs,
  PlankTabsList,
  PlankTabsTrigger,
  PlankTabsContent,
} from "../../src/web-components/plank-tabs"

describe("plank-tabs", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankTabs", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<plank-tabs></plank-tabs>`
      await customElements.whenDefined("plank-tabs")
      const el = container.querySelector("plank-tabs")!
      await (el as PlankTabs).updateComplete
      expect(el.dataset.slot).toBe("tabs")
    })

    it("defaults to no value", async () => {
      container.innerHTML = `<plank-tabs></plank-tabs>`
      await customElements.whenDefined("plank-tabs")
      const el = container.querySelector("plank-tabs") as PlankTabs
      await el.updateComplete
      expect(el.value).toBe("")
    })

    it("can be initialized with value attribute", async () => {
      container.innerHTML = `<plank-tabs value="tab1"></plank-tabs>`
      await customElements.whenDefined("plank-tabs")
      const el = container.querySelector("plank-tabs") as PlankTabs
      await el.updateComplete
      expect(el.value).toBe("tab1")
    })

    it("applies custom class", async () => {
      container.innerHTML = `<plank-tabs class="custom-class"></plank-tabs>`
      await customElements.whenDefined("plank-tabs")
      const el = container.querySelector("plank-tabs") as PlankTabs
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })

    it("applies flex flex-col gap-2 styling by default", async () => {
      container.innerHTML = `<plank-tabs></plank-tabs>`
      await customElements.whenDefined("plank-tabs")
      const el = container.querySelector("plank-tabs") as PlankTabs
      await el.updateComplete
      expect(el.classList.contains("flex")).toBe(true)
      expect(el.classList.contains("flex-col")).toBe(true)
      expect(el.classList.contains("gap-2")).toBe(true)
    })
  })

  describe("PlankTabsList", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-tabs>
          <plank-tabs-list></plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs-list")
      const list = container.querySelector("plank-tabs-list") as PlankTabsList
      await list.updateComplete
      expect(list.dataset.slot).toBe("tabs-list")
    })

    it("has tablist role", async () => {
      container.innerHTML = `
        <plank-tabs>
          <plank-tabs-list></plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs-list")
      const list = container.querySelector("plank-tabs-list") as PlankTabsList
      await list.updateComplete
      expect(list.getAttribute("role")).toBe("tablist")
    })

    it("applies muted background styling", async () => {
      container.innerHTML = `
        <plank-tabs>
          <plank-tabs-list></plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs-list")
      const list = container.querySelector("plank-tabs-list") as PlankTabsList
      await list.updateComplete
      expect(list.classList.contains("bg-muted")).toBe(true)
    })
  })

  describe("PlankTabsTrigger", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      await trigger.updateComplete
      expect(trigger.dataset.slot).toBe("tabs-trigger")
    })

    it("has tab role", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("role")).toBe("tab")
    })

    it("has tabindex=0 when active", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("tabindex")).toBe("0")
    })

    it("has tabindex=-1 when inactive", async () => {
      container.innerHTML = `
        <plank-tabs value="tab2">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      await (triggers[0] as PlankTabsTrigger).updateComplete
      expect(triggers[0].getAttribute("tabindex")).toBe("-1")
      expect(triggers[1].getAttribute("tabindex")).toBe("0")
    })

    it("has aria-selected=true when active", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("aria-selected")).toBe("true")
    })

    it("has aria-selected=false when inactive", async () => {
      container.innerHTML = `
        <plank-tabs value="tab2">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      await (triggers[0] as PlankTabsTrigger).updateComplete
      expect(triggers[0].getAttribute("aria-selected")).toBe("false")
      expect(triggers[1].getAttribute("aria-selected")).toBe("true")
    })

    it("has aria-controls pointing to content id", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await trigger.updateComplete
      await content.updateComplete
      expect(trigger.getAttribute("aria-controls")).toBe(content.id)
    })

    it("has data-state=active when selected", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      await trigger.updateComplete
      expect(trigger.dataset.state).toBe("active")
    })

    it("has data-state=inactive when not selected", async () => {
      container.innerHTML = `
        <plank-tabs value="tab2">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      await (triggers[0] as PlankTabsTrigger).updateComplete
      expect(triggers[0].getAttribute("data-state")).toBe("inactive")
      expect(triggers[1].getAttribute("data-state")).toBe("active")
    })

    it("selects tab on click", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")

      expect(tabs.value).toBe("tab1")
      ;(triggers[1] as PlankTabsTrigger).click()
      await tabs.updateComplete
      expect(tabs.value).toBe("tab2")
    })

    it("selects tab on Enter key", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")

      expect(tabs.value).toBe("tab1")
      triggers[1].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      await tabs.updateComplete
      expect(tabs.value).toBe("tab2")
    })

    it("selects tab on Space key", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")

      expect(tabs.value).toBe("tab1")
      triggers[1].dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
      await tabs.updateComplete
      expect(tabs.value).toBe("tab2")
    })

    it("moves focus with ArrowRight key", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      ;(triggers[0] as HTMLElement).focus()

      triggers[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await tabs.updateComplete
      expect(document.activeElement).toBe(triggers[1])
    })

    it("moves focus with ArrowLeft key", async () => {
      container.innerHTML = `
        <plank-tabs value="tab2">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      ;(triggers[1] as HTMLElement).focus()

      triggers[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      )
      await tabs.updateComplete
      expect(document.activeElement).toBe(triggers[0])
    })

    it("wraps focus from last to first with ArrowRight", async () => {
      container.innerHTML = `
        <plank-tabs value="tab2">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      ;(triggers[1] as HTMLElement).focus()

      triggers[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await tabs.updateComplete
      expect(document.activeElement).toBe(triggers[0])
    })

    it("wraps focus from first to last with ArrowLeft", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")
      ;(triggers[0] as HTMLElement).focus()

      triggers[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      )
      await tabs.updateComplete
      expect(document.activeElement).toBe(triggers[1])
    })

    it("does not select when disabled", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2" disabled>Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")

      expect(tabs.value).toBe("tab1")
      ;(triggers[1] as PlankTabsTrigger).click()
      await tabs.updateComplete
      expect(tabs.value).toBe("tab1")
    })
  })

  describe("PlankTabsContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("tabs-content")
    })

    it("has tabpanel role", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await content.updateComplete
      expect(content.getAttribute("role")).toBe("tabpanel")
    })

    it("has auto-generated id for aria-controls", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await content.updateComplete
      expect(content.id).toMatch(/^plank-tabs-content-/)
    })

    it("has aria-labelledby pointing to trigger id", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const trigger = container.querySelector(
        "plank-tabs-trigger"
      ) as PlankTabsTrigger
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await trigger.updateComplete
      await content.updateComplete
      expect(content.getAttribute("aria-labelledby")).toBe(trigger.id)
    })

    it("is visible when active", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const content = container.querySelector(
        "plank-tabs-content"
      ) as PlankTabsContent
      await content.updateComplete
      expect(content.hasAttribute("hidden")).toBe(false)
    })

    it("is hidden when inactive", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
          <plank-tabs-content value="tab2">Content 2</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const contents = container.querySelectorAll("plank-tabs-content")
      await (contents[1] as PlankTabsContent).updateComplete
      expect(contents[0].hasAttribute("hidden")).toBe(false)
      expect(contents[1].hasAttribute("hidden")).toBe(true)
    })

    it("has data-state reflecting active state", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
          <plank-tabs-content value="tab2">Content 2</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const contents = container.querySelectorAll("plank-tabs-content")
      await (contents[0] as PlankTabsContent).updateComplete
      await (contents[1] as PlankTabsContent).updateComplete
      expect(contents[0].getAttribute("data-state")).toBe("active")
      expect(contents[1].getAttribute("data-state")).toBe("inactive")
    })
  })

  describe("Events", () => {
    it("fires value-change event when tab changes", async () => {
      container.innerHTML = `
        <plank-tabs value="tab1">
          <plank-tabs-list>
            <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
            <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
          </plank-tabs-list>
          <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
          <plank-tabs-content value="tab2">Content 2</plank-tabs-content>
        </plank-tabs>
      `
      await customElements.whenDefined("plank-tabs")
      const tabs = container.querySelector("plank-tabs") as PlankTabs
      await tabs.updateComplete
      const triggers = container.querySelectorAll("plank-tabs-trigger")

      const events: CustomEvent[] = []
      tabs.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )
      ;(triggers[1] as PlankTabsTrigger).click()
      await tabs.updateComplete
      expect(events.length).toBe(1)
      expect(events[0].detail.value).toBe("tab2")
    })
  })
})
