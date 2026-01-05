import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalSpinner - A loading spinner web component that mirrors shadcn/ui Spinner
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders an animated loading circle icon.
 */
@customElement("hal-spinner")
export class HalSpinner extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "spinner"
  }

  render() {
    const svgClasses = cn("size-4 animate-spin", this.class)

    // Loader2/LoaderCircle icon from lucide-react
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="status"
        aria-label="Loading"
        class=${svgClasses}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-spinner": HalSpinner
  }
}
