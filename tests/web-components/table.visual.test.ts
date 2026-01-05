import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-table"
import type { HalTable } from "@/web-components/hal-table"

/**
 * Visual tests for HalTable web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalTable (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    const tableElements = [
      "hal-table",
      "hal-table-header",
      "hal-table-body",
      "hal-table-footer",
      "hal-table-row",
      "hal-table-head",
      "hal-table-cell",
      "hal-table-caption",
    ]
    await Promise.all(
      tableElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(tableElements.join(", "))
    await Promise.all(
      Array.from(elements).map((el) => (el as HalTable).updateComplete)
    )
  }

  it("basic table matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head class="w-[100px]">Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head>Method</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell>Credit Card</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell>PayPal</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV003</hal-table-cell>
              <hal-table-cell>Unpaid</hal-table-cell>
              <hal-table-cell>Bank Transfer</hal-table-cell>
              <hal-table-cell class="text-right">$350.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("table-basic")
  })

  it("table with caption matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <hal-table>
          <hal-table-caption>A list of your recent invoices.</hal-table-caption>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head class="w-[100px]">Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-caption"
    )
  })

  it("table with footer matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head class="w-[100px]">Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head>Method</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell>Credit Card</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell>PayPal</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
          <hal-table-footer>
            <hal-table-row>
              <hal-table-cell colspan="3">Total</hal-table-cell>
              <hal-table-cell class="text-right">$400.00</hal-table-cell>
            </hal-table-row>
          </hal-table-footer>
        </hal-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-footer"
    )
  })

  it("table with selected row matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head class="w-[100px]">Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row selected>
              <hal-table-cell class="font-medium">INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV003</hal-table-cell>
              <hal-table-cell>Unpaid</hal-table-cell>
              <hal-table-cell class="text-right">$350.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-selected"
    )
  })

  it("full table demo matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <hal-table>
          <hal-table-caption>A list of your recent invoices.</hal-table-caption>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head class="w-[100px]">Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head>Method</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell>Credit Card</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell>PayPal</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV003</hal-table-cell>
              <hal-table-cell>Unpaid</hal-table-cell>
              <hal-table-cell>Bank Transfer</hal-table-cell>
              <hal-table-cell class="text-right">$350.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV004</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell>Credit Card</hal-table-cell>
              <hal-table-cell class="text-right">$450.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV005</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell>PayPal</hal-table-cell>
              <hal-table-cell class="text-right">$550.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV006</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell>Bank Transfer</hal-table-cell>
              <hal-table-cell class="text-right">$200.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell class="font-medium">INV007</hal-table-cell>
              <hal-table-cell>Unpaid</hal-table-cell>
              <hal-table-cell>Credit Card</hal-table-cell>
              <hal-table-cell class="text-right">$300.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
          <hal-table-footer>
            <hal-table-row>
              <hal-table-cell colspan="3">Total</hal-table-cell>
              <hal-table-cell class="text-right">$2,500.00</hal-table-cell>
            </hal-table-row>
          </hal-table-footer>
        </hal-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("table-demo")
  })
})
