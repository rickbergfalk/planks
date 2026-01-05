import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
} from "@floating-ui/dom"
import type { Placement } from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let popoverId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * HalPopover - Root container that manages popover state
 *
 * @fires open-change - Fired when the popover opens or closes
 *
 * @example
 * ```html
 * <hal-popover>
 *   <hal-popover-trigger>
 *     <button>Open</button>
 *   </hal-popover-trigger>
 *   <hal-popover-content>Content</hal-popover-content>
 * </hal-popover>
 * ```
 */
@customElement("hal-popover")
export class HalPopover extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: HalPopoverTrigger | null = null
  private _content: HalPopoverContent | null = null
  private _contentId = `hal-popover-content-${++popoverId}`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "popover"
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
      "hal-popover-trigger"
    ) as HalPopoverTrigger | null
    this._content = this.querySelector(
      "hal-popover-content"
    ) as HalPopoverContent | null

    if (this._trigger) {
      this._trigger._setPopover(this)
    }
    if (this._content) {
      this._content._setPopover(this)
      this._content._setId(this._contentId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "dialog")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._contentId)
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

  _getContentId() {
    return this._contentId
  }

  render() {
    return html``
  }
}

/**
 * HalPopoverTrigger - Element that triggers the popover on click
 */
@customElement("hal-popover-trigger")
export class HalPopoverTrigger extends LitElement {
  private _popover: HalPopover | null = null

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
    this.dataset.slot = "popover-trigger"
  }

  _setPopover(popover: HalPopover) {
    this._popover = popover
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = (e: Event) => {
    // Prevent the click from propagating to the document click handler
    e.stopPropagation()
    this._popover?._toggle()
  }

  render() {
    return html``
  }
}

/**
 * HalPopoverContent - The floating popover content
 */
@customElement("hal-popover-content")
export class HalPopoverContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "center"
  @property({ type: Number }) sideOffset = 4
  @property({ type: String }) class: string = ""

  private _popover: HalPopover | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _id = ""
  private _placedSide: Side = "bottom"
  private _boundHandleOutsideClick: ((e: MouseEvent) => void) | null = null
  private _boundHandleEscape: ((e: KeyboardEvent) => void) | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "popover-content"
  }

  _setPopover(popover: HalPopover) {
    this._popover = popover
  }

  _setId(id: string) {
    this._id = id
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
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._id
    this._contentEl.setAttribute("role", "dialog")
    this._contentEl.dataset.slot = "popover-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
      this.class
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    const trigger = this._popover?._getTrigger()?._getTriggerElement()
    if (trigger && this._contentEl) {
      this._cleanup = autoUpdate(trigger, this._contentEl, () => {
        this._updatePosition(trigger)
      })
    }

    // Set up outside click handler
    this._boundHandleOutsideClick = this._handleOutsideClick.bind(this)
    // Use setTimeout to prevent the opening click from triggering close
    setTimeout(() => {
      document.addEventListener("click", this._boundHandleOutsideClick!)
    }, 0)

    // Set up escape key handler
    this._boundHandleEscape = this._handleEscape.bind(this)
    document.addEventListener("keydown", this._boundHandleEscape)
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side
    }
    return `${this.side}-${this.align}` as Placement
  }

  private async _updatePosition(trigger: HTMLElement) {
    if (!this._contentEl) return

    const { x, y, placement } = await computePosition(
      trigger,
      this._contentEl,
      {
        strategy: "fixed",
        placement: this._getPlacement(),
        middleware: [
          // Match Radix middleware order: offset → shift → flip
          offset({ mainAxis: this.sideOffset, alignmentAxis: 0 }),
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: limitShift(),
            padding: 0,
          }),
          flip(),
        ],
      }
    )

    if (!this._contentEl) return

    this._placedSide = placement.split("-")[0] as Side
    this._contentEl.dataset.side = this._placedSide

    Object.assign(this._contentEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  private _handleOutsideClick(e: MouseEvent) {
    const target = e.target as HTMLElement

    // Don't close if clicking inside the content
    if (this._contentEl?.contains(target)) {
      return
    }

    // Don't close if clicking the trigger (it has its own toggle)
    const triggerEl = this._popover?._getTrigger()?._getTriggerElement()
    if (triggerEl?.contains(target)) {
      return
    }

    this._popover?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._popover?._close()
    }
  }

  private _hideContent() {
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }

    if (this._boundHandleOutsideClick) {
      document.removeEventListener("click", this._boundHandleOutsideClick)
      this._boundHandleOutsideClick = null
    }

    if (this._boundHandleEscape) {
      document.removeEventListener("keydown", this._boundHandleEscape)
      this._boundHandleEscape = null
    }

    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._contentEl = null
    }
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-popover": HalPopover
    "hal-popover-trigger": HalPopoverTrigger
    "hal-popover-content": HalPopoverContent
  }
}
