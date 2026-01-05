import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let sheetId = 0

/**
 * HalSheet - Root container that manages sheet state
 *
 * @fires open-change - Fired when the sheet opens or closes
 *
 * @example
 * ```html
 * <hal-sheet>
 *   <hal-sheet-trigger>
 *     <button>Open</button>
 *   </hal-sheet-trigger>
 *   <hal-sheet-content side="right">
 *     <hal-sheet-title>Title</hal-sheet-title>
 *     Content
 *   </hal-sheet-content>
 * </hal-sheet>
 * ```
 */
@customElement("hal-sheet")
export class HalSheet extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: HalSheetTrigger | null = null
  private _content: HalSheetContent | null = null
  private _sheetId = `hal-sheet-${++sheetId}`
  private _titleId = `${this._sheetId}-title`
  private _descriptionId = `${this._sheetId}-description`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sheet"
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
      "hal-sheet-trigger"
    ) as HalSheetTrigger | null
    this._content = this.querySelector(
      "hal-sheet-content"
    ) as HalSheetContent | null

    if (this._trigger) {
      this._trigger._setSheet(this)
    }
    if (this._content) {
      this._content._setSheet(this)
      this._content._setIds(this._sheetId, this._titleId, this._descriptionId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "dialog")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._sheetId)
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
 * HalSheetTrigger - Element that triggers the sheet on click
 */
@customElement("hal-sheet-trigger")
export class HalSheetTrigger extends LitElement {
  private _sheet: HalSheet | null = null

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
    this.dataset.slot = "sheet-trigger"
  }

  _setSheet(sheet: HalSheet) {
    this._sheet = sheet
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = () => {
    this._sheet?._toggle()
  }

  render() {
    return html``
  }
}

/**
 * HalSheetClose - Element that closes the sheet on click
 */
@customElement("hal-sheet-close")
export class HalSheetClose extends LitElement {
  private _sheet: HalSheet | null = null

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
    this.dataset.slot = "sheet-close"
  }

  _setSheet(sheet: HalSheet) {
    this._sheet = sheet
  }

  private _handleClick = () => {
    // Find parent sheet through DOM
    const sheet = this.closest("hal-sheet") as HalSheet | null
    sheet?._close()
  }

  render() {
    return html``
  }
}

/**
 * HalSheetContent - The sheet content with overlay
 */
@customElement("hal-sheet-content")
export class HalSheetContent extends LitElement {
  @property({ type: String }) side: "top" | "right" | "bottom" | "left" =
    "right"
  @property({ type: Boolean, attribute: "show-close-button" })
  showCloseButton = true
  @property({ type: String }) class: string = ""

  private _sheet: HalSheet | null = null
  private _portal: HTMLDivElement | null = null
  private _overlayEl: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _sheetId = ""
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
    this.dataset.slot = "sheet-content"
  }

  _setSheet(sheet: HalSheet) {
    this._sheet = sheet
  }

  _setIds(sheetId: string, titleId: string, descriptionId: string) {
    this._sheetId = sheetId
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

  private _getSideClasses() {
    const base =
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500"

    switch (this.side) {
      case "left":
        return cn(
          base,
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm"
        )
      case "top":
        return cn(
          base,
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b"
        )
      case "bottom":
        return cn(
          base,
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t"
        )
      case "right":
      default:
        return cn(
          base,
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm"
        )
    }
  }

  private _showContent() {
    if (this._portal) return

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText = "position: fixed; inset: 0; z-index: 50;"

    // Create overlay
    this._overlayEl = document.createElement("div")
    this._overlayEl.dataset.slot = "sheet-overlay"
    this._overlayEl.dataset.state = "open"
    this._overlayEl.className = cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
    )
    this._overlayEl.addEventListener("click", this._handleOverlayClick)

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._sheetId
    this._contentEl.setAttribute("role", "dialog")
    this._contentEl.setAttribute("aria-labelledby", this._titleId)
    this._contentEl.setAttribute("aria-describedby", this._descriptionId)
    this._contentEl.dataset.slot = "sheet-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.className = cn(this._getSideClasses(), this.class)

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    // Add close button if enabled
    if (this.showCloseButton) {
      const closeButton = document.createElement("button")
      closeButton.dataset.slot = "sheet-close"
      closeButton.className = cn(
        "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
      )
      closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        <span class="sr-only">Close</span>
      `
      closeButton.addEventListener("click", () => this._sheet?._close())
      this._contentEl.appendChild(closeButton)
    }

    // Process title and description IDs
    const title = this._contentEl.querySelector("hal-sheet-title")
    if (title) {
      const titleEl = title.querySelector("h2") || title
      titleEl.id = this._titleId
    }

    const description = this._contentEl.querySelector("hal-sheet-description")
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
    this._sheet?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._sheet?._close()
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
 * HalSheetHeader - Header container for title and description
 */
@customElement("hal-sheet-header")
export class HalSheetHeader extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sheet-header"
    this.className = cn("flex flex-col gap-1.5 p-4", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSheetFooter - Footer container for actions
 */
@customElement("hal-sheet-footer")
export class HalSheetFooter extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sheet-footer"
    this.className = cn("mt-auto flex flex-col gap-2 p-4", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSheetTitle - Sheet title
 */
@customElement("hal-sheet-title")
export class HalSheetTitle extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sheet-title"
    this.className = cn("text-foreground font-semibold", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalSheetDescription - Sheet description
 */
@customElement("hal-sheet-description")
export class HalSheetDescription extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "sheet-description"
    this.className = cn("text-muted-foreground text-sm", this.class)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-sheet": HalSheet
    "hal-sheet-trigger": HalSheetTrigger
    "hal-sheet-close": HalSheetClose
    "hal-sheet-content": HalSheetContent
    "hal-sheet-header": HalSheetHeader
    "hal-sheet-footer": HalSheetFooter
    "hal-sheet-title": HalSheetTitle
    "hal-sheet-description": HalSheetDescription
  }
}
