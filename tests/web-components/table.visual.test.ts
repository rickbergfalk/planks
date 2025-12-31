import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-table"
import type { PlankTable } from "@/web-components/plank-table"

/**
 * Visual tests for PlankTable web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankTable (Web Component) - Visual", () => {
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
      "plank-table",
      "plank-table-header",
      "plank-table-body",
      "plank-table-footer",
      "plank-table-row",
      "plank-table-head",
      "plank-table-cell",
      "plank-table-caption",
    ]
    await Promise.all(
      tableElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(tableElements.join(", "))
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankTable).updateComplete)
    )
  }

  it("basic table matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head class="w-[100px]">Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head>Method</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell>Credit Card</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell>PayPal</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV003</plank-table-cell>
              <plank-table-cell>Unpaid</plank-table-cell>
              <plank-table-cell>Bank Transfer</plank-table-cell>
              <plank-table-cell class="text-right">$350.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("table-basic")
  })

  it("table with caption matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <plank-table>
          <plank-table-caption>A list of your recent invoices.</plank-table-caption>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head class="w-[100px]">Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-caption"
    )
  })

  it("table with footer matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head class="w-[100px]">Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head>Method</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell>Credit Card</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell>PayPal</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
          <plank-table-footer>
            <plank-table-row>
              <plank-table-cell colspan="3">Total</plank-table-cell>
              <plank-table-cell class="text-right">$400.00</plank-table-cell>
            </plank-table-row>
          </plank-table-footer>
        </plank-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-footer"
    )
  })

  it("table with selected row matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head class="w-[100px]">Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row selected>
              <plank-table-cell class="font-medium">INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV003</plank-table-cell>
              <plank-table-cell>Unpaid</plank-table-cell>
              <plank-table-cell class="text-right">$350.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "table-selected"
    )
  })

  it("full table demo matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 600px;">
        <plank-table>
          <plank-table-caption>A list of your recent invoices.</plank-table-caption>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head class="w-[100px]">Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head>Method</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell>Credit Card</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell>PayPal</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV003</plank-table-cell>
              <plank-table-cell>Unpaid</plank-table-cell>
              <plank-table-cell>Bank Transfer</plank-table-cell>
              <plank-table-cell class="text-right">$350.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV004</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell>Credit Card</plank-table-cell>
              <plank-table-cell class="text-right">$450.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV005</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell>PayPal</plank-table-cell>
              <plank-table-cell class="text-right">$550.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV006</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell>Bank Transfer</plank-table-cell>
              <plank-table-cell class="text-right">$200.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell class="font-medium">INV007</plank-table-cell>
              <plank-table-cell>Unpaid</plank-table-cell>
              <plank-table-cell>Credit Card</plank-table-cell>
              <plank-table-cell class="text-right">$300.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
          <plank-table-footer>
            <plank-table-row>
              <plank-table-cell colspan="3">Total</plank-table-cell>
              <plank-table-cell class="text-right">$2,500.00</plank-table-cell>
            </plank-table-row>
          </plank-table-footer>
        </plank-table>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("table-demo")
  })
})
