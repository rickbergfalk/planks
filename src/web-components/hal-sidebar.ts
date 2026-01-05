import { LitElement, html, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Constants matching React implementation
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
const MOBILE_BREAKPOINT = 768

type SidebarState = "expanded" | "collapsed"

/**
 * HalSidebarProvider - Provider for sidebar context and state
 *
 * @fires open-change - Fires when sidebar open state changes
 *
 * @example
 * ```html
 * <hal-sidebar-provider>
 *   <hal-sidebar>
 *     <hal-sidebar-header>Header</hal-sidebar-header>
 *     <hal-sidebar-content>Content</hal-sidebar-content>
 *   </hal-sidebar>
 *   <hal-sidebar-inset>
 *     <hal-sidebar-trigger></hal-sidebar-trigger>
 *     Main content
 *   </hal-sidebar-inset>
 * </hal-sidebar-provider>
 * ```
 */
@customElement("hal-sidebar-provider")
export class HalSidebarProvider extends LitElement {
  @property({
    attribute: "default-open",
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value) => (value ? "true" : "false"),
    },
  })
  defaultOpen = true
  @property({ type: Boolean }) open?: boolean
  @property({ type: String }) class: string = ""

  @state() private _internalOpen: boolean | null = null
  @state() private _openMobile = false
  @state() private _isMobile = false

  private _resizeObserver?: ResizeObserver
  private _boundKeydownHandler = this._handleKeydown.bind(this)

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Initialize _internalOpen from defaultOpen on first connect
    if (this._internalOpen === null) {
      this._internalOpen = this.defaultOpen
    }
    this._checkMobile()

    // Watch for viewport changes
    this._resizeObserver = new ResizeObserver(() => this._checkMobile())
    this._resizeObserver.observe(document.body)

    // Keyboard shortcut
    window.addEventListener("keydown", this._boundKeydownHandler)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._resizeObserver?.disconnect()
    window.removeEventListener("keydown", this._boundKeydownHandler)
  }

  private _checkMobile() {
    this._isMobile = window.innerWidth < MOBILE_BREAKPOINT
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      this.toggleSidebar()
    }
  }

  get isOpen(): boolean {
    return this.open ?? this._internalOpen ?? this.defaultOpen
  }

  get state(): SidebarState {
    return this.isOpen ? "expanded" : "collapsed"
  }

  get isMobile(): boolean {
    return this._isMobile
  }

  get openMobile(): boolean {
    return this._openMobile
  }

  setOpen(value: boolean) {
    if (this.open === undefined) {
      this._internalOpen = value
    }
    // Store in cookie
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`

    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: { open: value },
        bubbles: true,
        composed: true,
      })
    )
    this.requestUpdate()
  }

  setOpenMobile(value: boolean) {
    this._openMobile = value
    this.dispatchEvent(
      new CustomEvent("open-mobile-change", {
        detail: { open: value },
        bubbles: true,
        composed: true,
      })
    )
    this.requestUpdate()
  }

  toggleSidebar() {
    if (this._isMobile) {
      this.setOpenMobile(!this._openMobile)
    } else {
      this.setOpen(!this.isOpen)
    }
  }

  willUpdate() {
    this.dataset.slot = "sidebar-wrapper"
    this.style.setProperty("--sidebar-width", SIDEBAR_WIDTH)
    this.style.setProperty("--sidebar-width-icon", SIDEBAR_WIDTH_ICON)
    this.className = cn(
      "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebar - Main sidebar container
 *
 * Simplified CSS-first approach:
 * - Always renders both desktop sidebar and mobile sheet
 * - CSS media queries control visibility (hidden/md:flex)
 * - No JavaScript mobile state tracking needed for layout
 * - Mobile sheet only needs open/close state from provider
 */
@customElement("hal-sidebar")
export class HalSidebar extends LitElement {
  @property({ type: String }) side: "left" | "right" = "left"
  @property({ type: String }) variant: "sidebar" | "floating" | "inset" =
    "sidebar"
  @property({ type: String }) collapsible: "offcanvas" | "icon" | "none" =
    "offcanvas"
  @property({ type: String }) class: string = ""

  private _provider: HalSidebarProvider | null = null
  private _originalChildren: Node[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    // Capture original children before Lit renders (slots don't work in Light DOM)
    this._originalChildren = [...this.childNodes]
    super.connectedCallback()
    this._provider = this.closest("hal-sidebar-provider")
    // Listen for state changes to update sheet open state
    this._provider?.addEventListener(
      "open-change",
      this._handleProviderChange as EventListener
    )
    this._provider?.addEventListener(
      "open-mobile-change",
      this._handleProviderChange as EventListener
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._provider?.removeEventListener(
      "open-change",
      this._handleProviderChange as EventListener
    )
    this._provider?.removeEventListener(
      "open-mobile-change",
      this._handleProviderChange as EventListener
    )
  }

  private _handleProviderChange = () => {
    this.requestUpdate()
  }

  private _handleSheetOpenChange = (e: CustomEvent) => {
    this._provider?.setOpenMobile(e.detail.open)
  }

  willUpdate() {
    const state = this._provider?.state ?? "expanded"

    this.dataset.slot = "sidebar"
    this.dataset.state = state
    this.dataset.collapsible = state === "collapsed" ? this.collapsible : ""
    this.dataset.variant = this.variant
    this.dataset.side = this.side

    if (this.collapsible === "none") {
      this.className = cn(
        "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
        this.class
      )
    } else {
      // Always use this class - CSS handles mobile/desktop visibility
      this.className = cn("group peer text-sidebar-foreground", this.class)
    }
  }

  firstUpdated() {
    if (this._originalChildren.length === 0) return
    if (this.collapsible === "none") return

    // Put children in desktop container
    const desktopTarget = this.querySelector("[data-slot='sidebar-inner']")
    if (desktopTarget) {
      this._originalChildren.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()) {
          return
        }
        desktopTarget.appendChild(child)
      })
    }

    // Clone children to mobile container
    const mobileTarget = this.querySelector(
      "[data-slot='sidebar-mobile-inner']"
    )
    if (mobileTarget && desktopTarget) {
      Array.from(desktopTarget.childNodes).forEach((child) => {
        mobileTarget.appendChild(child.cloneNode(true))
      })
    }
  }

  render() {
    const openMobile = this._provider?.openMobile ?? false

    if (this.collapsible === "none") {
      return html``
    }

    // Always render BOTH desktop and mobile - CSS controls visibility
    return html`
      <!-- Desktop: Gap element (hidden on mobile via CSS) -->
      <div
        data-slot="sidebar-gap"
        class=${cn(
          "hidden md:block relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          this.variant === "floating" || this.variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      ></div>
      <!-- Desktop: Sidebar container (hidden on mobile via CSS) -->
      <div
        data-slot="sidebar-container"
        class=${cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          this.side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          this.variant === "floating" || this.variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l"
        )}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        ></div>
      </div>
      <!-- Mobile: Sheet (always in DOM, CSS hides trigger area, sheet controls overlay) -->
      <hal-sheet
        ?open=${openMobile}
        @open-change=${this._handleSheetOpenChange}
        class="md:hidden"
      >
        <hal-sheet-content
          data-sidebar="sidebar"
          data-mobile="true"
          side=${this.side}
          class=${cn(
            "bg-sidebar text-sidebar-foreground p-0",
            "w-(--sidebar-width) [&>button]:hidden"
          )}
          style="--sidebar-width: ${SIDEBAR_WIDTH_MOBILE}"
        >
          <hal-sheet-header class="sr-only">
            <hal-sheet-title>Sidebar</hal-sheet-title>
            <hal-sheet-description
              >Displays the mobile sidebar.</hal-sheet-description
            >
          </hal-sheet-header>
          <div
            data-slot="sidebar-mobile-inner"
            class="flex h-full w-full flex-col"
          ></div>
        </hal-sheet-content>
      </hal-sheet>
    `
  }
}

/**
 * HalSidebarTrigger - Button to toggle sidebar
 */
@customElement("hal-sidebar-trigger")
export class HalSidebarTrigger extends LitElement {
  @property({ type: String }) class: string = ""

  private _provider: HalSidebarProvider | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._provider = this.closest("hal-sidebar-provider")
  }

  private _handleClick = (e: MouseEvent) => {
    this._provider?.toggleSidebar()
    // Dispatch click event for any additional handlers
    this.dispatchEvent(new MouseEvent("click", e))
  }

  willUpdate() {
    this.dataset.slot = "sidebar-trigger"
    this.dataset.sidebar = "trigger"
    this.className = "contents"
  }

  render() {
    return html`
      <hal-button
        variant="ghost"
        size="icon"
        class=${cn("size-7", this.class)}
        @click=${this._handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
        <span class="sr-only">Toggle Sidebar</span>
      </hal-button>
    `
  }
}

/**
 * HalSidebarRail - Edge rail for toggling sidebar
 */
@customElement("hal-sidebar-rail")
export class HalSidebarRail extends LitElement {
  @property({ type: String }) class: string = ""

  private _provider: HalSidebarProvider | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._provider = this.closest("hal-sidebar-provider")
  }

  private _handleClick = () => {
    this._provider?.toggleSidebar()
  }

  willUpdate() {
    this.dataset.slot = "sidebar-rail"
    this.dataset.sidebar = "rail"
    this.className = cn(
      "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
      "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
      "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
      "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
      "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
      "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
      this.class
    )
  }

  render() {
    return html`
      <button
        aria-label="Toggle Sidebar"
        tabindex="-1"
        title="Toggle Sidebar"
        @click=${this._handleClick}
        class="absolute inset-0 w-full h-full cursor-inherit"
      ></button>
    `
  }
}

/**
 * HalSidebarInset - Main content area next to sidebar
 */
@customElement("hal-sidebar-inset")
export class HalSidebarInset extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-inset"
    this.className = cn(
      "bg-background relative flex w-full flex-1 flex-col",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarInput - Styled input for sidebar
 */
@customElement("hal-sidebar-input")
export class HalSidebarInput extends LitElement {
  @property({ type: String }) class: string = ""
  @property({ type: String }) placeholder: string = ""
  @property({ type: String }) value: string = ""
  @property({ type: String }) type: string = "text"

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-input"
    this.dataset.sidebar = "input"
    this.className = "contents"
  }

  render() {
    return html`
      <hal-input
        class=${cn("bg-background h-8 w-full shadow-none", this.class)}
        placeholder=${this.placeholder}
        .value=${this.value}
        type=${this.type}
      ></hal-input>
    `
  }
}

/**
 * HalSidebarHeader - Header section of sidebar
 */
@customElement("hal-sidebar-header")
export class HalSidebarHeader extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-header"
    this.dataset.sidebar = "header"
    this.className = cn("flex flex-col gap-2 p-2", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarFooter - Footer section of sidebar
 */
@customElement("hal-sidebar-footer")
export class HalSidebarFooter extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-footer"
    this.dataset.sidebar = "footer"
    this.className = cn("flex flex-col gap-2 p-2", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarSeparator - Separator in sidebar
 */
@customElement("hal-sidebar-separator")
export class HalSidebarSeparator extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-separator"
    this.dataset.sidebar = "separator"
    this.className = "contents"
  }

  render() {
    return html`
      <hal-separator
        class=${cn("bg-sidebar-border mx-2 w-auto", this.class)}
      ></hal-separator>
    `
  }
}

/**
 * HalSidebarContent - Scrollable content area of sidebar
 */
@customElement("hal-sidebar-content")
export class HalSidebarContent extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-content"
    this.dataset.sidebar = "content"
    this.className = cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarGroup - Group container for sidebar items
 */
@customElement("hal-sidebar-group")
export class HalSidebarGroup extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-group"
    this.dataset.sidebar = "group"
    this.className = cn("relative flex w-full min-w-0 flex-col p-2", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarGroupLabel - Label for a sidebar group
 */
@customElement("hal-sidebar-group-label")
export class HalSidebarGroupLabel extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-group-label"
    this.dataset.sidebar = "group-label"
    this.className = cn(
      "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarGroupAction - Action button for a sidebar group
 */
@customElement("hal-sidebar-group-action")
export class HalSidebarGroupAction extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-group-action"
    this.dataset.sidebar = "group-action"
    this.className = cn(
      "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      "after:absolute after:-inset-2 md:after:hidden",
      "group-data-[collapsible=icon]:hidden",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarGroupContent - Content area for a sidebar group
 */
@customElement("hal-sidebar-group-content")
export class HalSidebarGroupContent extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-group-content"
    this.dataset.sidebar = "group-content"
    this.className = cn("w-full text-sm", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenu - Menu container for sidebar items
 */
@customElement("hal-sidebar-menu")
export class HalSidebarMenu extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu"
    this.dataset.sidebar = "menu"
    this.className = cn("flex w-full min-w-0 flex-col gap-1", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuItem - Individual menu item
 */
@customElement("hal-sidebar-menu-item")
export class HalSidebarMenuItem extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-item"
    this.dataset.sidebar = "menu-item"
    this.className = cn("group/menu-item relative", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuButton - Button within a menu item
 */
@customElement("hal-sidebar-menu-button")
export class HalSidebarMenuButton extends LitElement {
  @property({ type: String }) variant: "default" | "outline" = "default"
  @property({ type: String }) size: "default" | "sm" | "lg" = "default"
  @property({ type: Boolean }) active = false
  @property({ type: String }) tooltip: string = ""
  @property({ type: String }) class: string = ""

  private _provider: HalSidebarProvider | null = null
  // Store children for manual distribution (slot doesn't work in light DOM)
  private _childNodes: Node[] = []
  private _tooltipShown = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Capture children before first render
    this._childNodes = [...this.childNodes].filter(
      (n) => n.nodeType !== Node.COMMENT_NODE
    )
    this._provider = this.closest("hal-sidebar-provider")
    this._provider?.addEventListener(
      "open-change",
      this._handleProviderChange as EventListener
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._provider?.removeEventListener(
      "open-change",
      this._handleProviderChange as EventListener
    )
  }

  private _handleProviderChange = () => {
    this.requestUpdate()
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-button"
    this.dataset.sidebar = "menu-button"
    this.dataset.size = this.size
    this.dataset.active = String(this.active)

    const baseClasses =
      "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"

    const variantClasses =
      this.variant === "outline"
        ? "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"

    const sizeClasses =
      this.size === "sm"
        ? "h-7 text-xs"
        : this.size === "lg"
          ? "h-12 text-sm group-data-[collapsible=icon]:p-0!"
          : "h-8 text-sm"

    this.className = cn(baseClasses, variantClasses, sizeClasses, this.class)
  }

  updated() {
    const state = this._provider?.state ?? "expanded"
    const isMobile = this._provider?.isMobile ?? false
    const showTooltip = this.tooltip && state === "collapsed" && !isMobile

    if (showTooltip && !this._tooltipShown) {
      // Move children into the tooltip trigger
      const trigger = this.querySelector("hal-tooltip-trigger")
      this._childNodes.forEach((child) => trigger?.appendChild(child))
      this._tooltipShown = true
    } else if (!showTooltip && this._tooltipShown) {
      // Move children back to this element
      this._childNodes.forEach((child) => this.appendChild(child))
      this._tooltipShown = false
    }
  }

  render() {
    const state = this._provider?.state ?? "expanded"
    const isMobile = this._provider?.isMobile ?? false
    const showTooltip = this.tooltip && state === "collapsed" && !isMobile

    if (showTooltip) {
      return html`
        <hal-tooltip>
          <hal-tooltip-trigger class="contents"></hal-tooltip-trigger>
          <hal-tooltip-content side="right" align="center">
            ${this.tooltip}
          </hal-tooltip-content>
        </hal-tooltip>
      `
    }

    return html``
  }
}

/**
 * HalSidebarMenuAction - Action button within a menu item
 */
@customElement("hal-sidebar-menu-action")
export class HalSidebarMenuAction extends LitElement {
  @property({ type: Boolean, attribute: "show-on-hover" }) showOnHover = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-action"
    this.dataset.sidebar = "menu-action"
    this.className = cn(
      "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      "after:absolute after:-inset-2 md:after:hidden",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      this.showOnHover &&
        "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuBadge - Badge within a menu item
 */
@customElement("hal-sidebar-menu-badge")
export class HalSidebarMenuBadge extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-badge"
    this.dataset.sidebar = "menu-badge"
    this.className = cn(
      "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuSkeleton - Loading skeleton for menu items
 */
@customElement("hal-sidebar-menu-skeleton")
export class HalSidebarMenuSkeleton extends LitElement {
  @property({ type: Boolean, attribute: "show-icon" }) showIcon = false
  @property({ type: String }) class: string = ""

  private _width = `${Math.floor(Math.random() * 40) + 50}%`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-skeleton"
    this.dataset.sidebar = "menu-skeleton"
    this.className = cn(
      "flex h-8 items-center gap-2 rounded-md px-2",
      this.class
    )
  }

  render() {
    return html`
      ${this.showIcon
        ? html`
            <hal-skeleton
              class="size-4 rounded-md"
              data-sidebar="menu-skeleton-icon"
            ></hal-skeleton>
          `
        : nothing}
      <hal-skeleton
        class="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style="--skeleton-width: ${this._width}"
      ></hal-skeleton>
    `
  }
}

/**
 * HalSidebarMenuSub - Submenu container
 */
@customElement("hal-sidebar-menu-sub")
export class HalSidebarMenuSub extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-sub"
    this.dataset.sidebar = "menu-sub"
    this.className = cn(
      "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuSubItem - Individual submenu item
 */
@customElement("hal-sidebar-menu-sub-item")
export class HalSidebarMenuSubItem extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-sub-item"
    this.dataset.sidebar = "menu-sub-item"
    this.className = cn("group/menu-sub-item relative", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSidebarMenuSubButton - Button within a submenu item
 */
@customElement("hal-sidebar-menu-sub-button")
export class HalSidebarMenuSubButton extends LitElement {
  @property({ type: String }) size: "sm" | "md" = "md"
  @property({ type: Boolean }) active = false
  @property({ type: String }) href: string = ""
  @property({ type: String }) class: string = ""

  // Store children for manual distribution (slot doesn't work in light DOM)
  private _childNodes: Node[] = []
  private _anchorRendered = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Capture children before first render
    this._childNodes = [...this.childNodes].filter(
      (n) => n.nodeType !== Node.COMMENT_NODE
    )
  }

  willUpdate() {
    this.dataset.slot = "sidebar-menu-sub-button"
    this.dataset.sidebar = "menu-sub-button"
    this.dataset.size = this.size
    this.dataset.active = String(this.active)

    this.className = cn(
      "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
      "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
      this.size === "sm" && "text-xs",
      this.size === "md" && "text-sm",
      "group-data-[collapsible=icon]:hidden",
      this.class
    )
  }

  updated() {
    if (this.href && !this._anchorRendered) {
      // Move children into the anchor
      const anchor = this.querySelector("a")
      this._childNodes.forEach((child) => anchor?.appendChild(child))
      this._anchorRendered = true
    } else if (!this.href && this._anchorRendered) {
      // Move children back to this element
      this._childNodes.forEach((child) => this.appendChild(child))
      this._anchorRendered = false
    }
  }

  render() {
    if (this.href) {
      // Children are moved into anchor in updated() for accessible name
      // eslint-disable-next-line lit-a11y/accessible-name
      return html`<a href=${this.href} class="contents"></a>`
    }
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-sidebar-provider": HalSidebarProvider
    "hal-sidebar": HalSidebar
    "hal-sidebar-trigger": HalSidebarTrigger
    "hal-sidebar-rail": HalSidebarRail
    "hal-sidebar-inset": HalSidebarInset
    "hal-sidebar-input": HalSidebarInput
    "hal-sidebar-header": HalSidebarHeader
    "hal-sidebar-footer": HalSidebarFooter
    "hal-sidebar-separator": HalSidebarSeparator
    "hal-sidebar-content": HalSidebarContent
    "hal-sidebar-group": HalSidebarGroup
    "hal-sidebar-group-label": HalSidebarGroupLabel
    "hal-sidebar-group-action": HalSidebarGroupAction
    "hal-sidebar-group-content": HalSidebarGroupContent
    "hal-sidebar-menu": HalSidebarMenu
    "hal-sidebar-menu-item": HalSidebarMenuItem
    "hal-sidebar-menu-button": HalSidebarMenuButton
    "hal-sidebar-menu-action": HalSidebarMenuAction
    "hal-sidebar-menu-badge": HalSidebarMenuBadge
    "hal-sidebar-menu-skeleton": HalSidebarMenuSkeleton
    "hal-sidebar-menu-sub": HalSidebarMenuSub
    "hal-sidebar-menu-sub-item": HalSidebarMenuSubItem
    "hal-sidebar-menu-sub-button": HalSidebarMenuSubButton
  }
}
