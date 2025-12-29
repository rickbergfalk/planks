import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let tooltipId = 0

type Side = "top" | "right" | "bottom" | "left"

/**
 * PlankTooltip - Root container that manages tooltip state
 *
 * @fires open-change - Fired when the tooltip opens or closes
 *
 * @example
 * ```html
 * <plank-tooltip>
 *   <plank-tooltip-trigger>
 *     <button>Hover me</button>
 *   </plank-tooltip-trigger>
 *   <plank-tooltip-content>Tooltip text</plank-tooltip-content>
 * </plank-tooltip>
 * ```
 */
@customElement("plank-tooltip")
export class PlankTooltip extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: Number }) delayDuration = 0

  private _trigger: PlankTooltipTrigger | null = null
  private _content: PlankTooltipContent | null = null
  private _contentId = `plank-tooltip-content-${++tooltipId}`
  private _openTimer: number | null = null

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "tooltip"
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
      "plank-tooltip-trigger"
    ) as PlankTooltipTrigger | null
    this._content = this.querySelector(
      "plank-tooltip-content"
    ) as PlankTooltipContent | null

    if (this._trigger) {
      this._trigger._setTooltip(this)
    }
    if (this._content) {
      this._content._setTooltip(this)
      this._content._setId(this._contentId)
      // Notify content of open state change
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria-describedby
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        if (this.open) {
          triggerEl.setAttribute("aria-describedby", this._contentId)
        } else {
          triggerEl.removeAttribute("aria-describedby")
        }
      }
    }
  }

  _show() {
    if (this._openTimer) {
      window.clearTimeout(this._openTimer)
      this._openTimer = null
    }

    if (this.delayDuration > 0) {
      this._openTimer = window.setTimeout(() => {
        this._setOpen(true)
      }, this.delayDuration)
    } else {
      this._setOpen(true)
    }
  }

  _hide() {
    if (this._openTimer) {
      window.clearTimeout(this._openTimer)
      this._openTimer = null
    }
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
 * PlankTooltipTrigger - Element that triggers the tooltip on hover/focus
 */
@customElement("plank-tooltip-trigger")
export class PlankTooltipTrigger extends LitElement {
  private _tooltip: PlankTooltip | null = null

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
    this.dataset.slot = "tooltip-trigger"
  }

  _setTooltip(tooltip: PlankTooltip) {
    this._tooltip = tooltip
  }

  _getTriggerElement(): HTMLElement | null {
    // Find the first focusable child element (the actual trigger)
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handlePointerEnter = () => {
    this._tooltip?._show()
  }

  private _handlePointerLeave = () => {
    this._tooltip?._hide()
  }

  private _handleFocus = () => {
    this._tooltip?._show()
  }

  private _handleBlur = () => {
    this._tooltip?._hide()
  }

  render() {
    return html``
  }
}

/**
 * PlankTooltipContent - The floating tooltip content
 */
@customElement("plank-tooltip-content")
export class PlankTooltipContent extends LitElement {
  @property({ type: String }) side: Side = "top"
  @property({ type: Number }) sideOffset = 0

  private _tooltip: PlankTooltip | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _arrowEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _id = ""
  private _placedSide: Side = "top"

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Hide the source element - content is rendered via portal
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "tooltip-content"
  }

  _setTooltip(tooltip: PlankTooltip) {
    this._tooltip = tooltip
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
    if (this._portal) return // Already showing

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._id
    this._contentEl.setAttribute("role", "tooltip")
    this._contentEl.dataset.slot = "tooltip-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance"
    )
    this._contentEl.style.cssText =
      "position: absolute; top: 0; left: 0; width: max-content;"
    // Transform origin will be set during positioning

    // Copy children to content element
    const children = Array.from(this.childNodes)
    children.forEach((child) => {
      this._contentEl!.appendChild(child.cloneNode(true))
    })

    // Create arrow element - matches shadcn's TooltipPrimitive.Arrow styling
    this._arrowEl = document.createElement("div")
    this._arrowEl.className = cn(
      "bg-foreground fill-foreground z-50 size-2.5 rounded-[2px] absolute"
    )
    // Initial transform - will be updated based on placed side
    this._arrowEl.style.transform = "rotate(45deg)"

    this._contentEl.appendChild(this._arrowEl)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    const trigger = this._tooltip?._getTrigger()?._getTriggerElement()
    if (trigger && this._contentEl) {
      this._cleanup = autoUpdate(trigger, this._contentEl, () => {
        this._updatePosition(trigger)
      })
    }
  }

  private async _updatePosition(trigger: HTMLElement) {
    // Early return if elements were cleaned up during async operation
    if (!this._contentEl || !this._arrowEl) return

    const contentEl = this._contentEl
    const arrowEl = this._arrowEl

    const { x, y, placement, middlewareData } = await computePosition(
      trigger,
      contentEl,
      {
        placement: this.side,
        middleware: [
          offset(this.sideOffset + 10), // 10 for arrow height
          flip(),
          shift({ padding: 5 }),
          arrow({ element: arrowEl }),
        ],
      }
    )

    // Check again after async operation in case cleanup happened
    if (!this._contentEl || !this._arrowEl) return

    // Update placed side from actual placement
    this._placedSide = placement.split("-")[0] as Side
    this._contentEl.dataset.side = this._placedSide

    Object.assign(this._contentEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    })

    // Position arrow based on placement side
    const { x: arrowX, y: arrowY } = middlewareData.arrow || {}
    const staticSide = {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[this._placedSide]

    // Arrow size is 10px (size-2.5 = 0.625rem = 10px)
    // Position arrow so it protrudes from the tooltip like Radix
    // The arrow is a rotated square, so we need to offset by half the diagonal
    const arrowHalfDiagonal = Math.round((10 * Math.SQRT2) / 2) // ~7px

    Object.assign(this._arrowEl.style, {
      left: arrowX != null ? `${arrowX}px` : "",
      top: arrowY != null ? `${arrowY}px` : "",
      right: "",
      bottom: "",
      [staticSide!]: `${-arrowHalfDiagonal + 2}px`, // +2 for slight overlap with tooltip
      transform: "rotate(45deg)",
    })
  }

  private _hideContent() {
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }
    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._contentEl = null
      this._arrowEl = null
    }
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-tooltip": PlankTooltip
    "plank-tooltip-trigger": PlankTooltipTrigger
    "plank-tooltip-content": PlankTooltipContent
  }
}
