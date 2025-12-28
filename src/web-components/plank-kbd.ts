import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankKbd - a keyboard key indicator web component that mirrors shadcn/ui Kbd
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders a native <kbd> element for proper semantics.
 *
 * Pattern: Manual child distribution
 * - Renders an inner <kbd> element (required for semantics)
 * - Moves original children into the <kbd> after first render
 * - This is necessary because <slot> doesn't work in light DOM
 */
@customElement("plank-kbd")
export class PlankKbd extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "kbd"
    // Use display:contents so the wrapper doesn't affect layout
    this.style.display = "contents"
  }

  firstUpdated() {
    // Move original children into the rendered <kbd>
    const kbd = this.querySelector("kbd")
    if (!kbd) return

    // Collect nodes that came before the kbd (original children)
    const originalChildren: Node[] = []
    for (const node of Array.from(this.childNodes)) {
      if (node === kbd) break
      if (node.nodeType === Node.COMMENT_NODE) continue
      originalChildren.push(node)
    }

    // Move them into the kbd
    originalChildren.forEach((child) => kbd.appendChild(child))
  }

  render() {
    const kbdClasses = cn(
      "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none",
      "[&_svg:not([class*='size-'])]:size-3",
      "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
      this.class
    )
    return html`<kbd class=${kbdClasses}></kbd>`
  }
}

/**
 * PlankKbdGroup - groups multiple keyboard keys together
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders a native <kbd> element as the group container.
 *
 * Pattern: Manual child distribution
 */
@customElement("plank-kbd-group")
export class PlankKbdGroup extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "kbd-group"
    // Use display:contents so the wrapper doesn't affect layout
    this.style.display = "contents"
  }

  firstUpdated() {
    // Move original children into the rendered <kbd>
    const kbd = this.querySelector(":scope > kbd")
    if (!kbd) return

    // Collect nodes that came before the kbd (original children)
    const originalChildren: Node[] = []
    for (const node of Array.from(this.childNodes)) {
      if (node === kbd) break
      if (node.nodeType === Node.COMMENT_NODE) continue
      originalChildren.push(node)
    }

    // Move them into the kbd
    originalChildren.forEach((child) => kbd.appendChild(child))
  }

  render() {
    const kbdClasses = cn("inline-flex items-center gap-1", this.class)
    return html`<kbd class=${kbdClasses}></kbd>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-kbd": PlankKbd
    "plank-kbd-group": PlankKbdGroup
  }
}
