import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-chart"
import type {
  PlankChartContainer,
  PlankChartTooltip,
  PlankChartLegend,
} from "@/web-components/plank-chart"

describe("plank-chart-container", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("basic rendering", () => {
    it("renders with default attributes", async () => {
      container.innerHTML = `<plank-chart-container></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer
      await chart.updateComplete

      expect(chart.dataset.slot).toBe("chart")
      expect(chart.dataset.chart).toBeTruthy()
    })

    it("uses custom chart-id when provided", async () => {
      container.innerHTML = `<plank-chart-container chart-id="my-chart"></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer
      await chart.updateComplete

      expect(chart.dataset.chart).toBe("my-chart")
    })

    it("has correct styling classes", async () => {
      container.innerHTML = `<plank-chart-container></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer
      await chart.updateComplete

      expect(chart.className).toContain("flex")
      expect(chart.className).toContain("aspect-video")
      expect(chart.className).toContain("justify-center")
    })
  })

  describe("config handling", () => {
    it("generates CSS variables from config", async () => {
      container.innerHTML = `<plank-chart-container></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer

      chart.config = {
        desktop: { label: "Desktop", color: "#2563eb" },
        mobile: { label: "Mobile", color: "#60a5fa" },
      }
      await chart.updateComplete

      const styleEl = chart.querySelector("style")
      expect(styleEl).toBeTruthy()
      expect(styleEl?.textContent).toContain("--color-desktop")
      expect(styleEl?.textContent).toContain("--color-mobile")
      expect(styleEl?.textContent).toContain("#2563eb")
      expect(styleEl?.textContent).toContain("#60a5fa")
    })

    it("supports theme-based colors", async () => {
      container.innerHTML = `<plank-chart-container></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer

      chart.config = {
        revenue: {
          label: "Revenue",
          theme: { light: "#16a34a", dark: "#22c55e" },
        },
      }
      await chart.updateComplete

      const styleEl = chart.querySelector("style")
      expect(styleEl?.textContent).toContain("#16a34a")
      expect(styleEl?.textContent).toContain("#22c55e")
      expect(styleEl?.textContent).toContain(".dark")
    })

    it("does not generate style when config has no colors", async () => {
      container.innerHTML = `<plank-chart-container></plank-chart-container>`
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer

      chart.config = {
        desktop: { label: "Desktop" },
      }
      await chart.updateComplete

      const styleEl = chart.querySelector("style")
      expect(styleEl).toBeFalsy()
    })
  })

  describe("children support", () => {
    it("renders children", async () => {
      container.innerHTML = `
        <plank-chart-container>
          <div id="child-content">Chart content here</div>
        </plank-chart-container>
      `
      await customElements.whenDefined("plank-chart-container")
      const chart = container.querySelector(
        "plank-chart-container"
      )! as PlankChartContainer
      await chart.updateComplete

      const childContent = chart.querySelector("#child-content")
      expect(childContent).toBeTruthy()
      expect(childContent?.textContent).toBe("Chart content here")
    })
  })
})

describe("plank-chart-tooltip", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("basic rendering", () => {
    it("renders with default attributes", async () => {
      container.innerHTML = `<plank-chart-tooltip></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip
      await tooltip.updateComplete

      expect(tooltip.dataset.slot).toBe("chart-tooltip")
      expect(tooltip.active).toBe(false)
    })

    it("is hidden when not active", async () => {
      container.innerHTML = `<plank-chart-tooltip></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip
      await tooltip.updateComplete

      expect(tooltip.className).toContain("hidden")
    })

    it("is visible when active", async () => {
      container.innerHTML = `<plank-chart-tooltip active></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Desktop", value: 100, color: "#2563eb" }]
      await tooltip.updateComplete

      expect(tooltip.className).not.toContain("hidden")
    })
  })

  describe("content rendering", () => {
    it("renders label when provided", async () => {
      container.innerHTML = `<plank-chart-tooltip active label="January"></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Desktop", value: 100 }]
      await tooltip.updateComplete

      expect(tooltip.textContent).toContain("January")
    })

    it("hides label when hide-label is set", async () => {
      container.innerHTML = `<plank-chart-tooltip active label="January" hide-label></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Desktop", value: 100 }]
      await tooltip.updateComplete

      expect(tooltip.textContent).not.toContain("January")
    })

    it("renders items with names and values", async () => {
      container.innerHTML = `<plank-chart-tooltip active></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [
        { name: "Desktop", value: 186, color: "#2563eb" },
        { name: "Mobile", value: 80, color: "#60a5fa" },
      ]
      await tooltip.updateComplete

      expect(tooltip.textContent).toContain("Desktop")
      expect(tooltip.textContent).toContain("186")
      expect(tooltip.textContent).toContain("Mobile")
      expect(tooltip.textContent).toContain("80")
    })

    it("formats numbers with locale", async () => {
      container.innerHTML = `<plank-chart-tooltip active></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Revenue", value: 1234567 }]
      await tooltip.updateComplete

      // Should have locale-formatted number (with commas)
      expect(tooltip.textContent).toContain("1,234,567")
    })
  })

  describe("indicator styles", () => {
    it("supports dot indicator", async () => {
      container.innerHTML = `<plank-chart-tooltip active indicator="dot"></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Desktop", value: 100, color: "#2563eb" }]
      await tooltip.updateComplete

      // Look for the indicator div with background-color style
      const indicator = tooltip.querySelector('[style*="background-color"]')
      expect(indicator).toBeTruthy()
    })

    it("hides indicator when hide-indicator is set", async () => {
      container.innerHTML = `<plank-chart-tooltip active hide-indicator></plank-chart-tooltip>`
      await customElements.whenDefined("plank-chart-tooltip")
      const tooltip = container.querySelector(
        "plank-chart-tooltip"
      )! as PlankChartTooltip

      tooltip.items = [{ name: "Desktop", value: 100, color: "#2563eb" }]
      await tooltip.updateComplete

      // Should not have any indicator with background-color
      const indicator = tooltip.querySelector('[style*="background-color"]')
      expect(indicator).toBeFalsy()
    })
  })
})

describe("plank-chart-legend", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("basic rendering", () => {
    it("renders with default attributes", async () => {
      container.innerHTML = `<plank-chart-legend></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend
      await legend.updateComplete

      expect(legend.dataset.slot).toBe("chart-legend")
    })

    it("has correct styling classes for bottom align", async () => {
      container.innerHTML = `<plank-chart-legend></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend
      await legend.updateComplete

      expect(legend.className).toContain("pt-3")
    })

    it("has correct styling classes for top align", async () => {
      container.innerHTML = `<plank-chart-legend vertical-align="top"></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend
      await legend.updateComplete

      expect(legend.className).toContain("pb-3")
    })
  })

  describe("items rendering", () => {
    it("renders items with names", async () => {
      container.innerHTML = `<plank-chart-legend></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend

      legend.items = [
        { name: "Desktop", color: "#2563eb" },
        { name: "Mobile", color: "#60a5fa" },
      ]
      await legend.updateComplete

      expect(legend.textContent).toContain("Desktop")
      expect(legend.textContent).toContain("Mobile")
    })

    it("renders color indicators", async () => {
      container.innerHTML = `<plank-chart-legend></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend

      legend.items = [{ name: "Desktop", color: "#2563eb" }]
      await legend.updateComplete

      const colorBox = legend.querySelector('[class*="h-2"]')
      expect(colorBox).toBeTruthy()
      expect((colorBox as HTMLElement).style.backgroundColor).toBeTruthy()
    })

    it("hides icon when hide-icon is set", async () => {
      container.innerHTML = `<plank-chart-legend hide-icon></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend

      legend.items = [{ name: "Desktop", color: "#2563eb" }]
      await legend.updateComplete

      const colorBox = legend.querySelector('[class*="h-2"]')
      expect(colorBox).toBeFalsy()
    })

    it("renders nothing when items is empty", async () => {
      container.innerHTML = `<plank-chart-legend></plank-chart-legend>`
      await customElements.whenDefined("plank-chart-legend")
      const legend = container.querySelector(
        "plank-chart-legend"
      )! as PlankChartLegend
      await legend.updateComplete

      expect(legend.children.length).toBe(0)
    })
  })
})
