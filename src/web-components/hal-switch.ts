import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Same classes as React component
const switchTrackClasses =
  "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"

const switchThumbClasses =
  "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"

/**
 * HalSwitch - a switch/toggle web component that mirrors shadcn/ui Switch
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders a thumb element inside that slides on state change.
 * Includes a hidden native checkbox for label association and form integration.
 */
@customElement("hal-switch")
export class HalSwitch extends LitElement {
  @property({ type: Boolean, reflect: true })
  checked = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  private _input: HTMLInputElement | null = null
  private _associatedLabels: Element[] = []

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Set up accessibility on the custom element
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "switch")
    }
    if (!this.hasAttribute("tabindex") && !this.disabled) {
      this.setAttribute("tabindex", "0")
    }
    // Handle interactions
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeydown)
    // Clean up label listeners
    this._associatedLabels.forEach((label) => {
      label.removeEventListener("click", this._handleLabelClick)
    })
    this._associatedLabels = []
  }

  firstUpdated() {
    // Get reference to the hidden input
    this._input = this.querySelector('input[type="checkbox"]')
    if (this._input) {
      // Sync initial state
      this._input.checked = this.checked
    }

    // Set up label association - delay to allow other components to render
    // (hal-label needs to render its inner <label> first)
    requestAnimationFrame(() => this._setupLabelAssociation())
  }

  private _setupLabelAssociation() {
    if (!this.id) return

    // Find all labels with for="our-id" and add click listeners
    const labels = document.querySelectorAll(`label[for="${this.id}"]`)
    this._associatedLabels = Array.from(labels)
    this._associatedLabels.forEach((label) => {
      label.addEventListener("click", this._handleLabelClick)
    })
  }

  private _handleLabelClick = (e: Event) => {
    e.preventDefault()
    if (!this.disabled) {
      this._toggle()
      this.focus()
    }
  }

  private _handleClick = (e: MouseEvent) => {
    // Ignore clicks on the hidden input
    if ((e.target as HTMLElement).tagName === "INPUT") {
      return
    }
    if (this.disabled) {
      e.preventDefault()
      return
    }
    this._toggle()
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!this.disabled) {
        e.preventDefault()
        this._toggle()
      }
    }
  }

  private _toggle() {
    this.checked = !this.checked
    // Sync hidden input
    if (this._input) {
      this._input.checked = this.checked
    }
    this.dispatchEvent(
      new CustomEvent("checked-change", {
        detail: this.checked,
        bubbles: true,
        composed: true,
      })
    )
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    // Update tabindex and aria-disabled when disabled changes
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.setAttribute("tabindex", "-1")
        this.setAttribute("aria-disabled", "true")
      } else {
        this.setAttribute("tabindex", "0")
        this.removeAttribute("aria-disabled")
      }
    }

    // Sync hidden input when checked changes programmatically
    if (changedProperties.has("checked") && this._input) {
      this._input.checked = this.checked
    }

    // Update aria-checked and data-state when checked changes
    const state = this.checked ? "checked" : "unchecked"
    this.setAttribute("aria-checked", String(this.checked))
    this.dataset.state = state

    // Style the track (the element itself)
    this.className = cn(
      switchTrackClasses,
      this.disabled && "pointer-events-none opacity-50"
    )

    // Set data-slot for styling hooks
    this.dataset.slot = "switch"
  }

  render() {
    const state = this.checked ? "checked" : "unchecked"
    return html`
      <input
        type="checkbox"
        class="sr-only"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        @click=${(e: Event) => e.stopPropagation()}
        aria-hidden="true"
        tabindex="-1"
      />
      <span
        class=${switchThumbClasses}
        data-slot="switch-thumb"
        data-state=${state}
      ></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-switch": HalSwitch
  }
}
