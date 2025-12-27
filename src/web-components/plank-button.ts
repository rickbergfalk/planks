import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Same variant definitions as React component
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
type ButtonSize = VariantProps<typeof buttonVariants>["size"]

/**
 * PlankButton - a button web component that mirrors shadcn/ui Button
 *
 * Uses light DOM so Tailwind classes apply directly.
 * The custom element itself becomes a styled <button> element.
 */
@customElement("plank-button")
export class PlankButton extends LitElement {
  @property({ type: String })
  variant: ButtonVariant = "default"

  @property({ type: String })
  size: ButtonSize = "default"

  @property({ type: Boolean, reflect: true })
  disabled = false

  // Light DOM - no shadow root
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Make the custom element behave like a button
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button")
    }
    if (!this.hasAttribute("tabindex") && !this.disabled) {
      this.setAttribute("tabindex", "0")
    }
    // Handle keyboard activation
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("keydown", this._handleKeydown)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      if (!this.disabled) {
        e.preventDefault()
        this.click()
      }
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)

    // Update tabindex when disabled changes
    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        this.setAttribute("tabindex", "-1")
        this.setAttribute("aria-disabled", "true")
      } else {
        this.setAttribute("tabindex", "0")
        this.removeAttribute("aria-disabled")
      }
    }

    // Apply classes directly to the custom element
    // Note: disabled: variants don't work on custom elements, so we add them explicitly
    const classes = cn(
      buttonVariants({ variant: this.variant, size: this.size }),
      this.disabled && "pointer-events-none opacity-50"
    )
    this.className = classes

    // Set data attributes
    this.dataset.slot = "button"
    this.dataset.variant = this.variant ?? "default"
    this.dataset.size = this.size ?? "default"
  }

  render() {
    // No template - content is just the children (light DOM)
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-button": PlankButton
  }
}
