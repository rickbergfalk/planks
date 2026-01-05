import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Navigation structure organized by category
const NAV_GROUPS = [
  {
    label: "Getting Started",
    items: [
      { name: "Home", href: "index.html" },
      { name: "Compare", href: "compare.html" },
    ],
  },
  {
    label: "Form Controls",
    items: [
      { name: "Button", href: "button.html" },
      { name: "Button Group", href: "button-group.html" },
      { name: "Checkbox", href: "checkbox.html" },
      { name: "Combobox", href: "combobox.html" },
      { name: "Field", href: "field.html" },
      { name: "Input", href: "input.html" },
      { name: "Input Group", href: "input-group.html" },
      { name: "Input OTP", href: "input-otp.html" },
      { name: "Label", href: "label.html" },
      { name: "Native Select", href: "native-select.html" },
      { name: "Radio Group", href: "radio-group.html" },
      { name: "Select", href: "select.html" },
      { name: "Slider", href: "slider.html" },
      { name: "Switch", href: "switch.html" },
      { name: "Textarea", href: "textarea.html" },
      { name: "Toggle", href: "toggle.html" },
      { name: "Toggle Group", href: "toggle-group.html" },
    ],
  },
  {
    label: "Layout",
    items: [
      { name: "Aspect Ratio", href: "aspect-ratio.html" },
      { name: "Card", href: "card.html" },
      { name: "Resizable", href: "resizable.html" },
      { name: "Scroll Area", href: "scroll-area.html" },
      { name: "Separator", href: "separator.html" },
    ],
  },
  {
    label: "Data Display",
    items: [
      { name: "Avatar", href: "avatar.html" },
      { name: "Badge", href: "badge.html" },
      { name: "Calendar", href: "calendar.html" },
      { name: "Empty", href: "empty.html" },
      { name: "Item", href: "item.html" },
      { name: "Progress", href: "progress.html" },
      { name: "Skeleton", href: "skeleton.html" },
      { name: "Table", href: "table.html" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { name: "Alert", href: "alert.html" },
      { name: "Alert Dialog", href: "alert-dialog.html" },
      { name: "Sonner", href: "sonner.html" },
      { name: "Spinner", href: "spinner.html" },
      { name: "Tooltip", href: "tooltip.html" },
    ],
  },
  {
    label: "Overlays",
    items: [
      { name: "Dialog", href: "dialog.html" },
      { name: "Drawer", href: "drawer.html" },
      { name: "Hover Card", href: "hover-card.html" },
      { name: "Popover", href: "popover.html" },
      { name: "Sheet", href: "sheet.html" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { name: "Breadcrumb", href: "breadcrumb.html" },
      { name: "Command", href: "command.html" },
      { name: "Context Menu", href: "context-menu.html" },
      { name: "Dropdown Menu", href: "dropdown-menu.html" },
      { name: "Menubar", href: "menubar.html" },
      { name: "Navigation Menu", href: "navigation-menu.html" },
      { name: "Pagination", href: "pagination.html" },
      { name: "Sidebar", href: "sidebar.html" },
      { name: "Tabs", href: "tabs.html" },
    ],
  },
  {
    label: "Disclosure",
    items: [
      { name: "Accordion", href: "accordion.html" },
      { name: "Collapsible", href: "collapsible.html" },
    ],
  },
  {
    label: "Misc",
    items: [{ name: "Kbd", href: "kbd.html" }],
  },
]

@customElement("docs-layout")
export class DocsLayout extends LitElement {
  @property({ type: String }) title?: string

  // Store original children before Lit renders
  private _originalChildren: Node[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    // Capture original children before Lit renders
    this._originalChildren = [...this.childNodes]
    super.connectedCallback()
  }

  private _getCurrentPage(): string {
    const path = window.location.pathname
    const filename = path.split("/").pop() || "index"
    return filename.replace(".html", "")
  }

  private _isActive(href: string): boolean {
    const currentPage = this._getCurrentPage()
    const hrefPage = href.replace(".html", "").split("/").pop() || ""
    // Handle index page
    if (
      currentPage === "index" &&
      (hrefPage === "index" || href.endsWith("/"))
    ) {
      return true
    }
    return currentPage === hrefPage
  }

  private _getTitle(): string {
    if (this.title) return this.title
    const currentPage = this._getCurrentPage()
    // Convert kebab-case to Title Case
    return currentPage
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  private _getHref(href: string): string {
    const isComponentPage = window.location.pathname.includes("/components/")
    if (isComponentPage) {
      // We're in /components/, so hrefs like "button.html" stay as-is
      // and "index.html" or "compare.html" need "../"
      if (href === "index.html" || href === "compare.html") {
        return `../${href}`
      }
      return href
    } else {
      // We're at root level, so hrefs need "components/" prefix
      // except index.html and compare.html
      if (href === "index.html" || href === "compare.html") {
        return href
      }
      return `components/${href}`
    }
  }

  willUpdate() {
    this.className = cn("block min-h-screen")
  }

  render() {
    const title = this._getTitle()
    const isComponentPage = window.location.pathname.includes("/components/")

    return html`
      <hal-sidebar-provider default-open>
        <hal-sidebar collapsible="offcanvas">
          <hal-sidebar-header class="!flex-row h-14 items-center border-b px-4">
            <a
              href="${isComponentPage ? "../index.html" : "index.html"}"
              class="text-xl font-bold hover:text-foreground"
            >
              hallucn
            </a>
          </hal-sidebar-header>

          <hal-sidebar-content>
            ${NAV_GROUPS.map(
              (group) => html`
                <hal-sidebar-group>
                  <hal-sidebar-group-label
                    >${group.label}</hal-sidebar-group-label
                  >
                  <hal-sidebar-group-content>
                    <hal-sidebar-menu>
                      ${group.items.map((item) => {
                        const href = this._getHref(item.href)
                        const isActive = this._isActive(item.href)
                        return html`
                          <hal-sidebar-menu-item>
                            <a
                              href="${href}"
                              class="block w-full"
                              @click=${() => {
                                // Close mobile sidebar on navigation
                                const provider = this.closest(
                                  "hal-sidebar-provider"
                                ) as HTMLElement & {
                                  isMobile?: boolean
                                  setOpenMobile?: (v: boolean) => void
                                }
                                if (provider?.isMobile) {
                                  provider.setOpenMobile(false)
                                }
                              }}
                            >
                              <hal-sidebar-menu-button ?active=${isActive}>
                                <span>${item.name}</span>
                              </hal-sidebar-menu-button>
                            </a>
                          </hal-sidebar-menu-item>
                        `
                      })}
                    </hal-sidebar-menu>
                  </hal-sidebar-group-content>
                </hal-sidebar-group>
              `
            )}
          </hal-sidebar-content>

          <hal-sidebar-footer class="border-t px-4 py-4">
            <a
              href="https://github.com/rickbergfalk/planks"
              class="text-sm text-muted-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </hal-sidebar-footer>
        </hal-sidebar>

        <hal-sidebar-inset>
          <!-- Header with hamburger for mobile -->
          <header
            class="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:px-6"
          >
            <hal-sidebar-trigger class="md:hidden"></hal-sidebar-trigger>
            <div class="flex items-center gap-2 text-sm">
              <a
                href="${isComponentPage ? "../index.html" : "index.html"}"
                class="text-muted-foreground hover:text-foreground"
              >
                hallucn
              </a>
              <span class="text-muted-foreground">/</span>
              <span class="font-medium">${title}</span>
            </div>
          </header>

          <!-- Main content area with slot for children -->
          <main class="flex-1 px-4 py-8 md:px-6 lg:px-8 max-w-4xl"></main>
        </hal-sidebar-inset>
      </hal-sidebar-provider>
    `
  }

  // Move captured children into main element after render
  firstUpdated() {
    const main = this.querySelector("main")
    if (main && this._originalChildren.length > 0) {
      this._originalChildren.forEach((child) => {
        // Skip whitespace-only text nodes
        if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()) {
          return
        }
        main.appendChild(child)
      })
    }

    // Scroll to active sidebar item after render
    this._scrollToActiveItem()
  }

  private async _scrollToActiveItem() {
    // Wait for sidebar components to render
    await this.updateComplete
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const sidebarContent = this.querySelector(
      "hal-sidebar-content"
    ) as HTMLElement
    if (!sidebarContent) return

    const activeButton = sidebarContent.querySelector(
      "hal-sidebar-menu-button[active]"
    ) as HTMLElement

    // Check for saved scroll position first
    const savedScroll = sessionStorage.getItem("docs-sidebar-scroll")
    if (savedScroll) {
      sidebarContent.scrollTop = parseInt(savedScroll, 10)

      // After restoring, check if active item is visible - if not, scroll to it
      if (
        activeButton &&
        !this._isElementVisible(activeButton, sidebarContent)
      ) {
        this._scrollToElement(activeButton, sidebarContent)
      }

      this._setupScrollPersistence(sidebarContent)
      return
    }

    // Otherwise scroll to active item
    if (activeButton) {
      this._scrollToElement(activeButton, sidebarContent)
    }

    // Set up scroll persistence
    this._setupScrollPersistence(sidebarContent)
  }

  private _isElementVisible(
    element: HTMLElement,
    container: HTMLElement
  ): boolean {
    const elementRect = element.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    return (
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom
    )
  }

  private _scrollToElement(element: HTMLElement, container: HTMLElement) {
    const buttonRect = element.getBoundingClientRect()
    const contentRect = container.getBoundingClientRect()
    const buttonOffsetTop =
      buttonRect.top - contentRect.top + container.scrollTop
    // Center the button in the viewport
    const targetScroll =
      buttonOffsetTop - container.clientHeight / 2 + buttonRect.height / 2
    container.scrollTop = Math.max(0, targetScroll)
  }

  private _setupScrollPersistence(scrollable: HTMLElement) {
    let scrollTimeout: number
    scrollable.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        sessionStorage.setItem(
          "docs-sidebar-scroll",
          String(scrollable.scrollTop)
        )
      }, 100)
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "docs-layout": DocsLayout
  }
}
