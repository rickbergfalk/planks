import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalSkeleton - a skeleton loading placeholder that mirrors shadcn/ui Skeleton
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Size is controlled via className (e.g., class="h-4 w-32")
 */
@customElement("hal-skeleton")
export class HalSkeleton extends LitElement {
  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  updated() {
    // Apply base classes while preserving any user-provided classes
    const userClasses = this.getAttribute("class") || ""
    const baseClasses = "block bg-accent animate-pulse rounded-md"

    // Only add base classes if they're not already present
    const classes = cn(baseClasses, userClasses)
    this.className = classes

    // Set data attribute
    this.dataset.slot = "skeleton"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-skeleton": HalSkeleton
  }
}
