import { LitElement, html, PropertyValues } from "lit"
import { customElement, property, state, query } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * hal-input-otp: Main container that manages the OTP input state
 */
@customElement("hal-input-otp")
export class HalInputOtp extends LitElement {
  @property({ type: Number, attribute: "max-length" }) maxLength = 6
  @property({ type: String }) value = ""
  @property({ type: String }) pattern?: string
  @property({ type: String }) placeholder?: string
  @property({ type: String, attribute: "input-mode" }) inputMode:
    | "numeric"
    | "text" = "numeric"
  @property({ type: Boolean }) disabled = false

  @state() private _isFocused = false
  @state() private _selectionStart: number | null = null
  @state() private _selectionEnd: number | null = null

  @query("input") private _input!: HTMLInputElement

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "relative flex items-center gap-2 cursor-text select-none",
      this.className
    )
    // Disable pointer events on the container so the input receives them
    this.style.pointerEvents = "none"
    this.dataset.slot = "input-otp"
    if (this.disabled) {
      this.dataset.disabled = ""
      this.style.cursor = "default"
    } else {
      delete this.dataset.disabled
      this.style.cursor = "text"
    }
  }

  firstUpdated() {
    // Distribute children and set up the input
    this._setupSlots()
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("value")) {
      this._updateSlots()
    }
  }

  private _setupSlots() {
    // Find all slot elements and register them
    this._updateSlots()
  }

  private _updateSlots() {
    // Update all slot components with current state
    const slots = this.querySelectorAll("hal-input-otp-slot")
    slots.forEach((slot) => {
      const slotEl = slot as HalInputOtpSlot
      slotEl._updateFromProvider(
        this.value,
        this._isFocused,
        this._selectionStart,
        this._selectionEnd
      )
    })
  }

  private _handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    const newValue = input.value.slice(0, this.maxLength)

    // Validate against pattern if provided
    if (newValue.length > 0 && this.pattern) {
      const regex = new RegExp(this.pattern)
      if (!regex.test(newValue)) {
        // Revert to previous value
        input.value = this.value
        return
      }
    }

    this.value = newValue
    this._updateSelection()
    this._updateSlots()

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )

    if (newValue.length === this.maxLength) {
      this.dispatchEvent(
        new CustomEvent("complete", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  private _handleFocus = () => {
    this._isFocused = true
    this._updateSelection()
    this._updateSlots()
  }

  private _handleBlur = () => {
    this._isFocused = false
    this._selectionStart = null
    this._selectionEnd = null
    this._updateSlots()
  }

  private _handleKeyDown = () => {
    // Handle selection changes
    requestAnimationFrame(() => {
      this._updateSelection()
      this._updateSlots()
    })
  }

  private _handleClick = () => {
    this._input?.focus()
    this._updateSelection()
    this._updateSlots()
  }

  private _handleMouseDown = (e: Event) => {
    // Prevent default to manage focus ourselves
    e.preventDefault()
    this._input?.focus()
    // Position caret at end or at first empty slot
    const pos = Math.min(this.value.length, this.maxLength - 1)
    this._input?.setSelectionRange(pos, this.value.length)
    this._updateSelection()
    this._updateSlots()
  }

  private _updateSelection() {
    if (this._input && this._isFocused) {
      const start = this._input.selectionStart
      const end = this._input.selectionEnd
      const len = this.value.length

      // Position selection for visual feedback
      if (start === end) {
        // Cursor position - highlight the slot we're at
        const pos = start ?? 0
        if (pos === 0 && len === 0) {
          this._selectionStart = 0
          this._selectionEnd = 1
        } else if (pos >= len) {
          // At end - highlight the next empty slot or last filled
          this._selectionStart = Math.min(len, this.maxLength - 1)
          this._selectionEnd = Math.min(len + 1, this.maxLength)
        } else {
          this._selectionStart = pos
          this._selectionEnd = pos + 1
        }
      } else {
        this._selectionStart = start
        this._selectionEnd = end
      }
    }
  }

  // Note: Paste is handled by the native input's input event
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _handlePaste = (_e: ClipboardEvent) => {
    // Let the input event handle the paste
  }

  // Public method to focus the input
  focus() {
    this._input?.focus()
  }

  // Public method to clear the input
  clear() {
    this.value = ""
    if (this._input) {
      this._input.value = ""
    }
    this._updateSlots()
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "" },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    const patternAttr = this.pattern || undefined

    // Input covers the full container and is transparent but receives pointer events
    // This matches how input-otp library works in React
    return html`<input
      type="text"
      inputmode=${this.inputMode}
      autocomplete="one-time-code"
      .value=${this.value}
      maxlength=${this.maxLength}
      pattern=${patternAttr}
      ?disabled=${this.disabled}
      @input=${this._handleInput}
      @focus=${this._handleFocus}
      @blur=${this._handleBlur}
      @keydown=${this._handleKeyDown}
      @keyup=${this._handleKeyDown}
      @paste=${this._handlePaste}
      class="absolute inset-0 w-full h-full opacity-0 pointer-events-auto bg-transparent border-0 outline-none"
      style="caret-color: transparent; color: transparent; letter-spacing: -0.5em; font-family: monospace;"
      aria-label="OTP input"
    />`
  }
}

/**
 * hal-input-otp-group: Visual grouping for OTP slots
 */
@customElement("hal-input-otp-group")
export class HalInputOtpGroup extends LitElement {
  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn("flex items-center", this.className)
    this.dataset.slot = "input-otp-group"
  }

  render() {
    return html``
  }
}

/**
 * hal-input-otp-slot: Individual slot for displaying a single character
 */
@customElement("hal-input-otp-slot")
export class HalInputOtpSlot extends LitElement {
  @property({ type: Number }) index = 0

  @state() private _char: string | null = null
  @state() private _isActive = false
  @state() private _hasFakeCaret = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md",
      "border-input dark:bg-input/30",
      "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:z-10 data-[active=true]:ring-[3px]",
      "data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive",
      this.className
    )
    this.dataset.slot = "input-otp-slot"
    this.dataset.active = this._isActive ? "true" : "false"
  }

  // Called by the parent provider to update state
  _updateFromProvider(
    value: string,
    isFocused: boolean,
    selectionStart: number | null,
    selectionEnd: number | null
  ) {
    this._char = value[this.index] ?? null
    this._isActive =
      isFocused &&
      selectionStart !== null &&
      selectionEnd !== null &&
      this.index >= selectionStart &&
      this.index < selectionEnd
    this._hasFakeCaret = this._isActive && this._char === null
    this.requestUpdate()
  }

  render() {
    return html`${this._char}${this._hasFakeCaret
      ? html`<div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div class="animate-caret-blink bg-foreground h-4 w-px"></div>
        </div>`
      : ""}`
  }
}

/**
 * hal-input-otp-separator: Visual separator between groups
 */
@customElement("hal-input-otp-separator")
export class HalInputOtpSeparator extends LitElement {
  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "input-otp-separator"
    this.setAttribute("role", "separator")
  }

  render() {
    // Render a minus icon by default (like the React version)
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 12h14"></path>
    </svg>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-input-otp": HalInputOtp
    "hal-input-otp-group": HalInputOtpGroup
    "hal-input-otp-slot": HalInputOtpSlot
    "hal-input-otp-separator": HalInputOtpSeparator
  }
}
