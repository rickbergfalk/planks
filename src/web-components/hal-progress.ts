import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalProgress - a progress bar web component that mirrors shadcn/ui Progress
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Implements ARIA progressbar pattern for accessibility.
 */
@customElement("hal-progress")
export class HalProgress extends LitElement {
  @property({ type: Number })
  value: number = 0

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  private get clampedValue(): number {
    return Math.max(0, Math.min(100, this.value || 0))
  }

  willUpdate() {
    this.dataset.slot = "progress"
    this.setAttribute("role", "progressbar")
    this.setAttribute("aria-valuemin", "0")
    this.setAttribute("aria-valuemax", "100")
    this.setAttribute("aria-valuenow", String(this.clampedValue))
    this.className = cn(
      "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full block",
      this.class
    )
  }

  render() {
    const indicatorStyle = `transform: translateX(-${100 - this.clampedValue}%)`
    return html`
      <div
        data-slot="progress-indicator"
        class="bg-primary h-full w-full flex-1 transition-all"
        style=${indicatorStyle}
      ></div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-progress": HalProgress
  }
}
