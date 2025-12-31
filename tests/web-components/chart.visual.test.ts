import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-chart"
import type {
  PlankChartTooltip,
  PlankChartLegend,
} from "@/web-components/plank-chart"

describe("plank-chart visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("matches chart tooltip appearance", async () => {
    container.innerHTML = `
      <div style="padding: 20px;">
        <plank-chart-tooltip active label="January"></plank-chart-tooltip>
      </div>
    `
    await customElements.whenDefined("plank-chart-tooltip")
    const tooltip = container.querySelector(
      "plank-chart-tooltip"
    )! as PlankChartTooltip

    tooltip.items = [
      { name: "Desktop", value: 186, color: "#2563eb" },
      { name: "Mobile", value: 80, color: "#60a5fa" },
    ]
    await tooltip.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/chart-tooltip-chromium.png`
    )
  })

  it("matches chart legend appearance", async () => {
    container.innerHTML = `
      <div style="padding: 20px;">
        <plank-chart-legend></plank-chart-legend>
      </div>
    `
    await customElements.whenDefined("plank-chart-legend")
    const legend = container.querySelector(
      "plank-chart-legend"
    )! as PlankChartLegend

    legend.items = [
      { name: "Desktop", color: "#2563eb" },
      { name: "Mobile", color: "#60a5fa" },
      { name: "Tablet", color: "#8b5cf6" },
    ]
    await legend.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/chart-legend-chromium.png`
    )
  })

  it("matches chart container with simple content", async () => {
    container.innerHTML = `
      <div style="padding: 20px; width: 400px;">
        <plank-chart-container chart-id="demo-chart">
          <div style="width: 100%; height: 200px; display: flex; align-items: flex-end; gap: 8px;">
            <div style="width: 40px; height: 80%; background: var(--color-desktop, #2563eb); border-radius: 4px;"></div>
            <div style="width: 40px; height: 60%; background: var(--color-mobile, #60a5fa); border-radius: 4px;"></div>
            <div style="width: 40px; height: 90%; background: var(--color-desktop, #2563eb); border-radius: 4px;"></div>
            <div style="width: 40px; height: 40%; background: var(--color-mobile, #60a5fa); border-radius: 4px;"></div>
          </div>
        </plank-chart-container>
      </div>
    `
    await customElements.whenDefined("plank-chart-container")
    const chart = container.querySelector("plank-chart-container")! as any

    chart.config = {
      desktop: { label: "Desktop", color: "#2563eb" },
      mobile: { label: "Mobile", color: "#60a5fa" },
    }
    await chart.updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(container).toMatchFileSnapshot(
      `__snapshots__/chart-container-chromium.png`
    )
  })
})
