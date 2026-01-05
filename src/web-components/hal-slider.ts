import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalSlider - A slider component for selecting values within a range
 *
 * @fires value-change - Fired when the value changes, with detail: { value: number }
 *
 * @example
 * ```html
 * <hal-slider value="50" min="0" max="100"></hal-slider>
 * ```
 */
@customElement("hal-slider")
export class HalSlider extends LitElement {
  @property({ type: Number, reflect: true }) value = 0
  @property({ type: Number }) min = 0
  @property({ type: Number }) max = 100
  @property({ type: Number }) step = 1
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String, reflect: true }) orientation:
    | "horizontal"
    | "vertical" = "horizontal"
  @property({ type: String }) class: string = ""
  @property({ type: String, attribute: "aria-label" }) ariaLabel: string = ""

  @state() private _isDragging = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "slider"
    this.setAttribute("data-orientation", this.orientation)
    if (this.disabled) {
      this.setAttribute("data-disabled", "")
    } else {
      this.removeAttribute("data-disabled")
    }

    this.className = cn(
      "relative flex w-full touch-none items-center select-none",
      this.disabled && "opacity-50",
      this.orientation === "vertical" && "h-full min-h-44 w-auto flex-col",
      this.class
    )
  }

  private _getPercentage(): number {
    return ((this.value - this.min) / (this.max - this.min)) * 100
  }

  private _setValue(newValue: number) {
    // Clamp to min/max
    newValue = Math.max(this.min, Math.min(this.max, newValue))
    // Snap to step
    newValue =
      Math.round((newValue - this.min) / this.step) * this.step + this.min
    // Clamp again after step rounding
    newValue = Math.max(this.min, Math.min(this.max, newValue))

    if (newValue !== this.value) {
      this.value = newValue
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value: this.value },
          bubbles: true,
        })
      )
    }
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return

    let newValue = this.value

    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault()
        newValue = this.value + this.step
        break
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault()
        newValue = this.value - this.step
        break
      case "Home":
        e.preventDefault()
        newValue = this.min
        break
      case "End":
        e.preventDefault()
        newValue = this.max
        break
      case "PageUp":
        e.preventDefault()
        newValue = this.value + this.step * 10
        break
      case "PageDown":
        e.preventDefault()
        newValue = this.value - this.step * 10
        break
      default:
        return
    }

    this._setValue(newValue)
  }

  private _handlePointerDown = (e: PointerEvent) => {
    if (this.disabled) return

    this._isDragging = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    this._updateValueFromPointer(e)
  }

  private _handlePointerMove = (e: PointerEvent) => {
    if (!this._isDragging || this.disabled) return
    this._updateValueFromPointer(e)
  }

  private _handlePointerUp = (e: PointerEvent) => {
    if (!this._isDragging) return
    this._isDragging = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  private _updateValueFromPointer(e: PointerEvent) {
    const track = this.querySelector(
      '[data-slot="slider-track"]'
    ) as HTMLElement
    if (!track) return

    const rect = track.getBoundingClientRect()
    let percentage: number

    if (this.orientation === "vertical") {
      percentage = 1 - (e.clientY - rect.top) / rect.height
    } else {
      percentage = (e.clientX - rect.left) / rect.width
    }

    percentage = Math.max(0, Math.min(1, percentage))
    const newValue = this.min + percentage * (this.max - this.min)
    this._setValue(newValue)
  }

  private _handleTrackClick = (e: MouseEvent) => {
    if (this.disabled) return

    const track = e.currentTarget as HTMLElement
    const rect = track.getBoundingClientRect()
    let percentage: number

    if (this.orientation === "vertical") {
      percentage = 1 - (e.clientY - rect.top) / rect.height
    } else {
      percentage = (e.clientX - rect.left) / rect.width
    }

    percentage = Math.max(0, Math.min(1, percentage))
    const newValue = this.min + percentage * (this.max - this.min)
    this._setValue(newValue)

    // Focus the thumb after click
    const thumb = this.querySelector(
      '[data-slot="slider-thumb"]'
    ) as HTMLElement
    thumb?.focus()
  }

  // Keyboard handler for track - delegates to thumb
  private _handleTrackKeydown = (e: KeyboardEvent) => {
    // Focus the thumb and let it handle keyboard events
    const thumb = this.querySelector(
      '[data-slot="slider-thumb"]'
    ) as HTMLElement
    if (thumb) {
      thumb.focus()
      this._handleKeydown(e)
    }
  }

  render() {
    const percentage = this._getPercentage()
    const isHorizontal = this.orientation === "horizontal"

    const trackClasses = cn(
      "bg-muted relative grow overflow-hidden rounded-full cursor-pointer",
      isHorizontal ? "h-1.5 w-full" : "h-full w-1.5"
    )

    const rangeClasses = cn(
      "bg-primary absolute pointer-events-none",
      isHorizontal ? "h-full" : "w-full bottom-0"
    )

    const rangeStyle = isHorizontal
      ? `width: ${percentage}%`
      : `height: ${percentage}%`

    const thumbClasses = cn(
      "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden absolute",
      this.disabled && "pointer-events-none"
    )

    // Radix uses getThumbInBoundsOffset() to keep thumb within track bounds
    // Formula: halfThumbSize * (1 - percentage/50)
    // At 0%: +8px, At 50%: 0px, At 100%: -8px
    const halfThumbSize = 8 // size-4 = 16px / 2
    const thumbInBoundsOffset = halfThumbSize * (1 - percentage / 50)

    const thumbStyle = isHorizontal
      ? `left: calc(${percentage}% + ${thumbInBoundsOffset}px); top: 50%; transform: translate(-50%, -50%)`
      : `bottom: calc(${percentage}% + ${thumbInBoundsOffset}px); left: 50%; transform: translate(-50%, 50%)`

    return html`
      <div
        data-slot="slider-track"
        class=${trackClasses}
        @click=${this._handleTrackClick}
        @keydown=${this._handleTrackKeydown}
      >
        <div
          data-slot="slider-range"
          class=${rangeClasses}
          style=${rangeStyle}
        ></div>
      </div>
      <div
        data-slot="slider-thumb"
        class=${thumbClasses}
        style=${thumbStyle}
        role="slider"
        tabindex=${this.disabled ? "-1" : "0"}
        aria-label=${this.ariaLabel || "Slider"}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-orientation=${this.orientation === "vertical" ? "vertical" : null}
        aria-disabled=${this.disabled ? "true" : null}
        @keydown=${this._handleKeydown}
        @pointerdown=${this._handlePointerDown}
        @pointermove=${this._handlePointerMove}
        @pointerup=${this._handlePointerUp}
      ></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-slider": HalSlider
  }
}
