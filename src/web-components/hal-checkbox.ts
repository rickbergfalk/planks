import { LitElement, html, svg } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

// Check icon from lucide-react (size-3.5 = 14px)
const checkIcon = svg`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-3.5"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
`

// Same classes as React component (adding inline-flex for proper custom element layout)
const checkboxClasses =
  "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"

const indicatorClasses =
  "grid place-content-center text-current transition-none"

/**
 * HalCheckbox - a checkbox web component that mirrors shadcn/ui Checkbox
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Renders a check icon inside when checked.
 * Includes a hidden native checkbox for label association and form integration.
 */
@customElement("hal-checkbox")
export class HalCheckbox extends LitElement {
  @property({ type: Boolean, reflect: true })
  checked = false

  @property({ type: Boolean, reflect: true })
  disabled = false

  @property({ type: String })
  class: string = ""

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
      this.setAttribute("role", "checkbox")
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
    if (e.key === " ") {
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

    // Style the checkbox element itself
    this.className = cn(
      checkboxClasses,
      this.disabled && "pointer-events-none opacity-50",
      this.class
    )

    // Set data-slot for styling hooks
    this.dataset.slot = "checkbox"
  }

  render() {
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
      <span class=${indicatorClasses} data-slot="checkbox-indicator">
        ${this.checked ? checkIcon : null}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-checkbox": HalCheckbox
  }
}
