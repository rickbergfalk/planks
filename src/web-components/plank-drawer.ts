import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let drawerId = 0

/**
 * PlankDrawer - Root container that manages drawer state
 *
 * @fires open-change - Fired when the drawer opens or closes
 *
 * @example
 * ```html
 * <plank-drawer>
 *   <plank-drawer-trigger>
 *     <button>Open</button>
 *   </plank-drawer-trigger>
 *   <plank-drawer-content>
 *     <plank-drawer-title>Title</plank-drawer-title>
 *     Content
 *   </plank-drawer-content>
 * </plank-drawer>
 * ```
 */
@customElement("plank-drawer")
export class PlankDrawer extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: PlankDrawerTrigger | null = null
  private _content: PlankDrawerContent | null = null
  private _drawerId = `plank-drawer-${++drawerId}`
  private _titleId = `${this._drawerId}-title`
  private _descriptionId = `${this._drawerId}-description`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "drawer"
  }

  updated() {
    this._updateChildren()
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  private _updateChildren() {
    this._trigger = this.querySelector(
      "plank-drawer-trigger"
    ) as PlankDrawerTrigger | null
    this._content = this.querySelector(
      "plank-drawer-content"
    ) as PlankDrawerContent | null

    if (this._trigger) {
      this._trigger._setDrawer(this)
    }
    if (this._content) {
      this._content._setDrawer(this)
      this._content._setIds(this._drawerId, this._titleId, this._descriptionId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "dialog")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._drawerId)
        } else {
          triggerEl.removeAttribute("aria-controls")
        }
      }
    }
  }

  _toggle() {
    this._setOpen(!this.open)
  }

  _close() {
    this._setOpen(false)
  }

  private _setOpen(open: boolean) {
    if (this.open !== open) {
      this.open = open
      this.dispatchEvent(
        new CustomEvent("open-change", {
          detail: { open: this.open },
          bubbles: true,
        })
      )
    }
  }

  _getTrigger() {
    return this._trigger
  }

  _getContent() {
    return this._content
  }

  _getTitleId() {
    return this._titleId
  }

  _getDescriptionId() {
    return this._descriptionId
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerTrigger - Element that triggers the drawer on click
 */
@customElement("plank-drawer-trigger")
export class PlankDrawerTrigger extends LitElement {
  private _drawer: PlankDrawer | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  willUpdate() {
    this.dataset.slot = "drawer-trigger"
  }

  _setDrawer(drawer: PlankDrawer) {
    this._drawer = drawer
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = () => {
    this._drawer?._toggle()
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerClose - Element that closes the drawer on click
 */
@customElement("plank-drawer-close")
export class PlankDrawerClose extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  willUpdate() {
    this.dataset.slot = "drawer-close"
  }

  private _handleClick = () => {
    // Find parent drawer through DOM
    const drawer = this.closest("plank-drawer") as PlankDrawer | null
    drawer?._close()
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerContent - The drawer content with overlay
 */
@customElement("plank-drawer-content")
export class PlankDrawerContent extends LitElement {
  @property({ type: String }) direction: "top" | "right" | "bottom" | "left" =
    "bottom"
  @property({ type: Boolean, attribute: "show-close-button" })
  showCloseButton = false
  @property({ type: String }) class: string = ""

  private _drawer: PlankDrawer | null = null
  private _portal: HTMLDivElement | null = null
  private _overlayEl: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _drawerId = ""
  private _titleId = ""
  private _descriptionId = ""
  private _boundHandleEscape: ((e: KeyboardEvent) => void) | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "drawer-content"
  }

  _setDrawer(drawer: PlankDrawer) {
    this._drawer = drawer
  }

  _setIds(drawerId: string, titleId: string, descriptionId: string) {
    this._drawerId = drawerId
    this._titleId = titleId
    this._descriptionId = descriptionId
  }

  _updateOpenState(open: boolean) {
    if (open) {
      this._showContent()
    } else {
      this._hideContent()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._hideContent()
  }

  private _getDirection(): "top" | "right" | "bottom" | "left" {
    return (this.direction || this.getAttribute("direction") || "bottom") as
      | "top"
      | "right"
      | "bottom"
      | "left"
  }

  private _getDirectionClasses() {
    const base = "bg-background fixed z-50 flex h-auto flex-col"

    switch (this._getDirection()) {
      case "top":
        return cn(
          base,
          "inset-x-0 top-0 mb-24 max-h-[80vh] rounded-b-lg border-b"
        )
      case "left":
        return cn(base, "inset-y-0 left-0 w-3/4 border-r sm:max-w-sm")
      case "right":
        return cn(base, "inset-y-0 right-0 w-3/4 border-l sm:max-w-sm")
      case "bottom":
      default:
        return cn(
          base,
          "inset-x-0 bottom-0 mt-24 max-h-[80vh] rounded-t-lg border-t"
        )
    }
  }

  private _getSlideInAnimationClass() {
    switch (this._getDirection()) {
      case "top":
        return "animate-plank-drawer-slide-in-from-top"
      case "left":
        return "animate-plank-drawer-slide-in-from-left"
      case "right":
        return "animate-plank-drawer-slide-in-from-right"
      case "bottom":
      default:
        return "animate-plank-drawer-slide-in-from-bottom"
    }
  }

  private _showContent() {
    if (this._portal) return

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.dataset.vaulDrawer = ""
    this._portal.style.cssText = "position: fixed; inset: 0; z-index: 50;"

    // Create overlay
    this._overlayEl = document.createElement("div")
    this._overlayEl.dataset.slot = "drawer-overlay"
    this._overlayEl.dataset.state = "open"
    this._overlayEl.className = cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
    )
    this._overlayEl.addEventListener("click", this._handleOverlayClick)

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._drawerId
    this._contentEl.setAttribute("role", "dialog")
    this._contentEl.setAttribute("aria-labelledby", this._titleId)
    this._contentEl.setAttribute("aria-describedby", this._descriptionId)
    const direction = this._getDirection()
    this._contentEl.dataset.slot = "drawer-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.direction = direction
    this._contentEl.dataset.vaulDrawerDirection = direction
    this._contentEl.className = cn(
      "group/drawer-content",
      this._getDirectionClasses(),
      this._getSlideInAnimationClass(),
      this.class
    )

    // Add drag handle for bottom drawer
    if (direction === "bottom") {
      const dragHandle = document.createElement("div")
      dragHandle.className =
        "bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full"
      this._contentEl.appendChild(dragHandle)
    }

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    // Add close button if enabled
    if (this.showCloseButton) {
      const closeButton = document.createElement("button")
      closeButton.dataset.slot = "drawer-close"
      closeButton.className = cn(
        "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
      )
      closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        <span class="sr-only">Close</span>
      `
      closeButton.addEventListener("click", () => this._drawer?._close())
      this._contentEl.appendChild(closeButton)
    }

    // Process title and description IDs
    const title = this._contentEl.querySelector("plank-drawer-title")
    if (title) {
      const titleEl = title.querySelector("h2") || title
      titleEl.id = this._titleId
    }

    const description = this._contentEl.querySelector(
      "plank-drawer-description"
    )
    if (description) {
      const descEl = description.querySelector("p") || description
      descEl.id = this._descriptionId
    }

    this._portal.appendChild(this._overlayEl)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up escape key handler
    this._boundHandleEscape = this._handleEscape.bind(this)
    document.addEventListener("keydown", this._boundHandleEscape)
  }

  private _handleOverlayClick = () => {
    this._drawer?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._drawer?._close()
    }
  }

  private _hideContent() {
    if (this._boundHandleEscape) {
      document.removeEventListener("keydown", this._boundHandleEscape)
      this._boundHandleEscape = null
    }

    if (this._overlayEl) {
      this._overlayEl.removeEventListener("click", this._handleOverlayClick)
    }

    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._overlayEl = null
      this._contentEl = null
    }
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerHeader - Header container for title and description
 */
@customElement("plank-drawer-header")
export class PlankDrawerHeader extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "drawer-header"
    // Center text for top/bottom drawers via group data attribute
    this.className = cn(
      "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerFooter - Footer container for actions
 */
@customElement("plank-drawer-footer")
export class PlankDrawerFooter extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "drawer-footer"
    this.className = cn("mt-auto flex flex-col gap-2 p-4", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerTitle - Drawer title
 */
@customElement("plank-drawer-title")
export class PlankDrawerTitle extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "drawer-title"
    this.className = cn("text-foreground font-semibold", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankDrawerDescription - Drawer description
 */
@customElement("plank-drawer-description")
export class PlankDrawerDescription extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "drawer-description"
    this.className = cn("text-muted-foreground text-sm", this.class)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-drawer": PlankDrawer
    "plank-drawer-trigger": PlankDrawerTrigger
    "plank-drawer-close": PlankDrawerClose
    "plank-drawer-content": PlankDrawerContent
    "plank-drawer-header": PlankDrawerHeader
    "plank-drawer-footer": PlankDrawerFooter
    "plank-drawer-title": PlankDrawerTitle
    "plank-drawer-description": PlankDrawerDescription
  }
}
