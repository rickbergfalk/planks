import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let dialogId = 0

/**
 * PlankDialog - Root container that manages dialog state
 *
 * @fires open-change - Fired when the dialog opens or closes
 *
 * @example
 * ```html
 * <plank-dialog>
 *   <plank-dialog-trigger>
 *     <button>Open</button>
 *   </plank-dialog-trigger>
 *   <plank-dialog-content>
 *     <plank-dialog-title>Title</plank-dialog-title>
 *     Content
 *   </plank-dialog-content>
 * </plank-dialog>
 * ```
 */
@customElement("plank-dialog")
export class PlankDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: PlankDialogTrigger | null = null
  private _content: PlankDialogContent | null = null
  private _dialogId = `plank-dialog-${++dialogId}`
  private _titleId = `${this._dialogId}-title`
  private _descriptionId = `${this._dialogId}-description`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dialog"
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
      "plank-dialog-trigger"
    ) as PlankDialogTrigger | null
    this._content = this.querySelector(
      "plank-dialog-content"
    ) as PlankDialogContent | null

    if (this._trigger) {
      this._trigger._setDialog(this)
    }
    if (this._content) {
      this._content._setDialog(this)
      this._content._setIds(this._dialogId, this._titleId, this._descriptionId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "dialog")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._dialogId)
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
 * PlankDialogTrigger - Element that triggers the dialog on click
 */
@customElement("plank-dialog-trigger")
export class PlankDialogTrigger extends LitElement {
  private _dialog: PlankDialog | null = null

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
    this.dataset.slot = "dialog-trigger"
  }

  _setDialog(dialog: PlankDialog) {
    this._dialog = dialog
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = () => {
    this._dialog?._toggle()
  }

  render() {
    return html``
  }
}

/**
 * PlankDialogContent - The dialog content with overlay
 */
@customElement("plank-dialog-content")
export class PlankDialogContent extends LitElement {
  @property({ type: Boolean, attribute: "show-close-button" })
  showCloseButton = true
  @property({ type: String }) class: string = ""

  private _dialog: PlankDialog | null = null
  private _portal: HTMLDivElement | null = null
  private _overlayEl: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _dialogId = ""
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
    this.dataset.slot = "dialog-content"
  }

  _setDialog(dialog: PlankDialog) {
    this._dialog = dialog
  }

  _setIds(dialogId: string, titleId: string, descriptionId: string) {
    this._dialogId = dialogId
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

  private _showContent() {
    if (this._portal) return

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText = "position: fixed; inset: 0; z-index: 50;"

    // Create overlay
    this._overlayEl = document.createElement("div")
    this._overlayEl.dataset.slot = "dialog-overlay"
    this._overlayEl.dataset.state = "open"
    this._overlayEl.className = cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
    )
    this._overlayEl.addEventListener("click", this._handleOverlayClick)

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._dialogId
    this._contentEl.setAttribute("role", "dialog")
    this._contentEl.setAttribute("aria-labelledby", this._titleId)
    this._contentEl.setAttribute("aria-describedby", this._descriptionId)
    this._contentEl.dataset.slot = "dialog-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.className = cn(
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
      this.class
    )

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    // Add close button if enabled
    if (this.showCloseButton) {
      const closeButton = document.createElement("button")
      closeButton.dataset.slot = "dialog-close"
      closeButton.className = cn(
        "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      )
      closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        <span class="sr-only">Close</span>
      `
      closeButton.addEventListener("click", () => this._dialog?._close())
      this._contentEl.appendChild(closeButton)
    }

    // Process title and description IDs
    const title = this._contentEl.querySelector("plank-dialog-title")
    if (title) {
      const titleEl = title.querySelector("h2") || title
      titleEl.id = this._titleId
    }

    const description = this._contentEl.querySelector(
      "plank-dialog-description"
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
    this._dialog?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._dialog?._close()
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
 * PlankDialogHeader - Header container for title and description
 */
@customElement("plank-dialog-header")
export class PlankDialogHeader extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dialog-header"
    this.className = cn(
      "flex flex-col gap-2 text-center sm:text-left",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankDialogFooter - Footer container for actions
 */
@customElement("plank-dialog-footer")
export class PlankDialogFooter extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dialog-footer"
    this.className = cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankDialogTitle - Dialog title
 */
@customElement("plank-dialog-title")
export class PlankDialogTitle extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dialog-title"
    this.className = cn("text-lg leading-none font-semibold", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankDialogDescription - Dialog description
 */
@customElement("plank-dialog-description")
export class PlankDialogDescription extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dialog-description"
    this.className = cn("text-muted-foreground text-sm", this.class)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-dialog": PlankDialog
    "plank-dialog-trigger": PlankDialogTrigger
    "plank-dialog-content": PlankDialogContent
    "plank-dialog-header": PlankDialogHeader
    "plank-dialog-footer": PlankDialogFooter
    "plank-dialog-title": PlankDialogTitle
    "plank-dialog-description": PlankDialogDescription
  }
}
