import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankTextarea - a textarea web component that mirrors shadcn/ui Textarea
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Wraps a native <textarea> element for full form compatibility.
 */
@customElement("plank-textarea")
export class PlankTextarea extends LitElement {
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

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  private _handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this.dispatchEvent(new CustomEvent("input", { detail: { value: this.value }, bubbles: true }))
  }

  private _handleChange(e: Event) {
    const textarea = e.target as HTMLTextAreaElement
    this.value = textarea.value
    this.dispatchEvent(new CustomEvent("change", { detail: { value: this.value }, bubbles: true }))
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
    "plank-textarea": PlankTextarea
  }
}
