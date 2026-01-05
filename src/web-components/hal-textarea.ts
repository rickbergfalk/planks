import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalTextarea - a textarea web component that mirrors shadcn/ui Textarea
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Wraps a native <textarea> element for full form compatibility.
 */
@customElement("hal-textarea")
export class HalTextarea extends LitElement {
  @property({ type: String })
  placeholder: string = ""

  @property({ type: String })
  value: string = ""

  @property({ type: String })
  name: string = ""

  @property({ type: Number })
  rows?: number

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
    const textarea = this.querySelector("textarea")
    textarea?.focus()
  }

  private _handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this.dispatchEvent(
      new CustomEvent("input", { detail: { value: this.value }, bubbles: true })
    )
  }

  private _handleChange(e: Event) {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
      })
    )
  }

  updated() {
    this.dataset.slot = "textarea"
  }

  render() {
    const textareaClasses = cn(
      "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm",
      this.disabled && "cursor-not-allowed opacity-50"
    )

    return html`
      <textarea
        .value=${this.value}
        placeholder=${this.placeholder}
        name=${this.name}
        rows=${this.rows ?? 2}
        ?disabled=${this.disabled}
        class=${textareaClasses}
        data-slot="textarea"
        @input=${this._handleInput}
        @change=${this._handleChange}
      ></textarea>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-textarea": HalTextarea
  }
}
