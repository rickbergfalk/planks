import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-table"
import type { HalTable, HalTableRow } from "@/web-components/hal-table"

describe("HalTable (Web Component)", () => {
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

  describe("HalTable", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table></hal-table>`)
      const table = container.querySelector("hal-table")
      expect(table?.dataset.slot).toBe("table")
    })

    it("creates a native table element inside", async () => {
      await renderAndWait(`<hal-table></hal-table>`)
      const table = container.querySelector("hal-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable).toBeTruthy()
    })

    it("creates a scrollable container div", async () => {
      await renderAndWait(`<hal-table></hal-table>`)
      const table = container.querySelector("hal-table")
      const containerDiv = table?.querySelector('[data-slot="table-container"]')
      expect(containerDiv).toBeTruthy()
      expect(containerDiv?.classList.contains("overflow-x-auto")).toBe(true)
    })

    it("applies custom class to native table", async () => {
      await renderAndWait(`<hal-table class="border"></hal-table>`)
      const table = container.querySelector("hal-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable?.classList.contains("border")).toBe(true)
    })
  })

  describe("HalTableHeader", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-header></hal-table-header>`)
      const header = container.querySelector("hal-table-header")
      expect(header?.dataset.slot).toBe("table-header")
    })

    it("creates a native thead element inside", async () => {
      await renderAndWait(`<hal-table-header></hal-table-header>`)
      const header = container.querySelector("hal-table-header")
      const thead = header?.querySelector("thead")
      expect(thead).toBeTruthy()
    })

    it("applies custom class to native thead", async () => {
      await renderAndWait(
        `<hal-table-header class="bg-muted"></hal-table-header>`
      )
      const header = container.querySelector("hal-table-header")
      const thead = header?.querySelector("thead")
      expect(thead?.classList.contains("bg-muted")).toBe(true)
    })
  })

  describe("HalTableBody", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-body></hal-table-body>`)
      const body = container.querySelector("hal-table-body")
      expect(body?.dataset.slot).toBe("table-body")
    })

    it("creates a native tbody element inside", async () => {
      await renderAndWait(`<hal-table-body></hal-table-body>`)
      const body = container.querySelector("hal-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody).toBeTruthy()
    })

    it("applies custom class to native tbody", async () => {
      await renderAndWait(`<hal-table-body class="divide-y"></hal-table-body>`)
      const body = container.querySelector("hal-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody?.classList.contains("divide-y")).toBe(true)
    })
  })

  describe("HalTableFooter", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-footer></hal-table-footer>`)
      const footer = container.querySelector("hal-table-footer")
      expect(footer?.dataset.slot).toBe("table-footer")
    })

    it("creates a native tfoot element inside", async () => {
      await renderAndWait(`<hal-table-footer></hal-table-footer>`)
      const footer = container.querySelector("hal-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot).toBeTruthy()
    })

    it("applies custom class to native tfoot", async () => {
      await renderAndWait(
        `<hal-table-footer class="font-bold"></hal-table-footer>`
      )
      const footer = container.querySelector("hal-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot?.classList.contains("font-bold")).toBe(true)
    })
  })

  describe("HalTableRow", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-row></hal-table-row>`)
      const row = container.querySelector("hal-table-row")
      expect(row?.dataset.slot).toBe("table-row")
    })

    it("creates a native tr element inside", async () => {
      await renderAndWait(`<hal-table-row></hal-table-row>`)
      const row = container.querySelector("hal-table-row")
      const tr = row?.querySelector("tr")
      expect(tr).toBeTruthy()
    })

    it("applies custom class to native tr", async () => {
      await renderAndWait(
        `<hal-table-row class="even:bg-muted"></hal-table-row>`
      )
      const row = container.querySelector("hal-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.classList.contains("even:bg-muted")).toBe(true)
    })

    it("sets data-state=selected when selected", async () => {
      await renderAndWait(`<hal-table-row selected></hal-table-row>`)
      const row = container.querySelector("hal-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.dataset.state).toBe("selected")
    })

    it("does not have data-state when not selected", async () => {
      await renderAndWait(`<hal-table-row></hal-table-row>`)
      const row = container.querySelector("hal-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.dataset.state).toBeUndefined()
    })

    it("updates data-state when selected changes", async () => {
      await renderAndWait(`<hal-table-row></hal-table-row>`)
      const row = container.querySelector("hal-table-row") as HalTableRow
      const tr = row?.querySelector("tr")
      expect(tr?.dataset.state).toBeUndefined()

      row.selected = true
      await row.updateComplete
      expect(tr?.dataset.state).toBe("selected")

      row.selected = false
      await row.updateComplete
      expect(tr?.dataset.state).toBeUndefined()
    })
  })

  describe("HalTableHead", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-head></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      expect(head?.dataset.slot).toBe("table-head")
    })

    it("creates a native th element inside", async () => {
      await renderAndWait(`<hal-table-head></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      const th = head?.querySelector("th")
      expect(th).toBeTruthy()
    })

    it("applies custom class to native th", async () => {
      await renderAndWait(`<hal-table-head class="w-[100px]"></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      const th = head?.querySelector("th")
      expect(th?.classList.contains("w-[100px]")).toBe(true)
    })

    it("sets colspan attribute on native th", async () => {
      await renderAndWait(`<hal-table-head colspan="3"></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      const th = head?.querySelector("th")
      expect(th?.colSpan).toBe(3)
    })

    it("sets rowspan attribute on native th", async () => {
      await renderAndWait(`<hal-table-head rowspan="2"></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      const th = head?.querySelector("th")
      expect(th?.rowSpan).toBe(2)
    })

    it("sets scope attribute on native th", async () => {
      await renderAndWait(`<hal-table-head scope="col"></hal-table-head>`)
      const head = container.querySelector("hal-table-head")
      const th = head?.querySelector("th")
      expect(th?.scope).toBe("col")
    })
  })

  describe("HalTableCell", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-cell></hal-table-cell>`)
      const cell = container.querySelector("hal-table-cell")
      expect(cell?.dataset.slot).toBe("table-cell")
    })

    it("creates a native td element inside", async () => {
      await renderAndWait(`<hal-table-cell></hal-table-cell>`)
      const cell = container.querySelector("hal-table-cell")
      const td = cell?.querySelector("td")
      expect(td).toBeTruthy()
    })

    it("applies custom class to native td", async () => {
      await renderAndWait(
        `<hal-table-cell class="text-right"></hal-table-cell>`
      )
      const cell = container.querySelector("hal-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.classList.contains("text-right")).toBe(true)
    })

    it("sets colspan attribute on native td", async () => {
      await renderAndWait(`<hal-table-cell colspan="3"></hal-table-cell>`)
      const cell = container.querySelector("hal-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.colSpan).toBe(3)
    })

    it("sets rowspan attribute on native td", async () => {
      await renderAndWait(`<hal-table-cell rowspan="2"></hal-table-cell>`)
      const cell = container.querySelector("hal-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.rowSpan).toBe(2)
    })
  })

  describe("HalTableCaption", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-table-caption></hal-table-caption>`)
      const caption = container.querySelector("hal-table-caption")
      expect(caption?.dataset.slot).toBe("table-caption")
    })

    it("creates a native caption element inside", async () => {
      await renderAndWait(`<hal-table-caption></hal-table-caption>`)
      const captionEl = container.querySelector("hal-table-caption")
      const caption = captionEl?.querySelector("caption")
      expect(caption).toBeTruthy()
    })

    it("applies custom class to native caption", async () => {
      await renderAndWait(
        `<hal-table-caption class="text-left"></hal-table-caption>`
      )
      const captionEl = container.querySelector("hal-table-caption")
      const caption = captionEl?.querySelector("caption")
      expect(caption?.classList.contains("text-left")).toBe(true)
    })
  })

  describe("Full Table Composition", () => {
    it("renders a complete table with all parts", async () => {
      await renderAndWait(`
        <hal-table>
          <hal-table-caption>A list of invoices</hal-table-caption>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head>Invoice</hal-table-head>
              <hal-table-head>Status</hal-table-head>
              <hal-table-head class="text-right">Amount</hal-table-head>
            </hal-table-row>
          </hal-table-header>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>INV001</hal-table-cell>
              <hal-table-cell>Paid</hal-table-cell>
              <hal-table-cell class="text-right">$250.00</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell>INV002</hal-table-cell>
              <hal-table-cell>Pending</hal-table-cell>
              <hal-table-cell class="text-right">$150.00</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
          <hal-table-footer>
            <hal-table-row>
              <hal-table-cell colspan="2">Total</hal-table-cell>
              <hal-table-cell class="text-right">$400.00</hal-table-cell>
            </hal-table-row>
          </hal-table-footer>
        </hal-table>
      `)

      const table = container.querySelector("hal-table")
      expect(table).toBeTruthy()

      // Check native table structure
      const nativeTable = table?.querySelector("table")
      expect(nativeTable).toBeTruthy()

      // Check thead
      const thead = nativeTable?.querySelector("thead")
      expect(thead).toBeTruthy()
      expect(thead?.querySelectorAll("th").length).toBe(3)

      // Check tbody
      const tbody = nativeTable?.querySelector("tbody")
      expect(tbody).toBeTruthy()
      expect(tbody?.querySelectorAll("tr").length).toBe(2)

      // Check tfoot
      const tfoot = nativeTable?.querySelector("tfoot")
      expect(tfoot).toBeTruthy()
      expect(tfoot?.querySelectorAll("td").length).toBe(2)

      // Check caption
      const caption = nativeTable?.querySelector("caption")
      expect(caption).toBeTruthy()
      expect(caption?.textContent).toContain("A list of invoices")
    })

    it("preserves text content inside cells", async () => {
      await renderAndWait(`
        <hal-table>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Cell Content</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `)

      const td = container.querySelector("td")
      expect(td?.textContent).toBe("Cell Content")
    })

    it("preserves text content inside header cells", async () => {
      await renderAndWait(`
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head>Header Text</hal-table-head>
            </hal-table-row>
          </hal-table-header>
        </hal-table>
      `)

      const th = container.querySelector("th")
      expect(th?.textContent).toBe("Header Text")
    })

    it("handles selected rows", async () => {
      await renderAndWait(`
        <hal-table>
          <hal-table-body>
            <hal-table-row selected>
              <hal-table-cell>Selected Row</hal-table-cell>
            </hal-table-row>
            <hal-table-row>
              <hal-table-cell>Normal Row</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `)

      const rows = container.querySelectorAll("tr")
      expect(rows[0]?.dataset.state).toBe("selected")
      expect(rows[1]?.dataset.state).toBeUndefined()
    })
  })
})
