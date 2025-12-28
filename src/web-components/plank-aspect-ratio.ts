import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankAspectRatio - maintains a desired aspect ratio for content
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Uses CSS aspect-ratio property for modern browser support.
 */
@customElement("plank-aspect-ratio")
export class PlankAspectRatio extends LitElement {
  /**
   * The desired aspect ratio as a string.
   * Can be "16/9", "4/3", "1/1" or a numeric value like "1.777"
   */
  @property({ type: String })
  ratio: string = "1/1"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  private get aspectRatioStyle(): string {
    // Convert "16/9" format to CSS "16 / 9" format
    if (this.ratio.includes("/")) {
      return this.ratio.replace("/", " / ")
    }
    return this.ratio
  }

  willUpdate() {
    this.dataset.slot = "aspect-ratio"
    this.className = cn("relative w-full block", this.class)
    this.style.aspectRatio = this.aspectRatioStyle
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-aspect-ratio": PlankAspectRatio
  }
}
