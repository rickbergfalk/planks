import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Base classes matching React toggleVariants
const baseClasses =
  "inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap"

// Variant classes
const variantClasses = {
  default: "bg-transparent",
  outline:
    "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
}

// Size classes - px-3 is applied via toggle-group-item additional class
const sizeClasses = {
  default: "h-9 min-w-9",
  sm: "h-8 min-w-8",
  lg: "h-10 min-w-10",
}

/**
 * PlankToggleGroup - Container component that manages toggle group selection state
 *
 * @fires value-change - Fired when the value changes, with detail: { value: string }
 *
 * @example
 * ```html
 * <plank-toggle-group type="multiple" value="bold,italic">
 *   <plank-toggle-group-item value="bold">B</plank-toggle-group-item>
 *   <plank-toggle-group-item value="italic">I</plank-toggle-group-item>
 * </plank-toggle-group>
 * ```
 */
@customElement("plank-toggle-group")
export class PlankToggleGroup extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String, reflect: true }) type: "single" | "multiple" =
    "multiple"
  @property({ type: String }) variant: "default" | "outline" = "default"
  @property({ type: String }) size: "default" | "sm" | "lg" = "default"
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "toggle-group"
    this.dataset.variant = this.variant
    this.dataset.size = this.size
    this.setAttribute("role", "group")
    this.className = cn(
      "flex w-fit items-center rounded-md",
      this.variant === "outline" && "shadow-xs",
      this.class
    )
  }

  updated() {
    this._updateChildren()
  }

  private _getSelectedValues(): string[] {
    if (!this.value) return []
    return this.value.split(",").filter(Boolean)
  }

  private _updateChildren() {
    const items = this.querySelectorAll("plank-toggle-group-item")
    const itemsArray = Array.from(items) as PlankToggleGroupItem[]
    const selectedValues = this._getSelectedValues()

    itemsArray.forEach((item, index) => {
      const isSelected = selectedValues.includes(item.value)
      const isFirst = index === 0
      const isLast = index === itemsArray.length - 1

      item._setSelected(isSelected)
      item._setVariant(this.variant)
      item._setSize(this.size)
      item._setPosition(isFirst, isLast)
      item._setGroupDisabled(this.disabled)
    })
  }

  _toggleItem(itemValue: string) {
    if (this.disabled) return

    const selectedValues = this._getSelectedValues()

    if (this.type === "single") {
      // Single mode: toggle off if same value, otherwise select new
      if (selectedValues.includes(itemValue)) {
        this.value = ""
      } else {
        this.value = itemValue
      }
    } else {
      // Multiple mode: toggle individual item
      if (selectedValues.includes(itemValue)) {
        this.value = selectedValues.filter((v) => v !== itemValue).join(",")
      } else {
        this.value = [...selectedValues, itemValue].join(",")
      }
    }

    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: { value: this.value },
        bubbles: true,
      })
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankToggleGroupItem - Individual toggle button within a group
 */
@customElement("plank-toggle-group-item")
export class PlankToggleGroupItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  private _selected = false
  private _variant: "default" | "outline" = "default"
  private _size: "default" | "sm" | "lg" = "default"
  private _isFirst = false
  private _isLast = false
  private _groupDisabled = false

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
    const isDisabled = this.disabled || this._groupDisabled

    this.dataset.slot = "toggle-group-item"
    this.dataset.state = this._selected ? "on" : "off"
    this.dataset.variant = this._variant
    this.dataset.size = this._size
    this.setAttribute("role", "button")
    this.setAttribute("tabindex", isDisabled ? "-1" : "0")
    this.setAttribute("aria-pressed", String(this._selected))

    if (isDisabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }

    // Build position-based classes for connected appearance
    const positionClasses = []

    // For spacing=0 (default), items connect visually
    positionClasses.push("rounded-none", "shadow-none")

    if (this._isFirst) {
      positionClasses.push("rounded-l-md")
    }
    if (this._isLast) {
      positionClasses.push("rounded-r-md")
    }

    // For outline variant, share borders
    if (this._variant === "outline") {
      if (!this._isFirst) {
        positionClasses.push("border-l-0")
      }
    }

    this.className = cn(
      baseClasses,
      variantClasses[this._variant] || variantClasses.default,
      sizeClasses[this._size] || sizeClasses.default,
      "w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
      positionClasses,
      isDisabled && "pointer-events-none opacity-50"
    )
  }

  _setSelected(selected: boolean) {
    this._selected = selected
    this.requestUpdate()
  }

  _setVariant(variant: "default" | "outline") {
    this._variant = variant
    this.requestUpdate()
  }

  _setSize(size: "default" | "sm" | "lg") {
    this._size = size
    this.requestUpdate()
  }

  _setPosition(isFirst: boolean, isLast: boolean) {
    this._isFirst = isFirst
    this._isLast = isLast
    this.requestUpdate()
  }

  _setGroupDisabled(disabled: boolean) {
    this._groupDisabled = disabled
    this.requestUpdate()
  }

  private _handleClick = () => {
    if (this.disabled || this._groupDisabled) return
    const group = this.closest("plank-toggle-group") as PlankToggleGroup
    group?._toggleItem(this.value)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.disabled || this._groupDisabled) return

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      const group = this.closest("plank-toggle-group") as PlankToggleGroup
      group?._toggleItem(this.value)
    }
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-toggle-group": PlankToggleGroup
    "plank-toggle-group-item": PlankToggleGroupItem
  }
}
