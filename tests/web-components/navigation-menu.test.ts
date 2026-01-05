import { describe, it, expect, beforeEach, vi } from "vitest"
import "../../src/web-components/hal-navigation-menu"
import type {
  HalNavigationMenu,
  HalNavigationMenuItem,
  HalNavigationMenuTrigger,
  HalNavigationMenuContent,
  HalNavigationMenuLink,
} from "../../src/web-components/hal-navigation-menu"

describe("hal-navigation-menu", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with default attributes", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    await menu.updateComplete

    expect(menu.dataset.slot).toBe("navigation-menu")
    expect(menu.dataset.viewport).toBe("true")
    expect(menu.classList.contains("relative")).toBe(true)
  })

  it("renders with viewport=false", async () => {
    container.innerHTML = `
      <hal-navigation-menu viewport="false">
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    // Need to set the property, not just attribute for boolean
    menu.viewport = false
    await menu.updateComplete

    expect(menu.dataset.viewport).toBe("false")
  })

  it("has correct delay duration properties", async () => {
    container.innerHTML = `
      <hal-navigation-menu delay-duration="100" skip-delay-duration="200">
        <hal-navigation-menu-list></hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    await menu.updateComplete

    expect(menu.delayDuration).toBe(100)
    expect(menu.skipDelayDuration).toBe(200)
  })
})

describe("hal-navigation-menu-list", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with correct classes", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item></hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-list")
    const list = container.querySelector("hal-navigation-menu-list")!
    await (list as any).updateComplete

    expect(list.dataset.slot).toBe("navigation-menu-list")
    expect(list.classList.contains("flex")).toBe(true)
    expect(list.classList.contains("gap-1")).toBe(true)
  })
})

describe("hal-navigation-menu-item", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with correct slot", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-item")
    const item = container.querySelector(
      "hal-navigation-menu-item"
    ) as HalNavigationMenuItem
    await item.updateComplete

    expect(item.dataset.slot).toBe("navigation-menu-item")
    expect(item.classList.contains("relative")).toBe(true)
  })

  it("opens and closes correctly", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-item")
    const item = container.querySelector(
      "hal-navigation-menu-item"
    ) as HalNavigationMenuItem
    await item.updateComplete

    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent
    await content.updateComplete

    // Initially closed
    expect(content.style.display).toBe("none")

    // Open
    item._open()
    expect(item.getAttribute("data-state")).toBe("open")
    expect(content.style.display).toBe("")
    expect(content.getAttribute("data-state")).toBe("open")

    // Close
    item._close()
    expect(item.getAttribute("data-state")).toBe("closed")
    expect(content.style.display).toBe("none")
    expect(content.getAttribute("data-state")).toBe("closed")
  })
})

describe("hal-navigation-menu-trigger", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders button with chevron", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-trigger")
    const trigger = container.querySelector(
      "hal-navigation-menu-trigger"
    ) as HalNavigationMenuTrigger
    await trigger.updateComplete

    const button = trigger.querySelector("button")
    expect(button).toBeTruthy()
    expect(button?.getAttribute("aria-haspopup")).toBe("true")
    expect(button?.getAttribute("aria-expanded")).toBe("false")

    const svg = trigger.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("has correct ARIA attributes", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>Content</hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-trigger")
    const trigger = container.querySelector(
      "hal-navigation-menu-trigger"
    ) as HalNavigationMenuTrigger
    await trigger.updateComplete

    const button = trigger.querySelector("button")!
    expect(button.getAttribute("aria-expanded")).toBe("false")

    // Open the item
    const item = container.querySelector(
      "hal-navigation-menu-item"
    ) as HalNavigationMenuItem
    item._open()

    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })
})

describe("hal-navigation-menu-content", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("is hidden by default", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content here</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-content")
    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent
    await content.updateComplete

    expect(content.style.display).toBe("none")
    expect(content.getAttribute("data-state")).toBe("closed")
  })

  it("has correct positioning classes", async () => {
    container.innerHTML = `
      <hal-navigation-menu>
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu-content")
    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent
    await content.updateComplete

    expect(content.dataset.slot).toBe("navigation-menu-content")
    expect(content.classList.contains("top-0")).toBe(true)
    expect(content.classList.contains("left-0")).toBe(true)
  })
})

describe("hal-navigation-menu-link", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders anchor element", async () => {
    container.innerHTML = `
      <hal-navigation-menu-link href="/test">Link Text</hal-navigation-menu-link>
    `
    await customElements.whenDefined("hal-navigation-menu-link")
    const link = container.querySelector(
      "hal-navigation-menu-link"
    ) as HalNavigationMenuLink
    await link.updateComplete

    const anchor = link.querySelector("a")
    expect(anchor).toBeTruthy()
    expect(anchor?.getAttribute("href")).toBe("/test")
  })

  it("handles active state", async () => {
    container.innerHTML = `
      <hal-navigation-menu-link href="/test" active>Active Link</hal-navigation-menu-link>
    `
    await customElements.whenDefined("hal-navigation-menu-link")
    const link = container.querySelector(
      "hal-navigation-menu-link"
    ) as HalNavigationMenuLink
    await link.updateComplete

    expect(link.dataset.active).toBe("true")
    const anchor = link.querySelector("a")
    expect(anchor?.getAttribute("data-active")).toBe("true")
  })

  it("has correct styling classes", async () => {
    container.innerHTML = `
      <hal-navigation-menu-link href="/test">Link</hal-navigation-menu-link>
    `
    await customElements.whenDefined("hal-navigation-menu-link")
    const link = container.querySelector(
      "hal-navigation-menu-link"
    ) as HalNavigationMenuLink
    await link.updateComplete

    const anchor = link.querySelector("a")!
    // The component uses cn() which may produce different class orderings
    expect(anchor.className).toContain("inline-flex")
    expect(anchor.className).toContain("rounded-md")
  })
})

describe("hal-navigation-menu - interaction", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    vi.useFakeTimers()
    return () => {
      container.remove()
      vi.useRealTimers()
    }
  })

  it("opens on trigger hover after delay", async () => {
    container.innerHTML = `
      <hal-navigation-menu delay-duration="100">
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    await menu.updateComplete

    const trigger = container.querySelector("hal-navigation-menu-trigger")!
    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent

    // Initially hidden
    expect(content.style.display).toBe("none")

    // Hover trigger
    trigger.dispatchEvent(new MouseEvent("mouseenter"))

    // Not yet open (delay)
    expect(content.style.display).toBe("none")

    // After delay
    vi.advanceTimersByTime(100)
    expect(content.style.display).toBe("")
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <hal-navigation-menu delay-duration="0">
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    await menu.updateComplete

    const item = container.querySelector(
      "hal-navigation-menu-item"
    ) as HalNavigationMenuItem
    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent

    // Open through menu so it tracks _activeItem
    menu._openItem(item)
    vi.advanceTimersByTime(0)
    expect(content.style.display).toBe("")

    // Press Escape
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    expect(content.style.display).toBe("none")
  })

  it("closes on click outside", async () => {
    container.innerHTML = `
      <hal-navigation-menu delay-duration="0">
        <hal-navigation-menu-list>
          <hal-navigation-menu-item>
            <hal-navigation-menu-trigger>Menu</hal-navigation-menu-trigger>
            <hal-navigation-menu-content>
              <div>Content</div>
            </hal-navigation-menu-content>
          </hal-navigation-menu-item>
        </hal-navigation-menu-list>
      </hal-navigation-menu>
    `
    await customElements.whenDefined("hal-navigation-menu")
    const menu = container.querySelector(
      "hal-navigation-menu"
    ) as HalNavigationMenu
    await menu.updateComplete

    const item = container.querySelector(
      "hal-navigation-menu-item"
    ) as HalNavigationMenuItem
    const content = container.querySelector(
      "hal-navigation-menu-content"
    ) as HalNavigationMenuContent

    // Open through menu so it tracks _activeItem
    menu._openItem(item)
    vi.advanceTimersByTime(0)
    expect(content.style.display).toBe("")

    // Click outside
    document.body.click()
    expect(content.style.display).toBe("none")
  })
})
