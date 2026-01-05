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

let hoverCardId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * HalHoverCard - Root container that manages hover card state
 *
 * @fires open-change - Fired when the hover card opens or closes
 *
 * @example
 * ```html
 * <hal-hover-card>
 *   <hal-hover-card-trigger>
 *     <button>@nextjs</button>
 *   </hal-hover-card-trigger>
 *   <hal-hover-card-content>
 *     <p>The React Framework</p>
 *   </hal-hover-card-content>
 * </hal-hover-card>
 * ```
 */
@customElement("hal-hover-card")
export class HalHoverCard extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: Number, attribute: "open-delay" }) openDelay = 700
  @property({ type: Number, attribute: "close-delay" }) closeDelay = 300

  private _trigger: HalHoverCardTrigger | null = null
  private _content: HalHoverCardContent | null = null
  private _contentId = `hal-hover-card-content-${++hoverCardId}`
  private _openTimer: number | null = null
  private _closeTimer: number | null = null

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "hover-card"
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
      "hal-hover-card-trigger"
    ) as HalHoverCardTrigger | null
    this._content = this.querySelector(
      "hal-hover-card-content"
    ) as HalHoverCardContent | null

    if (this._trigger) {
      this._trigger._setHoverCard(this)
    }
    if (this._content) {
      this._content._setHoverCard(this)
      this._content._setId(this._contentId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's data-state
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("data-state", this.open ? "open" : "closed")
      }
    }
  }

  _show() {
    if (this._closeTimer) {
      window.clearTimeout(this._closeTimer)
      this._closeTimer = null
    }

    if (this._openTimer) {
      return // Already pending
    }

    if (this.openDelay > 0) {
      this._openTimer = window.setTimeout(() => {
        this._openTimer = null
        this._setOpen(true)
      }, this.openDelay)
    } else {
      this._setOpen(true)
    }
  }

  _hide() {
    if (this._openTimer) {
      window.clearTimeout(this._openTimer)
      this._openTimer = null
    }

    if (this._closeTimer) {
      return // Already pending
    }

    // Always use a timer so that hovering content can cancel the close
    // Even with 0 delay, we use setTimeout to allow the event loop to process
    // the pointerenter on content before closing
    this._closeTimer = window.setTimeout(() => {
      this._closeTimer = null
      this._setOpen(false)
    }, this.closeDelay)
  }

  _cancelClose() {
    if (this._closeTimer) {
      window.clearTimeout(this._closeTimer)
      this._closeTimer = null
    }
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

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._openTimer) {
      window.clearTimeout(this._openTimer)
      this._openTimer = null
    }
    if (this._closeTimer) {
      window.clearTimeout(this._closeTimer)
      this._closeTimer = null
    }
  }

  render() {
    return html``
  }
}

/**
 * HalHoverCardTrigger - Element that triggers the hover card on hover/focus
 */
@customElement("hal-hover-card-trigger")
export class HalHoverCardTrigger extends LitElement {
  private _hoverCard: HalHoverCard | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
    this.addEventListener("pointerenter", this._handlePointerEnter)
    this.addEventListener("pointerleave", this._handlePointerLeave)
    this.addEventListener("focus", this._handleFocus, true)
    this.addEventListener("blur", this._handleBlur, true)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("pointerenter", this._handlePointerEnter)
    this.removeEventListener("pointerleave", this._handlePointerLeave)
    this.removeEventListener("focus", this._handleFocus, true)
    this.removeEventListener("blur", this._handleBlur, true)
  }

  willUpdate() {
    this.dataset.slot = "hover-card-trigger"
  }

  _setHoverCard(hoverCard: HalHoverCard) {
    this._hoverCard = hoverCard
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handlePointerEnter = (e: PointerEvent) => {
    // Ignore touch events - hover cards shouldn't open on touch
    if (e.pointerType === "touch") return
    this._hoverCard?._show()
  }

  private _handlePointerLeave = (e: PointerEvent) => {
    // Ignore touch events
    if (e.pointerType === "touch") return
    this._hoverCard?._hide()
  }

  private _handleFocus = () => {
    this._hoverCard?._show()
  }

  private _handleBlur = () => {
    this._hoverCard?._hide()
  }

  render() {
    return html``
  }
}

/**
 * HalHoverCardContent - The floating hover card content
 */
@customElement("hal-hover-card-content")
export class HalHoverCardContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "center"
  @property({ type: Number }) sideOffset = 4
  @property({ type: String }) class: string = ""

  private _hoverCard: HalHoverCard | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _id = ""
  private _placedSide: Side = "bottom"

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "hover-card-content"
  }

  _setHoverCard(hoverCard: HalHoverCard) {
    this._hoverCard = hoverCard
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
    this._contentEl.dataset.slot = "hover-card-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
      this.class
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    // Add event listeners to keep open when hovering content
    this._contentEl.addEventListener("pointerenter", this._handlePointerEnter)
    this._contentEl.addEventListener("pointerleave", this._handlePointerLeave)

    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    const trigger = this._hoverCard?._getTrigger()?._getTriggerElement()
    if (trigger && this._contentEl) {
      this._cleanup = autoUpdate(trigger, this._contentEl, () => {
        this._updatePosition(trigger)
      })
    }
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

  private _handlePointerEnter = () => {
    // Cancel any pending close when entering content
    this._hoverCard?._cancelClose()
  }

  private _handlePointerLeave = () => {
    // Start close timer when leaving content
    this._hoverCard?._hide()
  }

  private _hideContent() {
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }

    if (this._contentEl) {
      this._contentEl.removeEventListener(
        "pointerenter",
        this._handlePointerEnter
      )
      this._contentEl.removeEventListener(
        "pointerleave",
        this._handlePointerLeave
      )
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
    "hal-hover-card": HalHoverCard
    "hal-hover-card-trigger": HalHoverCardTrigger
    "hal-hover-card-content": HalHoverCardContent
  }
}
