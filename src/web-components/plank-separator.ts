import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankSeparator - a separator web component that mirrors shadcn/ui Separator
 *
 * Uses light DOM so Tailwind classes apply directly.
 */
@customElement("plank-separator")
export class PlankSeparator extends LitElement {
  @property({ type: String, reflect: true })
  orientation: "horizontal" | "vertical" = "horizontal"

  @property({ type: Boolean })
  decorative = true

  @property({ type: String }) class: string = ""

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._updateRole()
  }

  private _updateRole() {
    if (this.decorative) {
      this.setAttribute("role", "none")
    } else {
      this.setAttribute("role", "separator")
      this.setAttribute("aria-orientation", this.orientation)
    }
  }

  willUpdate() {
    this._updateRole()

    // Apply classes directly to the custom element
    // Note: custom elements are inline by default, need block for proper sizing
    this.className = cn(
      "block bg-border shrink-0",
      this.orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      this.class
    )

    // Set data attributes
    this.dataset.slot = "separator"
    this.dataset.orientation = this.orientation
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-separator": PlankSeparator
  }
}
