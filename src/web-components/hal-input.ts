import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalInput - an input web component that mirrors shadcn/ui Input
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Wraps a native <input> element for full form compatibility.
 */
@customElement("hal-input")
export class HalInput extends LitElement {
  @property({ type: String })
  type: string = "text"

  @property({ type: String })
  placeholder: string = ""

  @property({ type: String })
  value: string = ""

  @property({ type: String })
  name: string = ""

  @property({ type: Boolean, reflect: true })
  disabled = false

  private _associatedLabels: Element[] = []

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._associatedLabels.forEach((label) => {
      label.removeEventListener("click", this._handleLabelClick)
    })
    this._associatedLabels = []
  }

  firstUpdated() {
    // Delay to allow other components to render
    // (hal-label needs to render its inner <label> first)
    requestAnimationFrame(() => this._setupLabelAssociation())
  }

  private _setupLabelAssociation() {
    if (!this.id) return

    const labels = document.querySelectorAll(`label[for="${this.id}"]`)
    this._associatedLabels = Array.from(labels)
    this._associatedLabels.forEach((label) => {
      label.addEventListener("click", this._handleLabelClick)
    })
  }

  private _handleLabelClick = (e: Event) => {
    e.preventDefault()
    const input = this.querySelector("input")
    input?.focus()
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this.dispatchEvent(
      new CustomEvent("input", { detail: { value: this.value }, bubbles: true })
    )
  }

  private _handleChange(e: Event) {
    const input = e.target as HTMLInputElement
    this.value = input.value
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
      })
    )
  }

  updated() {
    this.dataset.slot = "input"
  }

  render() {
    const inputClasses = cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      this.disabled && "pointer-events-none cursor-not-allowed opacity-50"
    )

    return html`
      <input
        type=${this.type}
        .value=${this.value}
        placeholder=${this.placeholder}
        name=${this.name}
        ?disabled=${this.disabled}
        class=${inputClasses}
        data-slot="input"
        @input=${this._handleInput}
        @change=${this._handleChange}
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-input": HalInput
  }
}
