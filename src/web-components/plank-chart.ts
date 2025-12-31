import { LitElement, html, PropertyValues, nothing } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

export type ChartConfig = {
  [key: string]: {
    label?: string
    color?: string
    theme?: { light: string; dark: string }
  }
}

/**
 * plank-chart-container: Container for charts with theming and responsive sizing
 *
 * This component provides:
 * - CSS custom properties for chart colors based on config
 * - Responsive container that fills parent width
 * - Consistent styling for chart elements
 *
 * Note: Unlike the React version which uses Recharts, this web component
 * is library-agnostic. You can use any charting library (Chart.js, D3, ApexCharts, etc.)
 * inside this container and reference the CSS custom properties for colors.
 *
 * @example
 * ```html
 * <plank-chart-container id="my-chart" config='{"desktop": {"label": "Desktop", "color": "#2563eb"}}'>
 *   <!-- Your chart library content goes here -->
 * </plank-chart-container>
 * ```
 */
@customElement("plank-chart-container")
export class PlankChartContainer extends LitElement {
  @property({ type: String, attribute: "chart-id" }) chartId?: string
  @property({ type: Object }) config: ChartConfig = {}

  private _generatedId: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._generatedId = `chart-${Math.random().toString(36).slice(2, 11)}`
  }

  willUpdate() {
    const id = this.chartId || this._generatedId
    this.className = cn(
      "flex aspect-video justify-center text-xs",
      // Chart element styling
      "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
      "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
      "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
      "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
      "[&_.recharts-radial-bar-background-sector]:fill-muted",
      "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
      "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
      "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-layer]:outline-hidden",
      "[&_.recharts-sector]:outline-hidden",
      "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
      "[&_.recharts-surface]:outline-hidden",
      this.className
    )
    this.dataset.slot = "chart"
    this.dataset.chart = id
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("config")) {
      this._updateStyles()
    }
  }

  firstUpdated() {
    this._updateStyles()
  }

  private _updateStyles() {
    const id = this.chartId || this._generatedId

    // Remove existing style element if any
    const existingStyle = this.querySelector(`style[data-chart-style="${id}"]`)
    if (existingStyle) {
      existingStyle.remove()
    }

    // Generate CSS for color variables
    const colorConfig = Object.entries(this.config).filter(
      ([, cfg]) => cfg.theme || cfg.color
    )

    if (colorConfig.length === 0) {
      return
    }

    const lightColors = colorConfig
      .map(([key, cfg]) => {
        const color = cfg.theme?.light || cfg.color
        return color ? `  --color-${key}: ${color};` : null
      })
      .filter(Boolean)
      .join("\n")

    const darkColors = colorConfig
      .map(([key, cfg]) => {
        const color = cfg.theme?.dark || cfg.color
        return color ? `  --color-${key}: ${color};` : null
      })
      .filter(Boolean)
      .join("\n")

    const styleContent = `
[data-chart=${id}] {
${lightColors}
}

.dark [data-chart=${id}] {
${darkColors}
}
`

    const styleEl = document.createElement("style")
    styleEl.setAttribute("data-chart-style", id)
    styleEl.textContent = styleContent
    this.prepend(styleEl)
  }

  render() {
    return html``
  }
}

/**
 * plank-chart-tooltip: Tooltip component for charts
 * Can be used standalone or positioned by your charting library
 */
@customElement("plank-chart-tooltip")
export class PlankChartTooltip extends LitElement {
  @property({ type: Boolean }) active = false
  @property({ type: String }) label?: string
  @property({ type: Array }) items: Array<{
    name: string
    value: string | number
    color?: string
    icon?: string
  }> = []
  @property({ type: String }) indicator: "dot" | "line" | "dashed" = "dot"
  @property({ type: Boolean, attribute: "hide-label" }) hideLabel = false
  @property({ type: Boolean, attribute: "hide-indicator" }) hideIndicator =
    false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
      !this.active && "hidden",
      this.className
    )
    this.dataset.slot = "chart-tooltip"
  }

  render() {
    if (!this.active || this.items.length === 0) {
      return nothing
    }

    return html`
      ${!this.hideLabel && this.label
        ? html`<div class="font-medium">${this.label}</div>`
        : nothing}
      <div class="grid gap-1.5">
        ${this.items.map(
          (item) => html`
            <div
              class=${cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                this.indicator === "dot" && "items-center"
              )}
            >
              ${!this.hideIndicator
                ? html`<div
                    class=${cn("shrink-0 rounded-[2px]", {
                      "h-2.5 w-2.5": this.indicator === "dot",
                      "w-1": this.indicator === "line",
                      "w-0 border-[1.5px] border-dashed bg-transparent":
                        this.indicator === "dashed",
                    })}
                    style="background-color: ${item.color || "currentColor"}"
                  ></div>`
                : nothing}
              <div
                class="flex flex-1 justify-between items-center leading-none"
              >
                <span class="text-muted-foreground">${item.name}</span>
                <span class="text-foreground font-mono font-medium tabular-nums"
                  >${typeof item.value === "number"
                    ? item.value.toLocaleString()
                    : item.value}</span
                >
              </div>
            </div>
          `
        )}
      </div>
    `
  }
}

/**
 * plank-chart-legend: Legend component for charts
 */
@customElement("plank-chart-legend")
export class PlankChartLegend extends LitElement {
  @property({ type: Array }) items: Array<{
    name: string
    color?: string
  }> = []
  @property({ type: String, attribute: "vertical-align" }) verticalAlign:
    | "top"
    | "bottom" = "bottom"
  @property({ type: Boolean, attribute: "hide-icon" }) hideIcon = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "flex items-center justify-center gap-4",
      this.verticalAlign === "top" ? "pb-3" : "pt-3",
      this.className
    )
    this.dataset.slot = "chart-legend"
  }

  render() {
    if (this.items.length === 0) {
      return nothing
    }

    return html`${this.items.map(
      (item) => html`
        <div
          class=${cn(
            "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
          )}
        >
          ${!this.hideIcon
            ? html`<div
                class="h-2 w-2 shrink-0 rounded-[2px]"
                style="background-color: ${item.color || "currentColor"}"
              ></div>`
            : nothing}
          <span class="text-sm">${item.name}</span>
        </div>
      `
    )}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-chart-container": PlankChartContainer
    "plank-chart-tooltip": PlankChartTooltip
    "plank-chart-legend": PlankChartLegend
  }
}
