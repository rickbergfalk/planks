import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let alertDialogId = 0

/**
 * HalAlertDialog - Root container that manages alert dialog state
 *
 * Unlike regular dialog, alert dialog:
 * - Uses role="alertdialog" for screen readers
 * - Cannot be dismissed by clicking outside
 * - Does not have a default close button
 * - Requires explicit Action or Cancel to close
 *
 * @fires open-change - Fired when the alert dialog opens or closes
 *
 * @example
 * ```html
 * <hal-alert-dialog>
 *   <hal-alert-dialog-trigger>
 *     <button>Delete</button>
 *   </hal-alert-dialog-trigger>
 *   <hal-alert-dialog-content>
 *     <hal-alert-dialog-title>Are you sure?</hal-alert-dialog-title>
 *     <hal-alert-dialog-description>This cannot be undone.</hal-alert-dialog-description>
 *     <hal-alert-dialog-footer>
 *       <hal-alert-dialog-cancel>Cancel</hal-alert-dialog-cancel>
 *       <hal-alert-dialog-action>Continue</hal-alert-dialog-action>
 *     </hal-alert-dialog-footer>
 *   </hal-alert-dialog-content>
 * </hal-alert-dialog>
 * ```
 */
@customElement("hal-alert-dialog")
export class HalAlertDialog extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: HalAlertDialogTrigger | null = null
  private _content: HalAlertDialogContent | null = null
  private _alertDialogId = `hal-alert-dialog-${++alertDialogId}`
  private _titleId = `${this._alertDialogId}-title`
  private _descriptionId = `${this._alertDialogId}-description`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog"
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
      "hal-alert-dialog-trigger"
    ) as HalAlertDialogTrigger | null
    this._content = this.querySelector(
      "hal-alert-dialog-content"
    ) as HalAlertDialogContent | null

    if (this._trigger) {
      this._trigger._setAlertDialog(this)
    }
    if (this._content) {
      this._content._setAlertDialog(this)
      this._content._setIds(
        this._alertDialogId,
        this._titleId,
        this._descriptionId
      )
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "dialog")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._alertDialogId)
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
 * HalAlertDialogTrigger - Element that triggers the alert dialog on click
 */
@customElement("hal-alert-dialog-trigger")
export class HalAlertDialogTrigger extends LitElement {
  private _alertDialog: HalAlertDialog | null = null

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
    this.dataset.slot = "alert-dialog-trigger"
  }

  _setAlertDialog(alertDialog: HalAlertDialog) {
    this._alertDialog = alertDialog
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = () => {
    this._alertDialog?._toggle()
  }

  render() {
    return html``
  }
}

/**
 * HalAlertDialogContent - The alert dialog content with overlay
 *
 * Unlike regular dialog, clicking the overlay does NOT close the alert dialog.
 */
@customElement("hal-alert-dialog-content")
export class HalAlertDialogContent extends LitElement {
  @property({ type: String }) class: string = ""

  private _alertDialog: HalAlertDialog | null = null
  private _portal: HTMLDivElement | null = null
  private _overlayEl: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _alertDialogId = ""
  private _titleId = ""
  private _descriptionId = ""
  private _boundHandleEscape: ((e: KeyboardEvent) => void) | null = null
  private _originalChildren: ChildNode[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-content"
  }

  _setAlertDialog(alertDialog: HalAlertDialog) {
    this._alertDialog = alertDialog
  }

  _setIds(alertDialogId: string, titleId: string, descriptionId: string) {
    this._alertDialogId = alertDialogId
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
    this._portal.dataset.slot = "alert-dialog-portal"
    this._portal.style.cssText = "position: fixed; inset: 0; z-index: 50;"

    // Create overlay - does NOT close on click for alert dialog
    this._overlayEl = document.createElement("div")
    this._overlayEl.dataset.slot = "alert-dialog-overlay"
    this._overlayEl.dataset.state = "open"
    this._overlayEl.className = cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
    )
    // Note: No click handler on overlay - alert dialog cannot be dismissed by clicking outside

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._alertDialogId
    this._contentEl.setAttribute("role", "alertdialog")
    this._contentEl.setAttribute("aria-labelledby", this._titleId)
    this._contentEl.setAttribute("aria-describedby", this._descriptionId)
    this._contentEl.dataset.slot = "alert-dialog-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.className = cn(
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      this.class
    )

    // Move children to content element (preserves custom element state)
    // Store original children so we can move them back
    this._originalChildren = Array.from(this.childNodes)
    this._originalChildren.forEach((child) => {
      this._contentEl!.appendChild(child)
    })

    // Process title and description IDs
    const title = this._contentEl.querySelector("hal-alert-dialog-title")
    if (title) {
      title.id = this._titleId
    }

    const description = this._contentEl.querySelector(
      "hal-alert-dialog-description"
    )
    if (description) {
      description.id = this._descriptionId
    }

    this._portal.appendChild(this._overlayEl)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Wire up Action and Cancel buttons to close the dialog
    // Add direct click listeners to moved elements
    const closeHandler = () => this._alertDialog?._close()
    this._contentEl
      .querySelectorAll("hal-alert-dialog-action")
      .forEach((el) => el.addEventListener("click", closeHandler))

    // Find cancel button - it should receive initial focus per Radix behavior
    const cancelButtons = this._contentEl.querySelectorAll(
      "hal-alert-dialog-cancel"
    )
    cancelButtons.forEach((el) => el.addEventListener("click", closeHandler))

    // Focus the Cancel button (or Action if no Cancel) for accessibility
    const cancelButton = cancelButtons[0] as HTMLElement | undefined
    const actionButton = this._contentEl.querySelector(
      "hal-alert-dialog-action"
    ) as HTMLElement | null
    const focusTarget = cancelButton || actionButton
    if (focusTarget) {
      focusTarget.focus()
    }

    // Set up escape key handler
    this._boundHandleEscape = this._handleEscape.bind(this)
    document.addEventListener("keydown", this._boundHandleEscape)
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._alertDialog?._close()
    }
  }

  private _hideContent() {
    if (this._boundHandleEscape) {
      document.removeEventListener("keydown", this._boundHandleEscape)
      this._boundHandleEscape = null
    }

    // Move children back to original parent before removing portal
    if (this._originalChildren.length > 0) {
      this._originalChildren.forEach((child) => {
        this.appendChild(child)
      })
      this._originalChildren = []
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
 * HalAlertDialogHeader - Header container for title and description
 */
@customElement("hal-alert-dialog-header")
export class HalAlertDialogHeader extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-header"
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
 * HalAlertDialogFooter - Footer container for actions
 */
@customElement("hal-alert-dialog-footer")
export class HalAlertDialogFooter extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-footer"
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
 * HalAlertDialogTitle - Alert dialog title
 */
@customElement("hal-alert-dialog-title")
export class HalAlertDialogTitle extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-title"
    this.className = cn("text-lg font-semibold", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalAlertDialogDescription - Alert dialog description
 */
@customElement("hal-alert-dialog-description")
export class HalAlertDialogDescription extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-description"
    this.className = cn("text-muted-foreground text-sm", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalAlertDialogAction - Confirm/action button that closes the dialog
 *
 * Has primary button styling by default.
 */
@customElement("hal-alert-dialog-action")
export class HalAlertDialogAction extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "button")
    this.setAttribute("tabindex", "0")
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("keydown", this._handleKeydown)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      this.click()
    }
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-action"
    // Primary button styling (from buttonVariants default) - exact match to React
    this.className = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalAlertDialogCancel - Cancel button that closes the dialog
 *
 * Has outline button styling by default.
 */
@customElement("hal-alert-dialog-cancel")
export class HalAlertDialogCancel extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "button")
    this.setAttribute("tabindex", "0")
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("keydown", this._handleKeydown)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      this.click()
    }
  }

  willUpdate() {
    this.dataset.slot = "alert-dialog-cancel"
    // Outline button styling (from buttonVariants({ variant: "outline" })) - exact match to React
    this.className = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-alert-dialog": HalAlertDialog
    "hal-alert-dialog-trigger": HalAlertDialogTrigger
    "hal-alert-dialog-content": HalAlertDialogContent
    "hal-alert-dialog-header": HalAlertDialogHeader
    "hal-alert-dialog-footer": HalAlertDialogFooter
    "hal-alert-dialog-title": HalAlertDialogTitle
    "hal-alert-dialog-description": HalAlertDialogDescription
    "hal-alert-dialog-action": HalAlertDialogAction
    "hal-alert-dialog-cancel": HalAlertDialogCancel
  }
}
