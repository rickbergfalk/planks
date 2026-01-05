import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalFieldSet - groups related fields using native fieldset
 * Uses self-styled pattern with role="group" for accessibility
 */
@customElement("hal-field-set")
export class HalFieldSet extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-set"
    this.setAttribute("role", "group")
    this.className = cn(
      "flex flex-col gap-[17px]",
      "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldLegend - legend for a fieldset (self-styled)
 */
@customElement("hal-field-legend")
export class HalFieldLegend extends LitElement {
  @property({ type: String })
  variant: "legend" | "label" = "legend"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-legend"
    this.dataset.variant = this.variant
    this.className = cn(
      "block font-medium",
      "data-[variant=legend]:text-base",
      "data-[variant=label]:text-sm",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldGroup - container for grouping multiple fields
 */
@customElement("hal-field-group")
export class HalFieldGroup extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-group"
    this.className = cn(
      "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalField - individual field wrapper
 */
@customElement("hal-field")
export class HalField extends LitElement {
  @property({ type: String })
  orientation: "vertical" | "horizontal" | "responsive" = "vertical"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field"
    this.dataset.orientation = this.orientation
    this.setAttribute("role", "group")

    const baseClasses =
      "group/field flex w-full gap-3 data-[invalid=true]:text-destructive"

    const orientationClasses = {
      vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
      horizontal: [
        "flex-row items-center",
        "[&>[data-slot=field-label]]:flex-auto",
        "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ].join(" "),
      responsive: [
        "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
        "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
        "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      ].join(" "),
    }

    this.className = cn(
      baseClasses,
      orientationClasses[this.orientation],
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldContent - content area within a field
 */
@customElement("hal-field-content")
export class HalFieldContent extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-content"
    this.className = cn(
      "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldLabel - label for a field (wraps hal-label internally)
 */
@customElement("hal-field-label")
export class HalFieldLabel extends LitElement {
  @property({ type: String })
  for: string = ""

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  private _childrenMoved = false

  firstUpdated() {
    if (this._childrenMoved) return
    this._childrenMoved = true

    const label = this.querySelector("label")
    if (!label) return

    const children = [...this.childNodes].filter(
      (n) => n !== label && n.nodeType !== Node.COMMENT_NODE
    )
    children.forEach((child) => label.appendChild(child))
  }

  willUpdate() {
    this.dataset.slot = "field-label"
  }

  render() {
    return html`<label
      for=${this.for || null}
      class=${cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        this.class
      )}
    ></label>`
  }
}

/**
 * HalFieldTitle - non-label title for display
 */
@customElement("hal-field-title")
export class HalFieldTitle extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-label"
    this.className = cn(
      "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldDescription - help text for a field (self-styled)
 */
@customElement("hal-field-description")
export class HalFieldDescription extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-description"
    // Check if preceded by a legend to apply negative margin
    const precedingSibling = this.previousElementSibling
    const followsLegend =
      precedingSibling?.matches("[data-variant=legend]") ?? false

    this.className = cn(
      "block text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
      "last:mt-0 nth-last-2:-mt-1",
      followsLegend && "-mt-1.5",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalFieldSeparator - visual divider with optional text
 */
@customElement("hal-field-separator")
export class HalFieldSeparator extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  private _hasContent = false

  willUpdate() {
    this.dataset.slot = "field-separator"
    // Check if there's text content
    this._hasContent =
      this.textContent?.trim() !== "" &&
      this.textContent?.trim() !== undefined &&
      this.childNodes.length > 0
    this.dataset.content = String(this._hasContent)
    this.className = cn(
      "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
      this.class
    )
  }

  render() {
    // Get the text content before rendering
    const textContent = this.textContent?.trim() || ""

    return html`
      <hal-separator class="absolute inset-0 top-1/2"></hal-separator>
      ${textContent
        ? html`<span
            class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
            data-slot="field-separator-content"
            >${textContent}</span
          >`
        : ""}
    `
  }
}

/**
 * HalFieldError - error message display
 */
@customElement("hal-field-error")
export class HalFieldError extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "field-error"
    this.setAttribute("role", "alert")
    this.className = cn("text-destructive text-sm font-normal", this.class)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-field": HalField
    "hal-field-set": HalFieldSet
    "hal-field-legend": HalFieldLegend
    "hal-field-group": HalFieldGroup
    "hal-field-content": HalFieldContent
    "hal-field-label": HalFieldLabel
    "hal-field-title": HalFieldTitle
    "hal-field-description": HalFieldDescription
    "hal-field-separator": HalFieldSeparator
    "hal-field-error": HalFieldError
  }
}
