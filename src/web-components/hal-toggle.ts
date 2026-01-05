import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Base classes matching React toggleVariants
const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap"

// Variant classes
const variantClasses = {
  default: "bg-transparent",
  outline:
    "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
}

// Size classes
const sizeClasses = {
  default: "h-9 px-2 min-w-9",
  sm: "h-8 px-1.5 min-w-8",
  lg: "h-10 px-2.5 min-w-10",
}

/**
 * HalToggle - a toggle button web component that mirrors shadcn/ui Toggle
 *
 * Uses light DOM so Tailwind classes apply directly.
 * A button that can be toggled on or off.
 */
@customElement("hal-toggle")
export class HalToggle extends LitElement {
  @property({ type: Boolean, reflect: true })
  pressed = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  @property({ type: String })
  variant: "default" | "outline" = "default"

  @property({ type: String })
  size: "default" | "sm" | "lg" = "default"

  @property({ type: String })
  class: string = ""

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Set up accessibility on the custom element
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button")
    }
    if (!this.hasAttribute("tabindex") && !this.disabled) {
      this.setAttribute("tabindex", "0")
    }
    // Handle interactions
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeydown)
  }

  private _handleClick = () => {
    if (this.disabled) {
      return
    }
    this._toggle()
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      if (!this.disabled) {
        e.preventDefault()
        this._toggle()
      }
    }
  }

  private _toggle() {
    this.pressed = !this.pressed
    this.dispatchEvent(
      new CustomEvent("pressed-change", {
        detail: this.pressed,
        bubbles: true,
        composed: true,
      })
    )
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    // Update tabindex and aria-disabled when disabled changes
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.setAttribute("tabindex", "-1")
        this.setAttribute("aria-disabled", "true")
      } else {
        this.setAttribute("tabindex", "0")
        this.removeAttribute("aria-disabled")
      }
    }

    // Update aria-pressed and data-state when pressed changes
    const state = this.pressed ? "on" : "off"
    this.setAttribute("aria-pressed", String(this.pressed))
    this.dataset.state = state

    // Style the toggle element itself
    this.className = cn(
      baseClasses,
      variantClasses[this.variant] || variantClasses.default,
      sizeClasses[this.size] || sizeClasses.default,
      this.disabled && "pointer-events-none opacity-50",
      this.class
    )

    // Set data-slot for styling hooks
    this.dataset.slot = "toggle"
  }

  render() {
    // Children stay in place with light DOM
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-toggle": HalToggle
  }
}
