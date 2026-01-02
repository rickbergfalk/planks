import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { ifDefined } from "lit/directives/if-defined.js"
import { cn } from "@/lib/utils"

/**
 * plank-input-group: Container for grouping inputs with addons
 *
 * Provides a styled container that groups an input with prefix/suffix addons
 * like icons, buttons, or text.
 *
 * @example
 * ```html
 * <plank-input-group>
 *   <plank-input-group-addon>
 *     <svg>...</svg>
 *   </plank-input-group-addon>
 *   <plank-input-group-input placeholder="Search..."></plank-input-group-input>
 * </plank-input-group>
 * ```
 */
@customElement("plank-input-group")
export class PlankInputGroup extends LitElement {
  @property({ type: Boolean }) disabled = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
      "h-9 min-w-0 has-[>textarea]:h-auto",

      // Variants based on alignment
      "has-[>[data-align=inline-start]]:[&>input]:pl-2",
      "has-[>[data-align=inline-end]]:[&>input]:pr-2",
      "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
      "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

      // Focus state
      "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

      // Error state
      "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

      this.disabled ? "opacity-50 pointer-events-none" : "",

      this.className
    )
    this.setAttribute("role", "group")
    this.dataset.slot = "input-group"
    if (this.disabled) {
      this.dataset.disabled = "true"
    } else {
      delete this.dataset.disabled
    }
  }

  render() {
    return html``
  }
}

/**
 * plank-input-group-addon: Addon container for icons, buttons, or text
 *
 * Place at the start or end of an input group to add visual elements.
 *
 * @example
 * ```html
 * <plank-input-group-addon>
 *   <svg>...</svg>
 * </plank-input-group-addon>
 * <plank-input-group-addon align="inline-end">USD</plank-input-group-addon>
 * ```
 */
@customElement("plank-input-group-addon")
export class PlankInputGroupAddon extends LitElement {
  @property({ type: String }) align:
    | "inline-start"
    | "inline-end"
    | "block-start"
    | "block-end" = "inline-start"

  createRenderRoot() {
    return this
  }

  private _handleClick = (e: MouseEvent) => {
    // Don't focus input if clicking a button inside the addon
    if ((e.target as HTMLElement).closest("button")) {
      return
    }
    // Focus the input in the parent group
    const group = this.closest("plank-input-group")
    const input = group?.querySelector("input, textarea") as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null
    input?.focus()
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  willUpdate() {
    const alignClasses = {
      "inline-start":
        "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
      "inline-end":
        "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
      "block-start":
        "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
      "block-end":
        "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5",
    }

    this.className = cn(
      "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none",
      "[&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)]",
      "group-data-[disabled=true]/input-group:opacity-50",
      alignClasses[this.align],
      this.className
    )
    this.setAttribute("role", "group")
    this.dataset.slot = "input-group-addon"
    this.dataset.align = this.align
  }

  render() {
    return html``
  }
}

/**
 * plank-input-group-button: Styled button for use inside input group addons
 *
 * @example
 * ```html
 * <plank-input-group-addon align="inline-end">
 *   <plank-input-group-button>Search</plank-input-group-button>
 * </plank-input-group-addon>
 * ```
 */
@customElement("plank-input-group-button")
export class PlankInputGroupButton extends LitElement {
  @property({ type: String }) variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link" = "ghost"
  @property({ type: String }) size: "xs" | "sm" | "icon-xs" | "icon-sm" = "xs"
  @property({ type: String }) type: "button" | "submit" | "reset" = "button"
  @property({ type: Boolean }) disabled = false

  createRenderRoot() {
    return this
  }

  private _getButtonClasses() {
    const sizeClasses = {
      xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
      sm: "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
      "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 p-0 has-[>svg]:p-0",
    }

    const variantClasses = {
      default:
        "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      destructive:
        "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      outline:
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      secondary:
        "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      ghost:
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      link: "text-primary underline-offset-4 hover:underline",
    }

    return cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
      "transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      "shadow-none",
      variantClasses[this.variant],
      sizeClasses[this.size],
      this.disabled ? "opacity-50 pointer-events-none" : ""
    )
  }

  // Store children before Lit renders
  private _childNodes: Node[] = []

  connectedCallback() {
    super.connectedCallback()
    // Capture children before first render
    this._childNodes = [...this.childNodes].filter(
      (n) => n.nodeType !== Node.COMMENT_NODE
    )
  }

  willUpdate() {
    // Use display:contents so wrapper doesn't affect layout
    this.style.display = "contents"
    this.dataset.slot = "input-group-button"
    this.dataset.size = this.size
  }

  firstUpdated() {
    // Move captured children into the button (slot doesn't work in light DOM)
    const button = this.querySelector("button")
    this._childNodes.forEach((child) => button?.appendChild(child))
  }

  private _handleClick = (e: MouseEvent) => {
    if (this.disabled) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    this.dispatchEvent(
      new CustomEvent("click", {
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    return html`<button
      type=${this.type}
      ?disabled=${this.disabled}
      @click=${this._handleClick}
      class=${this._getButtonClasses()}
    ></button>`
  }
}

/**
 * plank-input-group-text: Text element for use inside input group addons
 *
 * @example
 * ```html
 * <plank-input-group-addon>
 *   <plank-input-group-text>https://</plank-input-group-text>
 * </plank-input-group-addon>
 * ```
 */
@customElement("plank-input-group-text")
export class PlankInputGroupText extends LitElement {
  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "text-muted-foreground flex items-center gap-2 text-sm",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      this.className
    )
    this.dataset.slot = "input-group-text"
  }

  render() {
    return html``
  }
}

/**
 * plank-input-group-input: Styled input for use inside input groups
 *
 * @example
 * ```html
 * <plank-input-group>
 *   <plank-input-group-input placeholder="Search..."></plank-input-group-input>
 * </plank-input-group>
 * ```
 */
@customElement("plank-input-group-input")
export class PlankInputGroupInput extends LitElement {
  @property({ type: String }) type = "text"
  @property({ type: String }) placeholder = ""
  @property({ type: String }) value = ""
  @property({ type: String }) name = ""
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) readonly = false
  @property({ type: Boolean }) invalid = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "flex-1 rounded-none border-0 bg-transparent shadow-none outline-none",
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
      "flex h-9 w-full min-w-0 px-3 py-1 text-base md:text-sm",
      "focus-visible:ring-0 dark:bg-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      this.className
    )
    this.dataset.slot = "input-group-control"
  }

  private _handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    this.value = target.value
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  private _handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    this.value = target.value
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    return html`<input
      type=${this.type}
      placeholder=${this.placeholder}
      .value=${this.value}
      name=${this.name}
      ?disabled=${this.disabled}
      ?readonly=${this.readonly}
      aria-invalid=${this.invalid ? "true" : "false"}
      data-slot="input-group-control"
      class=${this.className}
      @input=${this._handleInput}
      @change=${this._handleChange}
    />`
  }
}

/**
 * plank-input-group-textarea: Styled textarea for use inside input groups
 *
 * @example
 * ```html
 * <plank-input-group>
 *   <plank-input-group-textarea placeholder="Enter message..."></plank-input-group-textarea>
 * </plank-input-group>
 * ```
 */
@customElement("plank-input-group-textarea")
export class PlankInputGroupTextarea extends LitElement {
  @property({ type: String }) placeholder = ""
  @property({ type: String }) value = ""
  @property({ type: String }) name = ""
  @property({ type: Number }) rows: number | undefined = undefined
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) readonly = false
  @property({ type: Boolean }) invalid = false

  createRenderRoot() {
    return this
  }

  private _getTextareaClasses() {
    return cn(
      "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none outline-none",
      "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
      "flex field-sizing-content min-h-16 w-full min-w-0 px-3 text-base md:text-sm",
      "focus-visible:ring-0 dark:bg-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50"
    )
  }

  willUpdate() {
    // Use display:contents so the wrapper doesn't affect layout
    this.style.display = "contents"
    this.dataset.slot = "input-group-control"
  }

  private _handleInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    this.value = target.value
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  private _handleChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    this.value = target.value
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    )
  }

  render() {
    return html`<textarea
      placeholder=${this.placeholder}
      .value=${this.value}
      name=${this.name}
      rows=${ifDefined(this.rows)}
      ?disabled=${this.disabled}
      ?readonly=${this.readonly}
      aria-invalid=${this.invalid ? "true" : "false"}
      data-slot="input-group-control"
      class=${this._getTextareaClasses()}
      @input=${this._handleInput}
      @change=${this._handleChange}
    ></textarea>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-input-group": PlankInputGroup
    "plank-input-group-addon": PlankInputGroupAddon
    "plank-input-group-button": PlankInputGroupButton
    "plank-input-group-text": PlankInputGroupText
    "plank-input-group-input": PlankInputGroupInput
    "plank-input-group-textarea": PlankInputGroupTextarea
  }
}
