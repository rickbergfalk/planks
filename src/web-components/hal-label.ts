import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalLabel - a label web component that mirrors shadcn/ui Label
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders a native <label> element for proper form association.
 *
 * Pattern: Manual child distribution
 * - Renders an inner <label> element (required for accessibility)
 * - Moves original children into the <label> after first render
 * - This is necessary because <slot> doesn't work in light DOM
 */
@customElement("hal-label")
export class HalLabel extends LitElement {
  @property({ type: String, reflect: true })
  for: string = ""

  @property({ type: String })
  class: string = ""

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  willUpdate() {
    // Apply classes to the custom element container
    this.className = cn(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      this.class
    )
    this.dataset.slot = "label"
  }

  firstUpdated() {
    // Move original children into the rendered <label>
    // This is required because <slot> doesn't project in light DOM
    const label = this.querySelector("label")
    if (!label) return

    // Collect nodes that came before the label (original children)
    const originalChildren: Node[] = []
    for (const node of Array.from(this.childNodes)) {
      if (node === label) break
      // Skip Lit's comment markers
      if (node.nodeType === Node.COMMENT_NODE) continue
      originalChildren.push(node)
    }

    // Move them into the label
    originalChildren.forEach((child) => label.appendChild(child))
  }

  render() {
    // Render native <label> - children will be moved into it by firstUpdated()
    return html`<label for=${this.for}></label>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-label": HalLabel
  }
}
