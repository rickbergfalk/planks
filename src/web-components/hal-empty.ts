import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalEmpty - an empty state container web component that mirrors shadcn/ui Empty
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Compose with hal-empty-header, hal-empty-media, hal-empty-title, etc.
 */
@customElement("hal-empty")
export class HalEmpty extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty"
    this.className = cn(
      "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalEmptyHeader - header section of an empty state
 */
@customElement("hal-empty-header")
export class HalEmptyHeader extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty-header"
    this.className = cn(
      "flex max-w-sm flex-col items-center gap-2 text-center",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalEmptyMedia - icon/media section of an empty state
 */
@customElement("hal-empty-media")
export class HalEmptyMedia extends LitElement {
  @property({ type: String })
  variant: "default" | "icon" = "default"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty-icon"
    this.dataset.variant = this.variant

    const baseClasses =
      "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0"
    const variantClasses =
      this.variant === "icon"
        ? "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
        : "bg-transparent"

    this.className = cn(baseClasses, variantClasses, this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalEmptyTitle - title text inside empty header
 */
@customElement("hal-empty-title")
export class HalEmptyTitle extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty-title"
    this.className = cn("text-lg font-medium tracking-tight", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalEmptyDescription - description text inside empty header
 */
@customElement("hal-empty-description")
export class HalEmptyDescription extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty-description"
    this.className = cn(
      "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalEmptyContent - content/action area of an empty state
 */
@customElement("hal-empty-content")
export class HalEmptyContent extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "empty-content"
    this.className = cn(
      "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-empty": HalEmpty
    "hal-empty-header": HalEmptyHeader
    "hal-empty-media": HalEmptyMedia
    "hal-empty-title": HalEmptyTitle
    "hal-empty-description": HalEmptyDescription
    "hal-empty-content": HalEmptyContent
  }
}
