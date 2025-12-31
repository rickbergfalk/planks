import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-sidebar"
import "@/web-components/plank-button"
import "@/web-components/plank-separator"
import "@/web-components/plank-skeleton"
import "@/web-components/plank-input"
import "@/web-components/plank-sheet"
import "@/web-components/plank-tooltip"

describe("plank-sidebar", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("PlankSidebarProvider", () => {
    it("renders with default state (expanded)", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")!
      await (provider as any).updateComplete

      expect(provider.dataset.slot).toBe("sidebar-wrapper")
      expect(provider.className).toContain("flex")
      expect(provider.className).toContain("min-h-svh")
    })

    it("respects default-open=false", async () => {
      container.innerHTML = `
        <plank-sidebar-provider default-open="false">
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
      await provider.updateComplete

      expect(provider.state).toBe("collapsed")
    })

    it("exposes state property", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
      await provider.updateComplete

      expect(provider.state).toBe("expanded")
      provider.setOpen(false)
      expect(provider.state).toBe("collapsed")
    })

    it("toggleSidebar toggles state (desktop)", async () => {
      // Force desktop mode by directly setting _isMobile
      container.innerHTML = `
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
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
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
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
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
      await provider.updateComplete

      const handler = vi.fn()
      provider.addEventListener("open-change", handler)
      provider.setOpen(false)

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.open).toBe(false)
    })

    it("sets CSS custom properties", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")!
      await (provider as any).updateComplete

      expect(provider.style.getPropertyValue("--sidebar-width")).toBe("16rem")
      expect(provider.style.getPropertyValue("--sidebar-width-icon")).toBe(
        "3rem"
      )
    })

    it("responds to keyboard shortcut (Ctrl+B)", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <span>Content</span>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      const provider = container.querySelector("plank-sidebar-provider")! as any
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

  describe("PlankSidebar", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar>
            <span>Sidebar content</span>
          </plank-sidebar>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar")
      const sidebar = container.querySelector("plank-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.slot).toBe("sidebar")
      expect(sidebar.dataset.side).toBe("left")
      expect(sidebar.dataset.variant).toBe("sidebar")
    })

    it("accepts side prop", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar side="right">
            <span>Content</span>
          </plank-sidebar>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar")
      const sidebar = container.querySelector("plank-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.side).toBe("right")
    })

    it("accepts variant prop", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar variant="floating">
            <span>Content</span>
          </plank-sidebar>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar")
      const sidebar = container.querySelector("plank-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.dataset.variant).toBe("floating")
    })

    it("accepts collapsible prop", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar collapsible="icon">
            <span>Content</span>
          </plank-sidebar>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar")
      const sidebar = container.querySelector("plank-sidebar")!
      const provider = container.querySelector("plank-sidebar-provider")! as any
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
        <plank-sidebar-provider>
          <plank-sidebar collapsible="none">
            <span>Static sidebar</span>
          </plank-sidebar>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar")
      const sidebar = container.querySelector("plank-sidebar")!
      await (sidebar as any).updateComplete

      expect(sidebar.className).toContain("bg-sidebar")
      expect(sidebar.className).toContain("flex")
      expect(sidebar.className).toContain("flex-col")
    })
  })

  describe("PlankSidebarTrigger", () => {
    it("renders with button", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-trigger></plank-sidebar-trigger>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-trigger")
      const trigger = container.querySelector("plank-sidebar-trigger")!
      await (trigger as any).updateComplete

      const button = trigger.querySelector("plank-button")
      expect(button).toBeTruthy()
      expect(button?.getAttribute("variant")).toBe("ghost")
      expect(button?.getAttribute("size")).toBe("icon")
    })

    it("toggles sidebar on click", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-trigger></plank-sidebar-trigger>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-trigger")
      const trigger = container.querySelector("plank-sidebar-trigger")!
      const provider = container.querySelector("plank-sidebar-provider")! as any
      await (trigger as any).updateComplete

      // Force desktop mode for this test
      provider._isMobile = false

      expect(provider.isOpen).toBe(true)

      const button = trigger.querySelector("plank-button")!
      button.click()

      expect(provider.isOpen).toBe(false)
    })

    it("has accessible label", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-trigger></plank-sidebar-trigger>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-trigger")
      const trigger = container.querySelector("plank-sidebar-trigger")!
      await (trigger as any).updateComplete

      const srOnly = trigger.querySelector(".sr-only")
      expect(srOnly?.textContent).toContain("Toggle Sidebar")
    })
  })

  describe("PlankSidebarInset", () => {
    it("renders as main element", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-inset>
            <span>Main content</span>
          </plank-sidebar-inset>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-inset")
      const inset = container.querySelector("plank-sidebar-inset")!
      await (inset as any).updateComplete

      expect(inset.dataset.slot).toBe("sidebar-inset")
      expect(inset.className).toContain("bg-background")
      expect(inset.className).toContain("flex")
      expect(inset.className).toContain("flex-col")
    })
  })

  describe("PlankSidebarHeader", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-header>
          <span>Header</span>
        </plank-sidebar-header>
      `
      await customElements.whenDefined("plank-sidebar-header")
      const header = container.querySelector("plank-sidebar-header")!
      await (header as any).updateComplete

      expect(header.dataset.slot).toBe("sidebar-header")
      expect(header.dataset.sidebar).toBe("header")
      expect(header.className).toContain("flex")
      expect(header.className).toContain("flex-col")
      expect(header.className).toContain("gap-2")
      expect(header.className).toContain("p-2")
    })
  })

  describe("PlankSidebarFooter", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-footer>
          <span>Footer</span>
        </plank-sidebar-footer>
      `
      await customElements.whenDefined("plank-sidebar-footer")
      const footer = container.querySelector("plank-sidebar-footer")!
      await (footer as any).updateComplete

      expect(footer.dataset.slot).toBe("sidebar-footer")
      expect(footer.dataset.sidebar).toBe("footer")
      expect(footer.className).toContain("flex")
      expect(footer.className).toContain("flex-col")
      expect(footer.className).toContain("gap-2")
      expect(footer.className).toContain("p-2")
    })
  })

  describe("PlankSidebarContent", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-content>
          <span>Content</span>
        </plank-sidebar-content>
      `
      await customElements.whenDefined("plank-sidebar-content")
      const content = container.querySelector("plank-sidebar-content")!
      await (content as any).updateComplete

      expect(content.dataset.slot).toBe("sidebar-content")
      expect(content.dataset.sidebar).toBe("content")
      expect(content.className).toContain("flex")
      expect(content.className).toContain("flex-1")
      expect(content.className).toContain("overflow-auto")
    })
  })

  describe("PlankSidebarGroup", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-group>
          <span>Group content</span>
        </plank-sidebar-group>
      `
      await customElements.whenDefined("plank-sidebar-group")
      const group = container.querySelector("plank-sidebar-group")!
      await (group as any).updateComplete

      expect(group.dataset.slot).toBe("sidebar-group")
      expect(group.dataset.sidebar).toBe("group")
      expect(group.className).toContain("relative")
      expect(group.className).toContain("flex")
      expect(group.className).toContain("flex-col")
      expect(group.className).toContain("p-2")
    })
  })

  describe("PlankSidebarGroupLabel", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-group-label>
          <span>Label</span>
        </plank-sidebar-group-label>
      `
      await customElements.whenDefined("plank-sidebar-group-label")
      const label = container.querySelector("plank-sidebar-group-label")!
      await (label as any).updateComplete

      expect(label.dataset.slot).toBe("sidebar-group-label")
      expect(label.className).toContain("text-xs")
      expect(label.className).toContain("font-medium")
    })
  })

  describe("PlankSidebarMenu", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-menu>
          <plank-sidebar-menu-item>Item</plank-sidebar-menu-item>
        </plank-sidebar-menu>
      `
      await customElements.whenDefined("plank-sidebar-menu")
      const menu = container.querySelector("plank-sidebar-menu")!
      await (menu as any).updateComplete

      expect(menu.dataset.slot).toBe("sidebar-menu")
      expect(menu.dataset.sidebar).toBe("menu")
      expect(menu.className).toContain("flex")
      expect(menu.className).toContain("flex-col")
      expect(menu.className).toContain("gap-1")
    })
  })

  describe("PlankSidebarMenuItem", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-item>
          <span>Item content</span>
        </plank-sidebar-menu-item>
      `
      await customElements.whenDefined("plank-sidebar-menu-item")
      const item = container.querySelector("plank-sidebar-menu-item")!
      await (item as any).updateComplete

      expect(item.dataset.slot).toBe("sidebar-menu-item")
      expect(item.dataset.sidebar).toBe("menu-item")
      expect(item.className).toContain("group/menu-item")
      expect(item.className).toContain("relative")
    })
  })

  describe("PlankSidebarMenuButton", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-menu-button>
            <span>Button</span>
          </plank-sidebar-menu-button>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-menu-button")
      const button = container.querySelector("plank-sidebar-menu-button")!
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
        <plank-sidebar-provider>
          <plank-sidebar-menu-button active>
            <span>Active Button</span>
          </plank-sidebar-menu-button>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-menu-button")
      const button = container.querySelector("plank-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.dataset.active).toBe("true")
    })

    it("accepts size prop", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-menu-button size="sm">
            <span>Small Button</span>
          </plank-sidebar-menu-button>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-menu-button")
      const button = container.querySelector("plank-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.dataset.size).toBe("sm")
      expect(button.className).toContain("h-7")
      expect(button.className).toContain("text-xs")
    })

    it("accepts variant prop", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-menu-button variant="outline">
            <span>Outline Button</span>
          </plank-sidebar-menu-button>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-menu-button")
      const button = container.querySelector("plank-sidebar-menu-button")!
      await (button as any).updateComplete

      expect(button.className).toContain("bg-background")
      expect(button.className).toContain("shadow")
    })
  })

  describe("PlankSidebarMenuBadge", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-badge>5</plank-sidebar-menu-badge>
      `
      await customElements.whenDefined("plank-sidebar-menu-badge")
      const badge = container.querySelector("plank-sidebar-menu-badge")!
      await (badge as any).updateComplete

      expect(badge.dataset.slot).toBe("sidebar-menu-badge")
      expect(badge.className).toContain("absolute")
      expect(badge.className).toContain("right-1")
      expect(badge.className).toContain("text-xs")
      expect(badge.className).toContain("font-medium")
    })
  })

  describe("PlankSidebarMenuSkeleton", () => {
    it("renders skeleton without icon", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-skeleton></plank-sidebar-menu-skeleton>
      `
      await customElements.whenDefined("plank-sidebar-menu-skeleton")
      const skeleton = container.querySelector("plank-sidebar-menu-skeleton")!
      await (skeleton as any).updateComplete

      const skeletons = skeleton.querySelectorAll("plank-skeleton")
      expect(skeletons.length).toBe(1) // Just text skeleton

      expect(skeleton.dataset.slot).toBe("sidebar-menu-skeleton")
    })

    it("renders skeleton with icon", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-skeleton show-icon></plank-sidebar-menu-skeleton>
      `
      await customElements.whenDefined("plank-sidebar-menu-skeleton")
      const skeleton = container.querySelector("plank-sidebar-menu-skeleton")!
      await (skeleton as any).updateComplete

      const skeletons = skeleton.querySelectorAll("plank-skeleton")
      expect(skeletons.length).toBe(2) // Icon + text skeletons
    })
  })

  describe("PlankSidebarMenuSub", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub>
          <plank-sidebar-menu-sub-item>Sub item</plank-sidebar-menu-sub-item>
        </plank-sidebar-menu-sub>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub")
      const sub = container.querySelector("plank-sidebar-menu-sub")!
      await (sub as any).updateComplete

      expect(sub.dataset.slot).toBe("sidebar-menu-sub")
      expect(sub.className).toContain("border-l")
      expect(sub.className).toContain("flex")
      expect(sub.className).toContain("flex-col")
    })
  })

  describe("PlankSidebarMenuSubItem", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub-item>
          <span>Sub item content</span>
        </plank-sidebar-menu-sub-item>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub-item")
      const item = container.querySelector("plank-sidebar-menu-sub-item")!
      await (item as any).updateComplete

      expect(item.dataset.slot).toBe("sidebar-menu-sub-item")
      expect(item.className).toContain("group/menu-sub-item")
      expect(item.className).toContain("relative")
    })
  })

  describe("PlankSidebarMenuSubButton", () => {
    it("renders with default props", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub-button>
          <span>Sub button</span>
        </plank-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub-button")
      const button = container.querySelector("plank-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.slot).toBe("sidebar-menu-sub-button")
      expect(button.dataset.size).toBe("md")
      expect(button.dataset.active).toBe("false")
      expect(button.className).toContain("text-sm")
    })

    it("accepts href prop and renders anchor", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub-button href="/link">
          <span>Link</span>
        </plank-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub-button")
      const button = container.querySelector("plank-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      const anchor = button.querySelector("a")
      expect(anchor).toBeTruthy()
      expect(anchor?.getAttribute("href")).toBe("/link")
    })

    it("accepts active prop", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub-button active>
          <span>Active</span>
        </plank-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub-button")
      const button = container.querySelector("plank-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.active).toBe("true")
    })

    it("accepts size prop", async () => {
      container.innerHTML = `
        <plank-sidebar-menu-sub-button size="sm">
          <span>Small</span>
        </plank-sidebar-menu-sub-button>
      `
      await customElements.whenDefined("plank-sidebar-menu-sub-button")
      const button = container.querySelector("plank-sidebar-menu-sub-button")!
      await (button as any).updateComplete

      expect(button.dataset.size).toBe("sm")
      expect(button.className).toContain("text-xs")
    })
  })

  describe("PlankSidebarSeparator", () => {
    it("renders separator component", async () => {
      container.innerHTML = `
        <plank-sidebar-separator></plank-sidebar-separator>
      `
      await customElements.whenDefined("plank-sidebar-separator")
      const sep = container.querySelector("plank-sidebar-separator")!
      await (sep as any).updateComplete

      expect(sep.dataset.slot).toBe("sidebar-separator")
      const innerSep = sep.querySelector("plank-separator")
      expect(innerSep).toBeTruthy()
    })
  })

  describe("PlankSidebarInput", () => {
    it("renders input component", async () => {
      container.innerHTML = `
        <plank-sidebar-input placeholder="Search..."></plank-sidebar-input>
      `
      await customElements.whenDefined("plank-sidebar-input")
      const input = container.querySelector("plank-sidebar-input")!
      await (input as any).updateComplete

      expect(input.dataset.slot).toBe("sidebar-input")
      const innerInput = input.querySelector("plank-input")
      expect(innerInput).toBeTruthy()
      expect(innerInput?.getAttribute("placeholder")).toBe("Search...")
    })
  })

  describe("PlankSidebarRail", () => {
    it("renders with correct classes", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-rail></plank-sidebar-rail>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-rail")
      const rail = container.querySelector("plank-sidebar-rail")!
      await (rail as any).updateComplete

      expect(rail.dataset.slot).toBe("sidebar-rail")
      expect(rail.className).toContain("absolute")
      expect(rail.className).toContain("inset-y-0")
    })

    it("toggles sidebar on click", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar-rail></plank-sidebar-rail>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-rail")
      const rail = container.querySelector("plank-sidebar-rail")!
      const provider = container.querySelector("plank-sidebar-provider")! as any
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
        <plank-sidebar-provider>
          <plank-sidebar-rail></plank-sidebar-rail>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-rail")
      const rail = container.querySelector("plank-sidebar-rail")!
      await (rail as any).updateComplete

      const button = rail.querySelector("button")
      expect(button?.getAttribute("aria-label")).toBe("Toggle Sidebar")
      expect(button?.getAttribute("title")).toBe("Toggle Sidebar")
    })
  })

  describe("Full sidebar composition", () => {
    it("renders complete sidebar layout", async () => {
      container.innerHTML = `
        <plank-sidebar-provider>
          <plank-sidebar>
            <plank-sidebar-header>
              <span>Logo</span>
            </plank-sidebar-header>
            <plank-sidebar-content>
              <plank-sidebar-group>
                <plank-sidebar-group-label>Menu</plank-sidebar-group-label>
                <plank-sidebar-group-content>
                  <plank-sidebar-menu>
                    <plank-sidebar-menu-item>
                      <plank-sidebar-menu-button active>
                        <span>Home</span>
                      </plank-sidebar-menu-button>
                    </plank-sidebar-menu-item>
                    <plank-sidebar-menu-item>
                      <plank-sidebar-menu-button>
                        <span>Settings</span>
                      </plank-sidebar-menu-button>
                    </plank-sidebar-menu-item>
                  </plank-sidebar-menu>
                </plank-sidebar-group-content>
              </plank-sidebar-group>
            </plank-sidebar-content>
            <plank-sidebar-footer>
              <span>Footer</span>
            </plank-sidebar-footer>
          </plank-sidebar>
          <plank-sidebar-inset>
            <plank-sidebar-trigger></plank-sidebar-trigger>
            <main>Main content</main>
          </plank-sidebar-inset>
        </plank-sidebar-provider>
      `
      await customElements.whenDefined("plank-sidebar-provider")
      await customElements.whenDefined("plank-sidebar")
      await customElements.whenDefined("plank-sidebar-header")
      await customElements.whenDefined("plank-sidebar-content")
      await customElements.whenDefined("plank-sidebar-footer")
      await customElements.whenDefined("plank-sidebar-inset")
      await customElements.whenDefined("plank-sidebar-trigger")

      const provider = container.querySelector("plank-sidebar-provider")! as any
      await provider.updateComplete

      // Verify structure
      expect(container.querySelector("plank-sidebar")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-header")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-content")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-footer")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-inset")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-trigger")).toBeTruthy()
      expect(container.querySelector("plank-sidebar-menu")).toBeTruthy()
      expect(container.querySelectorAll("plank-sidebar-menu-item").length).toBe(
        2
      )
    })
  })
})
