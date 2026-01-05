import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let collapsibleContentId = 0

/**
 * HalCollapsible - Container component that manages open/closed state
 *
 * @fires open-change - Fired when the open state changes, with detail: { open: boolean }
 *
 * @example
 * ```html
 * <hal-collapsible>
 *   <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
 *   <hal-collapsible-content>Hidden content</hal-collapsible-content>
 * </hal-collapsible>
 * ```
 */
@customElement("hal-collapsible")
export class HalCollapsible extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "collapsible"
    this.dataset.state = this.open ? "open" : "closed"
    if (this.class) {
      this.className = cn(this.class)
    }
  }

  updated() {
    // Update child components when state changes
    this._updateChildren()
  }

  private _updateChildren() {
    const trigger = this.querySelector(
      "hal-collapsible-trigger"
    ) as HalCollapsibleTrigger | null
    const content = this.querySelector(
      "hal-collapsible-content"
    ) as HalCollapsibleContent | null

    if (trigger) {
      trigger._setOpen(this.open)
      if (content) {
        trigger._setContentId(content.id)
      }
    }
    if (content) {
      content._setOpen(this.open)
    }
  }

  toggle() {
    if (this.disabled) return
    this.open = !this.open
    this.dispatchEvent(
      new CustomEvent("open-change", {
        detail: { open: this.open },
        bubbles: true,
      })
    )
  }

  render() {
    return html``
  }
}

/**
 * HalCollapsibleTrigger - Button that toggles the collapsible
 */
@customElement("hal-collapsible-trigger")
export class HalCollapsibleTrigger extends LitElement {
  private _open = false
  private _contentId = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeydown)
  }

  willUpdate() {
    this.dataset.slot = "collapsible-trigger"
    this.setAttribute("role", "button")
    this.setAttribute("tabindex", "0")
    this.setAttribute("aria-expanded", String(this._open))
    if (this._contentId) {
      this.setAttribute("aria-controls", this._contentId)
    }
  }

  _setOpen(open: boolean) {
    this._open = open
    this.requestUpdate()
  }

  _setContentId(id: string) {
    this._contentId = id
    this.requestUpdate()
  }

  private _handleClick = () => {
    const collapsible = this.closest("hal-collapsible") as HalCollapsible
    collapsible?.toggle()
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const collapsible = this.closest("hal-collapsible") as HalCollapsible
      collapsible?.toggle()
    }
  }

  render() {
    return html``
  }
}

/**
 * HalCollapsibleContent - Content that is shown/hidden
 */
@customElement("hal-collapsible-content")
export class HalCollapsibleContent extends LitElement {
  @property({ type: String }) class: string = ""
  private _open = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Assign unique ID if not present
    if (!this.id) {
      this.id = `hal-collapsible-content-${++collapsibleContentId}`
    }
  }

  willUpdate() {
    this.dataset.slot = "collapsible-content"
    this.dataset.state = this._open ? "open" : "closed"
    if (this._open) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
    if (this.class) {
      this.className = cn(this.class)
    }
  }

  _setOpen(open: boolean) {
    this._open = open
    this.requestUpdate()
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-collapsible": HalCollapsible
    "hal-collapsible-trigger": HalCollapsibleTrigger
    "hal-collapsible-content": HalCollapsibleContent
  }
}
