import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankNativeSelectOption - Individual option for native select
 *
 * Creates a native <option> element inside the parent select.
 */
@customElement("plank-native-select-option")
export class PlankNativeSelectOption extends LitElement {
  @property({ type: String }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) selected = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "native-select-option"
    this.style.display = "none"
  }

  render() {
    return html``
  }
}

/**
 * PlankNativeSelectOptGroup - Option group for native select
 *
 * Creates a native <optgroup> element inside the parent select.
 */
@customElement("plank-native-select-optgroup")
export class PlankNativeSelectOptGroup extends LitElement {
  @property({ type: String }) label = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "native-select-optgroup"
    this.style.display = "none"
  }

  render() {
    return html``
  }
}

/**
 * PlankNativeSelect - A native select web component that mirrors shadcn/ui NativeSelect
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Wraps a native <select> element for full form compatibility.
 *
 * @fires change - Fired when the selection changes, with detail: { value: string }
 */
@customElement("plank-native-select")
export class PlankNativeSelect extends LitElement {
  @property({ type: String }) value = ""
  @property({ type: String }) name = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String, reflect: true }) size: "sm" | "default" = "default"
  @property({ type: String }) class: string = ""

  private _selectElement: HTMLSelectElement | null = null

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "native-select-wrapper"
    this.className = cn(
      "group/native-select relative w-fit block",
      this.disabled && "opacity-50",
      this.class
    )
  }

  firstUpdated() {
    this._buildNativeSelect()
  }

  private _buildNativeSelect() {
    // Create the native select element
    this._selectElement = document.createElement("select")
    this._selectElement.dataset.slot = "native-select"
    this._selectElement.dataset.size = this.size
    if (this.name) this._selectElement.name = this.name
    if (this.disabled) this._selectElement.disabled = true

    this._selectElement.className = cn(
      "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-8 data-[size=sm]:py-1",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    )

    // Process child plank-native-select-option and plank-native-select-optgroup elements
    this._processChildren(this, this._selectElement)

    // Set initial value if provided
    if (this.value) {
      this._selectElement.value = this.value
    }

    // Listen for changes
    this._selectElement.addEventListener("change", this._handleChange)

    // Create chevron icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("width", "16")
    svg.setAttribute("height", "16")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")
    svg.setAttribute("stroke", "currentColor")
    svg.setAttribute("stroke-width", "2")
    svg.setAttribute("stroke-linecap", "round")
    svg.setAttribute("stroke-linejoin", "round")
    svg.setAttribute("aria-hidden", "true")
    svg.dataset.slot = "native-select-icon"
    svg.classList.add(
      "text-muted-foreground",
      "pointer-events-none",
      "absolute",
      "top-1/2",
      "right-3.5",
      "size-4",
      "-translate-y-1/2",
      "opacity-50",
      "select-none"
    )

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "m6 9 6 6 6-6")
    svg.appendChild(path)

    // Insert elements
    this.insertBefore(this._selectElement, this.firstChild)
    this.appendChild(svg)
  }

  private _processChildren(
    parent: Element,
    target: HTMLSelectElement | HTMLOptGroupElement
  ) {
    const children = Array.from(parent.children)

    for (const child of children) {
      if (child.tagName.toLowerCase() === "plank-native-select-option") {
        const option = child as PlankNativeSelectOption
        const nativeOption = document.createElement("option")
        nativeOption.value = option.value
        nativeOption.textContent = option.textContent
        nativeOption.dataset.slot = "native-select-option"
        if (option.disabled) nativeOption.disabled = true
        if (option.selected) nativeOption.selected = true
        target.appendChild(nativeOption)
      } else if (
        child.tagName.toLowerCase() === "plank-native-select-optgroup"
      ) {
        const optgroup = child as PlankNativeSelectOptGroup
        const nativeOptgroup = document.createElement("optgroup")
        nativeOptgroup.label = optgroup.label
        nativeOptgroup.dataset.slot = "native-select-optgroup"
        if (optgroup.disabled) nativeOptgroup.disabled = true
        // Process nested options
        this._processChildren(optgroup, nativeOptgroup)
        target.appendChild(nativeOptgroup)
      }
    }
  }

  private _handleChange = (e: Event) => {
    e.stopPropagation()
    const select = e.target as HTMLSelectElement
    this.value = select.value
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
      })
    )
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._selectElement?.removeEventListener("change", this._handleChange)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-native-select": PlankNativeSelect
    "plank-native-select-option": PlankNativeSelectOption
    "plank-native-select-optgroup": PlankNativeSelectOptGroup
  }
}
