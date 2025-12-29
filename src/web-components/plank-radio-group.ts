import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankRadioGroup - Container component that manages radio selection state
 *
 * @fires value-change - Fired when the value changes, with detail: { value: string }
 *
 * @example
 * ```html
 * <plank-radio-group value="option1">
 *   <plank-radio-group-item value="option1"></plank-radio-group-item>
 *   <plank-radio-group-item value="option2"></plank-radio-group-item>
 * </plank-radio-group>
 * ```
 */
@customElement("plank-radio-group")
export class PlankRadioGroup extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "radio-group"
    this.setAttribute("role", "radiogroup")
    this.className = cn("grid gap-3", this.class)
  }

  updated() {
    this._updateChildren()
  }

  private _updateChildren() {
    const items = this.querySelectorAll("plank-radio-group-item")
    const itemsArray = Array.from(items) as PlankRadioGroupItem[]

    // Find the first non-disabled item for tab order when nothing is selected
    const firstNonDisabled = itemsArray.find((item) => !item.disabled)

    itemsArray.forEach((item, index) => {
      const isChecked = item.value === this.value
      const isFirstFocusable = !this.value && item === firstNonDisabled
      item._setChecked(isChecked)
      item._setIsFocusable(isChecked || isFirstFocusable)
      item._setIndex(index)
    })
  }

  _selectItem(value: string) {
    if (this.disabled) return
    if (this.value !== value) {
      this.value = value
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value: this.value },
          bubbles: true,
        })
      )
    }
  }

  _getItems(): PlankRadioGroupItem[] {
    return Array.from(
      this.querySelectorAll("plank-radio-group-item")
    ) as PlankRadioGroupItem[]
  }

  _navigateItems(direction: 1 | -1, currentItem: PlankRadioGroupItem) {
    const items = this._getItems().filter((item) => !item.disabled)
    const currentIndex = items.indexOf(currentItem)
    if (currentIndex === -1) return

    let nextIndex = currentIndex + direction
    if (nextIndex < 0) nextIndex = items.length - 1
    if (nextIndex >= items.length) nextIndex = 0

    const nextItem = items[nextIndex]
    nextItem.focus()
    this._selectItem(nextItem.value)
  }

  render() {
    return html``
  }
}

/**
 * PlankRadioGroupItem - Individual radio button
 */
@customElement("plank-radio-group-item")
export class PlankRadioGroupItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  private _checked = false
  private _isFocusable = false
  private _index = 0

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
    this.dataset.slot = "radio-group-item"
    this.dataset.state = this._checked ? "checked" : "unchecked"
    this.setAttribute("role", "radio")
    this.setAttribute("tabindex", this._isFocusable ? "0" : "-1")
    this.setAttribute("aria-checked", String(this._checked))
    this.className = cn(
      "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center"
    )
  }

  updated() {
    this._renderIndicator()
  }

  private _renderIndicator() {
    // Remove existing indicator
    const existingIndicator = this.querySelector(
      "[data-slot='radio-group-indicator']"
    )
    if (existingIndicator) {
      existingIndicator.remove()
    }

    if (this._checked) {
      const indicator = document.createElement("span")
      indicator.dataset.slot = "radio-group-indicator"
      indicator.className = "relative flex items-center justify-center"

      // Create the inner circle using SVG like the React version
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
      svg.setAttribute("width", "8")
      svg.setAttribute("height", "8")
      svg.setAttribute("viewBox", "0 0 24 24")
      svg.setAttribute("fill", "currentColor")
      svg.setAttribute("stroke", "currentColor")
      svg.setAttribute("stroke-width", "2")
      svg.classList.add(
        "fill-primary",
        "absolute",
        "top-1/2",
        "left-1/2",
        "size-2",
        "-translate-x-1/2",
        "-translate-y-1/2"
      )

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      )
      circle.setAttribute("cx", "12")
      circle.setAttribute("cy", "12")
      circle.setAttribute("r", "10")
      svg.appendChild(circle)

      indicator.appendChild(svg)
      this.appendChild(indicator)
    }
  }

  _setChecked(checked: boolean) {
    this._checked = checked
    this.requestUpdate()
  }

  _setIsFocusable(focusable: boolean) {
    this._isFocusable = focusable
    this.requestUpdate()
  }

  _setIndex(index: number) {
    this._index = index
  }

  private _handleClick = () => {
    if (this.disabled) return
    const group = this.closest("plank-radio-group") as PlankRadioGroup
    group?._selectItem(this.value)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.disabled) return

    if (e.key === " ") {
      e.preventDefault()
      const group = this.closest("plank-radio-group") as PlankRadioGroup
      group?._selectItem(this.value)
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault()
      const group = this.closest("plank-radio-group") as PlankRadioGroup
      group?._navigateItems(1, this)
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault()
      const group = this.closest("plank-radio-group") as PlankRadioGroup
      group?._navigateItems(-1, this)
    }
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-radio-group": PlankRadioGroup
    "plank-radio-group-item": PlankRadioGroupItem
  }
}
