import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-sidebar"
import "@/web-components/hal-button"
import "@/web-components/hal-separator"
import "@/web-components/hal-skeleton"
import "@/web-components/hal-input"
import "@/web-components/hal-sheet"
import "@/web-components/hal-tooltip"

describe("hal-sidebar", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("HalSidebarProvider", () => {
    it("renders with default state (expanded)", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")!
      await (provider as any).updateComplete

      expect(provider.dataset.slot).toBe("sidebar-wrapper")
      expect(provider.className).toContain("flex")
      expect(provider.className).toContain("min-h-svh")
    })

    it("respects default-open=false", async () => {
      container.innerHTML = `
        <hal-sidebar-provider default-open="false">
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      expect(provider.state).toBe("collapsed")
    })

    it("exposes state property", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      expect(provider.state).toBe("expanded")
      provider.setOpen(false)
      expect(provider.state).toBe("collapsed")
    })

    it("toggleSidebar toggles state (desktop)", async () => {
      // Force desktop mode by directly setting _isMobile
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      // Force desktop mode for this test
      provider._isMobile = false

      expect(provider.isOpen).toBe(true)
      provider.toggleSidebar()
      expect(provider.isOpen).toBe(false)
      provider.toggleSidebar()
      expect(provider.isOpen).toBe(true)
    })

    it("toggleSidebar toggles mobile state (mobile)", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      // Force mobile mode for this test
      provider._isMobile = true

      expect(provider.openMobile).toBe(false)
      provider.toggleSidebar()
      expect(provider.openMobile).toBe(true)
      provider.toggleSidebar()
      expect(provider.openMobile).toBe(false)
    })

    it("fires open-change event", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      const handler = vi.fn()
      provider.addEventListener("open-change", handler)
      provider.setOpen(false)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.open).toBe(false)
    })

    it("sets CSS custom properties", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")!
      await (provider as any).updateComplete

      expect(provider.style.getPropertyValue("--sidebar-width")).toBe("16rem")
      expect(provider.style.getPropertyValue("--sidebar-width-icon")).toBe(
        "3rem"
      )
    })

    it("responds to keyboard shortcut (Ctrl+B)", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <span>Content</span>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      // Force desktop mode for this test
      provider._isMobile = false

      expect(provider.isOpen).toBe(true)

      // Simulate Ctrl+B
      const event = new KeyboardEvent("keydown", {
        key: "b",
        ctrlKey: true,
        bubbles: true,
      })
      window.dispatchEvent(event)

      expect(provider.isOpen).toBe(false)
    })
  })

  describe("HalSidebar", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar>
            <span>Sidebar content</span>
          </hal-sidebar>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar")
      const sidebar = container.querySelector("hal-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.slot).toBe("sidebar")
      expect(sidebar.dataset.side).toBe("left")
      expect(sidebar.dataset.variant).toBe("sidebar")
    })

    it("accepts side prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar side="right">
            <span>Content</span>
          </hal-sidebar>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar")
      const sidebar = container.querySelector("hal-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.side).toBe("right")
    })

    it("accepts variant prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar variant="floating">
            <span>Content</span>
          </hal-sidebar>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar")
      const sidebar = container.querySelector("hal-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.variant).toBe("floating")
    })

    it("accepts collapsible prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar collapsible="icon">
            <span>Content</span>
          </hal-sidebar>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar")
      const sidebar = container.querySelector("hal-sidebar")!
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await (sidebar as any).updateComplete

      // When expanded, collapsible should be empty
      expect(sidebar.dataset.collapsible).toBe("")

      // When collapsed, collapsible should show the value
      provider.setOpen(false)
      await (sidebar as any).updateComplete
      expect(sidebar.dataset.collapsible).toBe("icon")
    })

    it("renders non-collapsible sidebar correctly", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar collapsible="none">
            <span>Static sidebar</span>
          </hal-sidebar>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar")
      const sidebar = container.querySelector("hal-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.className).toContain("bg-sidebar")
      expect(sidebar.className).toContain("flex")
      expect(sidebar.className).toContain("flex-col")
    })
  })

  describe("HalSidebarTrigger", () => {
    it("renders with button", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-trigger></hal-sidebar-trigger>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-trigger")
      const trigger = container.querySelector("hal-sidebar-trigger")!
      await (trigger as any).updateComplete

      const button = trigger.querySelector("hal-button")
      expect(button).toBeTruthy()
      expect(button?.getAttribute("variant")).toBe("ghost")
      expect(button?.getAttribute("size")).toBe("icon")
    })

    it("toggles sidebar on click", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-trigger></hal-sidebar-trigger>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-trigger")
      const trigger = container.querySelector("hal-sidebar-trigger")!
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await (trigger as any).updateComplete

      // Force desktop mode for this test
      provider._isMobile = false

      expect(provider.isOpen).toBe(true)

      const button = trigger.querySelector("hal-button")!
      button.click()

      expect(provider.isOpen).toBe(false)
    })

    it("has accessible label", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-trigger></hal-sidebar-trigger>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-trigger")
      const trigger = container.querySelector("hal-sidebar-trigger")!
      await (trigger as any).updateComplete

      const srOnly = trigger.querySelector(".sr-only")
      expect(srOnly?.textContent).toContain("Toggle Sidebar")
    })
  })

  describe("HalSidebarInset", () => {
    it("renders as main element", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-inset>
            <span>Main content</span>
          </hal-sidebar-inset>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-inset")
      const inset = container.querySelector("hal-sidebar-inset")!
      await (inset as any).updateComplete

      expect(inset.dataset.slot).toBe("sidebar-inset")
      expect(inset.className).toContain("bg-background")
      expect(inset.className).toContain("flex")
      expect(inset.className).toContain("flex-col")
    })
  })

  describe("HalSidebarHeader", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-header>
          <span>Header</span>
        </hal-sidebar-header>
      `
      await customElements.whenDefined("hal-sidebar-header")
      const header = container.querySelector("hal-sidebar-header")!
      await (header as any).updateComplete

      expect(header.dataset.slot).toBe("sidebar-header")
      expect(header.dataset.sidebar).toBe("header")
      expect(header.className).toContain("flex")
      expect(header.className).toContain("flex-col")
      expect(header.className).toContain("gap-2")
      expect(header.className).toContain("p-2")
    })
  })

  describe("HalSidebarFooter", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-footer>
          <span>Footer</span>
        </hal-sidebar-footer>
      `
      await customElements.whenDefined("hal-sidebar-footer")
      const footer = container.querySelector("hal-sidebar-footer")!
      await (footer as any).updateComplete

      expect(footer.dataset.slot).toBe("sidebar-footer")
      expect(footer.dataset.sidebar).toBe("footer")
      expect(footer.className).toContain("flex")
      expect(footer.className).toContain("flex-col")
      expect(footer.className).toContain("gap-2")
      expect(footer.className).toContain("p-2")
    })
  })

  describe("HalSidebarContent", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-content>
          <span>Content</span>
        </hal-sidebar-content>
      `
      await customElements.whenDefined("hal-sidebar-content")
      const content = container.querySelector("hal-sidebar-content")!
      await (content as any).updateComplete

      expect(content.dataset.slot).toBe("sidebar-content")
      expect(content.dataset.sidebar).toBe("content")
      expect(content.className).toContain("flex")
      expect(content.className).toContain("flex-1")
      expect(content.className).toContain("overflow-auto")
    })
  })

  describe("HalSidebarGroup", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-group>
          <span>Group content</span>
        </hal-sidebar-group>
      `
      await customElements.whenDefined("hal-sidebar-group")
      const group = container.querySelector("hal-sidebar-group")!
      await (group as any).updateComplete

      expect(group.dataset.slot).toBe("sidebar-group")
      expect(group.dataset.sidebar).toBe("group")
      expect(group.className).toContain("relative")
      expect(group.className).toContain("flex")
      expect(group.className).toContain("flex-col")
      expect(group.className).toContain("p-2")
    })
  })

  describe("HalSidebarGroupLabel", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-group-label>
          <span>Label</span>
        </hal-sidebar-group-label>
      `
      await customElements.whenDefined("hal-sidebar-group-label")
      const label = container.querySelector("hal-sidebar-group-label")!
      await (label as any).updateComplete

      expect(label.dataset.slot).toBe("sidebar-group-label")
      expect(label.className).toContain("text-xs")
      expect(label.className).toContain("font-medium")
    })
  })

  describe("HalSidebarMenu", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-menu>
          <hal-sidebar-menu-item>Item</hal-sidebar-menu-item>
        </hal-sidebar-menu>
      `
      await customElements.whenDefined("hal-sidebar-menu")
      const menu = container.querySelector("hal-sidebar-menu")!
      await (menu as any).updateComplete

      expect(menu.dataset.slot).toBe("sidebar-menu")
      expect(menu.dataset.sidebar).toBe("menu")
      expect(menu.className).toContain("flex")
      expect(menu.className).toContain("flex-col")
      expect(menu.className).toContain("gap-1")
    })
  })

  describe("HalSidebarMenuItem", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-item>
          <span>Item content</span>
        </hal-sidebar-menu-item>
      `
      await customElements.whenDefined("hal-sidebar-menu-item")
      const item = container.querySelector("hal-sidebar-menu-item")!
      await (item as any).updateComplete

      expect(item.dataset.slot).toBe("sidebar-menu-item")
      expect(item.dataset.sidebar).toBe("menu-item")
      expect(item.className).toContain("group/menu-item")
      expect(item.className).toContain("relative")
    })
  })

  describe("HalSidebarMenuButton", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-menu-button>
            <span>Button</span>
          </hal-sidebar-menu-button>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-menu-button")
      const button = container.querySelector("hal-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.dataset.slot).toBe("sidebar-menu-button")
      expect(button.dataset.size).toBe("default")
      expect(button.dataset.active).toBe("false")
      expect(button.className).toContain("peer/menu-button")
      expect(button.className).toContain("flex")
      expect(button.className).toContain("items-center")
    })

    it("accepts active prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-menu-button active>
            <span>Active Button</span>
          </hal-sidebar-menu-button>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-menu-button")
      const button = container.querySelector("hal-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.dataset.active).toBe("true")
    })

    it("accepts size prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-menu-button size="sm">
            <span>Small Button</span>
          </hal-sidebar-menu-button>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-menu-button")
      const button = container.querySelector("hal-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.dataset.size).toBe("sm")
      expect(button.className).toContain("h-7")
      expect(button.className).toContain("text-xs")
    })

    it("accepts variant prop", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-menu-button variant="outline">
            <span>Outline Button</span>
          </hal-sidebar-menu-button>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-menu-button")
      const button = container.querySelector("hal-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.className).toContain("bg-background")
      expect(button.className).toContain("shadow")
    })
  })

  describe("HalSidebarMenuBadge", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-badge>5</hal-sidebar-menu-badge>
      `
      await customElements.whenDefined("hal-sidebar-menu-badge")
      const badge = container.querySelector("hal-sidebar-menu-badge")!
      await (badge as any).updateComplete

      expect(badge.dataset.slot).toBe("sidebar-menu-badge")
      expect(badge.className).toContain("absolute")
      expect(badge.className).toContain("right-1")
      expect(badge.className).toContain("text-xs")
      expect(badge.className).toContain("font-medium")
    })
  })

  describe("HalSidebarMenuSkeleton", () => {
    it("renders skeleton without icon", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-skeleton></hal-sidebar-menu-skeleton>
      `
      await customElements.whenDefined("hal-sidebar-menu-skeleton")
      const skeleton = container.querySelector("hal-sidebar-menu-skeleton")!
      await (skeleton as any).updateComplete

      const skeletons = skeleton.querySelectorAll("hal-skeleton")
      expect(skeletons.length).toBe(1) // Just text skeleton

      expect(skeleton.dataset.slot).toBe("sidebar-menu-skeleton")
    })

    it("renders skeleton with icon", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-skeleton show-icon></hal-sidebar-menu-skeleton>
      `
      await customElements.whenDefined("hal-sidebar-menu-skeleton")
      const skeleton = container.querySelector("hal-sidebar-menu-skeleton")!
      await (skeleton as any).updateComplete

      const skeletons = skeleton.querySelectorAll("hal-skeleton")
      expect(skeletons.length).toBe(2) // Icon + text skeletons
    })
  })

  describe("HalSidebarMenuSub", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub>
          <hal-sidebar-menu-sub-item>Sub item</hal-sidebar-menu-sub-item>
        </hal-sidebar-menu-sub>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub")
      const sub = container.querySelector("hal-sidebar-menu-sub")!
      await (sub as any).updateComplete

      expect(sub.dataset.slot).toBe("sidebar-menu-sub")
      expect(sub.className).toContain("border-l")
      expect(sub.className).toContain("flex")
      expect(sub.className).toContain("flex-col")
    })
  })

  describe("HalSidebarMenuSubItem", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub-item>
          <span>Sub item content</span>
        </hal-sidebar-menu-sub-item>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub-item")
      const item = container.querySelector("hal-sidebar-menu-sub-item")!
      await (item as any).updateComplete

      expect(item.dataset.slot).toBe("sidebar-menu-sub-item")
      expect(item.className).toContain("group/menu-sub-item")
      expect(item.className).toContain("relative")
    })
  })

  describe("HalSidebarMenuSubButton", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub-button>
          <span>Sub button</span>
        </hal-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub-button")
      const button = container.querySelector("hal-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.slot).toBe("sidebar-menu-sub-button")
      expect(button.dataset.size).toBe("md")
      expect(button.dataset.active).toBe("false")
      expect(button.className).toContain("text-sm")
    })

    it("accepts href prop and renders anchor", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub-button href="/link">
          <span>Link</span>
        </hal-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub-button")
      const button = container.querySelector("hal-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      const anchor = button.querySelector("a")
      expect(anchor).toBeTruthy()
      expect(anchor?.getAttribute("href")).toBe("/link")
    })

    it("accepts active prop", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub-button active>
          <span>Active</span>
        </hal-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub-button")
      const button = container.querySelector("hal-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.active).toBe("true")
    })

    it("accepts size prop", async () => {
      container.innerHTML = `
        <hal-sidebar-menu-sub-button size="sm">
          <span>Small</span>
        </hal-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("hal-sidebar-menu-sub-button")
      const button = container.querySelector("hal-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.size).toBe("sm")
      expect(button.className).toContain("text-xs")
    })
  })

  describe("HalSidebarSeparator", () => {
    it("renders separator component", async () => {
      container.innerHTML = `
        <hal-sidebar-separator></hal-sidebar-separator>
      `
      await customElements.whenDefined("hal-sidebar-separator")
      const sep = container.querySelector("hal-sidebar-separator")!
      await (sep as any).updateComplete

      expect(sep.dataset.slot).toBe("sidebar-separator")
      const innerSep = sep.querySelector("hal-separator")
      expect(innerSep).toBeTruthy()
    })
  })

  describe("HalSidebarInput", () => {
    it("renders input component", async () => {
      container.innerHTML = `
        <hal-sidebar-input placeholder="Search..."></hal-sidebar-input>
      `
      await customElements.whenDefined("hal-sidebar-input")
      const input = container.querySelector("hal-sidebar-input")!
      await (input as any).updateComplete

      expect(input.dataset.slot).toBe("sidebar-input")
      const innerInput = input.querySelector("hal-input")
      expect(innerInput).toBeTruthy()
      expect(innerInput?.getAttribute("placeholder")).toBe("Search...")
    })
  })

  describe("HalSidebarRail", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-rail></hal-sidebar-rail>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-rail")
      const rail = container.querySelector("hal-sidebar-rail")!
      await (rail as any).updateComplete

      expect(rail.dataset.slot).toBe("sidebar-rail")
      expect(rail.className).toContain("absolute")
      expect(rail.className).toContain("inset-y-0")
    })

    it("toggles sidebar on click", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-rail></hal-sidebar-rail>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-rail")
      const rail = container.querySelector("hal-sidebar-rail")!
      const provider = container.querySelector("hal-sidebar-provider")! as any
      await (rail as any).updateComplete

      // Force desktop mode for this test
      provider._isMobile = false

      expect(provider.isOpen).toBe(true)

      const button = rail.querySelector("button")!
      button.click()

      expect(provider.isOpen).toBe(false)
    })

    it("has accessible label", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar-rail></hal-sidebar-rail>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-rail")
      const rail = container.querySelector("hal-sidebar-rail")!
      await (rail as any).updateComplete

      const button = rail.querySelector("button")
      expect(button?.getAttribute("aria-label")).toBe("Toggle Sidebar")
      expect(button?.getAttribute("title")).toBe("Toggle Sidebar")
    })
  })

  describe("Full sidebar composition", () => {
    it("renders complete sidebar layout", async () => {
      container.innerHTML = `
        <hal-sidebar-provider>
          <hal-sidebar>
            <hal-sidebar-header>
              <span>Logo</span>
            </hal-sidebar-header>
            <hal-sidebar-content>
              <hal-sidebar-group>
                <hal-sidebar-group-label>Menu</hal-sidebar-group-label>
                <hal-sidebar-group-content>
                  <hal-sidebar-menu>
                    <hal-sidebar-menu-item>
                      <hal-sidebar-menu-button active>
                        <span>Home</span>
                      </hal-sidebar-menu-button>
                    </hal-sidebar-menu-item>
                    <hal-sidebar-menu-item>
                      <hal-sidebar-menu-button>
                        <span>Settings</span>
                      </hal-sidebar-menu-button>
                    </hal-sidebar-menu-item>
                  </hal-sidebar-menu>
                </hal-sidebar-group-content>
              </hal-sidebar-group>
            </hal-sidebar-content>
            <hal-sidebar-footer>
              <span>Footer</span>
            </hal-sidebar-footer>
          </hal-sidebar>
          <hal-sidebar-inset>
            <hal-sidebar-trigger></hal-sidebar-trigger>
            <main>Main content</main>
          </hal-sidebar-inset>
        </hal-sidebar-provider>
      `
      await customElements.whenDefined("hal-sidebar-provider")
      await customElements.whenDefined("hal-sidebar")
      await customElements.whenDefined("hal-sidebar-header")
      await customElements.whenDefined("hal-sidebar-content")
      await customElements.whenDefined("hal-sidebar-footer")
      await customElements.whenDefined("hal-sidebar-inset")
      await customElements.whenDefined("hal-sidebar-trigger")

      const provider = container.querySelector("hal-sidebar-provider")! as any
      await provider.updateComplete

      // Verify structure
      expect(container.querySelector("hal-sidebar")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-header")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-content")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-footer")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-inset")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-trigger")).toBeTruthy()
      expect(container.querySelector("hal-sidebar-menu")).toBeTruthy()
      // Query desktop container only (mobile container has cloned items)
      const desktopSidebar = container.querySelector(
        "[data-slot='sidebar-inner']"
      )
      expect(
        desktopSidebar?.querySelectorAll("hal-sidebar-menu-item").length
      ).toBe(2)
    })
  })
})
