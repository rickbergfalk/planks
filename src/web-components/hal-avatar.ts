import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalAvatar - container for avatar image and fallback
 *
 * Uses light DOM so Tailwind classes apply directly.
 */
@customElement("hal-avatar")
export class HalAvatar extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "avatar"
    this.className = cn(
      "relative flex size-8 shrink-0 overflow-hidden rounded-full",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalAvatarImage - the avatar image
 *
 * Renders an img element. In a full implementation, this would
 * hide the fallback when the image loads successfully.
 */
@customElement("hal-avatar-image")
export class HalAvatarImage extends LitElement {
  @property({ type: String })
  src: string = ""

  @property({ type: String })
  alt: string = ""

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "avatar-image"
    this.style.display = "contents"
  }

  render() {
    return html`
      <img
        src=${this.src}
        alt=${this.alt}
        class=${cn("aspect-square size-full", this.class)}
      />
    `
  }
}

/**
 * HalAvatarFallback - fallback content when image is not available
 *
 * Shows initials or other placeholder content.
 */
@customElement("hal-avatar-fallback")
export class HalAvatarFallback extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "avatar-fallback"
    this.className = cn(
      "bg-muted flex size-full items-center justify-center rounded-full",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-avatar": HalAvatar
    "hal-avatar-image": HalAvatarImage
    "hal-avatar-fallback": HalAvatarFallback
  }
}
