import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalCard - a card container web component that mirrors shadcn/ui Card
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Compose with hal-card-header, hal-card-content, hal-card-footer, etc.
 */
@customElement("hal-card")
export class HalCard extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card"
    this.className = cn(
      "block bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalCardHeader - header section of a card
 */
@customElement("hal-card-header")
export class HalCardHeader extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-header"
    this.className = cn(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalCardTitle - title text inside card header
 */
@customElement("hal-card-title")
export class HalCardTitle extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-title"
    this.className = cn("leading-none font-semibold", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalCardDescription - description text inside card header
 */
@customElement("hal-card-description")
export class HalCardDescription extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-description"
    this.className = cn("text-muted-foreground text-sm", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalCardAction - action area inside card header (positioned top-right)
 */
@customElement("hal-card-action")
export class HalCardAction extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-action"
    this.className = cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalCardContent - main content area of a card
 */
@customElement("hal-card-content")
export class HalCardContent extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-content"
    this.className = cn("px-6", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalCardFooter - footer section of a card
 */
@customElement("hal-card-footer")
export class HalCardFooter extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "card-footer"
    this.className = cn("flex items-center px-6 [.border-t]:pt-6", this.class)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-card": HalCard
    "hal-card-header": HalCardHeader
    "hal-card-title": HalCardTitle
    "hal-card-description": HalCardDescription
    "hal-card-action": HalCardAction
    "hal-card-content": HalCardContent
    "hal-card-footer": HalCardFooter
  }
}
