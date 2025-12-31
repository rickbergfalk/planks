import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-table"
import type { PlankTable, PlankTableRow } from "@/web-components/plank-table"

describe("PlankTable (Web Component)", () => {
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
      Array.from(elements).map(
        (el) => (el as PlankTable).updateComplete
      )
    )
  }

  describe("PlankTable", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table></plank-table>`)
      const table = container.querySelector("plank-table")
      expect(table?.dataset.slot).toBe("table")
    })

    it("creates a native table element inside", async () => {
      await renderAndWait(`<plank-table></plank-table>`)
      const table = container.querySelector("plank-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable).toBeTruthy()
    })

    it("creates a scrollable container div", async () => {
      await renderAndWait(`<plank-table></plank-table>`)
      const table = container.querySelector("plank-table")
      const containerDiv = table?.querySelector('[data-slot="table-container"]')
      expect(containerDiv).toBeTruthy()
      expect(containerDiv?.classList.contains("overflow-x-auto")).toBe(true)
    })

    it("applies custom class to native table", async () => {
      await renderAndWait(`<plank-table class="border"></plank-table>`)
      const table = container.querySelector("plank-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable?.classList.contains("border")).toBe(true)
    })
  })

  describe("PlankTableHeader", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-header></plank-table-header>`)
      const header = container.querySelector("plank-table-header")
      expect(header?.dataset.slot).toBe("table-header")
    })

    it("creates a native thead element inside", async () => {
      await renderAndWait(`<plank-table-header></plank-table-header>`)
      const header = container.querySelector("plank-table-header")
      const thead = header?.querySelector("thead")
      expect(thead).toBeTruthy()
    })

    it("applies custom class to native thead", async () => {
      await renderAndWait(
        `<plank-table-header class="bg-muted"></plank-table-header>`
      )
      const header = container.querySelector("plank-table-header")
      const thead = header?.querySelector("thead")
      expect(thead?.classList.contains("bg-muted")).toBe(true)
    })
  })

  describe("PlankTableBody", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-body></plank-table-body>`)
      const body = container.querySelector("plank-table-body")
      expect(body?.dataset.slot).toBe("table-body")
    })

    it("creates a native tbody element inside", async () => {
      await renderAndWait(`<plank-table-body></plank-table-body>`)
      const body = container.querySelector("plank-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody).toBeTruthy()
    })

    it("applies custom class to native tbody", async () => {
      await renderAndWait(
        `<plank-table-body class="divide-y"></plank-table-body>`
      )
      const body = container.querySelector("plank-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody?.classList.contains("divide-y")).toBe(true)
    })
  })

  describe("PlankTableFooter", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-footer></plank-table-footer>`)
      const footer = container.querySelector("plank-table-footer")
      expect(footer?.dataset.slot).toBe("table-footer")
    })

    it("creates a native tfoot element inside", async () => {
      await renderAndWait(`<plank-table-footer></plank-table-footer>`)
      const footer = container.querySelector("plank-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot).toBeTruthy()
    })

    it("applies custom class to native tfoot", async () => {
      await renderAndWait(
        `<plank-table-footer class="font-bold"></plank-table-footer>`
      )
      const footer = container.querySelector("plank-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot?.classList.contains("font-bold")).toBe(true)
    })
  })

  describe("PlankTableRow", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-row></plank-table-row>`)
      const row = container.querySelector("plank-table-row")
      expect(row?.dataset.slot).toBe("table-row")
    })

    it("creates a native tr element inside", async () => {
      await renderAndWait(`<plank-table-row></plank-table-row>`)
      const row = container.querySelector("plank-table-row")
      const tr = row?.querySelector("tr")
      expect(tr).toBeTruthy()
    })

    it("applies custom class to native tr", async () => {
      await renderAndWait(
        `<plank-table-row class="even:bg-muted"></plank-table-row>`
      )
      const row = container.querySelector("plank-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.classList.contains("even:bg-muted")).toBe(true)
    })

    it("sets data-state=selected when selected", async () => {
      await renderAndWait(`<plank-table-row selected></plank-table-row>`)
      const row = container.querySelector("plank-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.dataset.state).toBe("selected")
    })

    it("does not have data-state when not selected", async () => {
      await renderAndWait(`<plank-table-row></plank-table-row>`)
      const row = container.querySelector("plank-table-row")
      const tr = row?.querySelector("tr")
      expect(tr?.dataset.state).toBeUndefined()
    })

    it("updates data-state when selected changes", async () => {
      await renderAndWait(`<plank-table-row></plank-table-row>`)
      const row = container.querySelector("plank-table-row") as PlankTableRow
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

  describe("PlankTableHead", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-head></plank-table-head>`)
      const head = container.querySelector("plank-table-head")
      expect(head?.dataset.slot).toBe("table-head")
    })

    it("creates a native th element inside", async () => {
      await renderAndWait(`<plank-table-head></plank-table-head>`)
      const head = container.querySelector("plank-table-head")
      const th = head?.querySelector("th")
      expect(th).toBeTruthy()
    })

    it("applies custom class to native th", async () => {
      await renderAndWait(
        `<plank-table-head class="w-[100px]"></plank-table-head>`
      )
      const head = container.querySelector("plank-table-head")
      const th = head?.querySelector("th")
      expect(th?.classList.contains("w-[100px]")).toBe(true)
    })

    it("sets colspan attribute on native th", async () => {
      await renderAndWait(`<plank-table-head colspan="3"></plank-table-head>`)
      const head = container.querySelector("plank-table-head")
      const th = head?.querySelector("th")
      expect(th?.colSpan).toBe(3)
    })

    it("sets rowspan attribute on native th", async () => {
      await renderAndWait(`<plank-table-head rowspan="2"></plank-table-head>`)
      const head = container.querySelector("plank-table-head")
      const th = head?.querySelector("th")
      expect(th?.rowSpan).toBe(2)
    })

    it("sets scope attribute on native th", async () => {
      await renderAndWait(`<plank-table-head scope="col"></plank-table-head>`)
      const head = container.querySelector("plank-table-head")
      const th = head?.querySelector("th")
      expect(th?.scope).toBe("col")
    })
  })

  describe("PlankTableCell", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-cell></plank-table-cell>`)
      const cell = container.querySelector("plank-table-cell")
      expect(cell?.dataset.slot).toBe("table-cell")
    })

    it("creates a native td element inside", async () => {
      await renderAndWait(`<plank-table-cell></plank-table-cell>`)
      const cell = container.querySelector("plank-table-cell")
      const td = cell?.querySelector("td")
      expect(td).toBeTruthy()
    })

    it("applies custom class to native td", async () => {
      await renderAndWait(
        `<plank-table-cell class="text-right"></plank-table-cell>`
      )
      const cell = container.querySelector("plank-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.classList.contains("text-right")).toBe(true)
    })

    it("sets colspan attribute on native td", async () => {
      await renderAndWait(`<plank-table-cell colspan="3"></plank-table-cell>`)
      const cell = container.querySelector("plank-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.colSpan).toBe(3)
    })

    it("sets rowspan attribute on native td", async () => {
      await renderAndWait(`<plank-table-cell rowspan="2"></plank-table-cell>`)
      const cell = container.querySelector("plank-table-cell")
      const td = cell?.querySelector("td")
      expect(td?.rowSpan).toBe(2)
    })
  })

  describe("PlankTableCaption", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-table-caption></plank-table-caption>`)
      const caption = container.querySelector("plank-table-caption")
      expect(caption?.dataset.slot).toBe("table-caption")
    })

    it("creates a native caption element inside", async () => {
      await renderAndWait(`<plank-table-caption></plank-table-caption>`)
      const captionEl = container.querySelector("plank-table-caption")
      const caption = captionEl?.querySelector("caption")
      expect(caption).toBeTruthy()
    })

    it("applies custom class to native caption", async () => {
      await renderAndWait(
        `<plank-table-caption class="text-left"></plank-table-caption>`
      )
      const captionEl = container.querySelector("plank-table-caption")
      const caption = captionEl?.querySelector("caption")
      expect(caption?.classList.contains("text-left")).toBe(true)
    })
  })

  describe("Full Table Composition", () => {
    it("renders a complete table with all parts", async () => {
      await renderAndWait(`
        <plank-table>
          <plank-table-caption>A list of invoices</plank-table-caption>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head>Invoice</plank-table-head>
              <plank-table-head>Status</plank-table-head>
              <plank-table-head class="text-right">Amount</plank-table-head>
            </plank-table-row>
          </plank-table-header>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>INV001</plank-table-cell>
              <plank-table-cell>Paid</plank-table-cell>
              <plank-table-cell class="text-right">$250.00</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell>INV002</plank-table-cell>
              <plank-table-cell>Pending</plank-table-cell>
              <plank-table-cell class="text-right">$150.00</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
          <plank-table-footer>
            <plank-table-row>
              <plank-table-cell colspan="2">Total</plank-table-cell>
              <plank-table-cell class="text-right">$400.00</plank-table-cell>
            </plank-table-row>
          </plank-table-footer>
        </plank-table>
      `)

      const table = container.querySelector("plank-table")
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
        <plank-table>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>Cell Content</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `)

      const td = container.querySelector("td")
      expect(td?.textContent).toBe("Cell Content")
    })

    it("preserves text content inside header cells", async () => {
      await renderAndWait(`
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head>Header Text</plank-table-head>
            </plank-table-row>
          </plank-table-header>
        </plank-table>
      `)

      const th = container.querySelector("th")
      expect(th?.textContent).toBe("Header Text")
    })

    it("handles selected rows", async () => {
      await renderAndWait(`
        <plank-table>
          <plank-table-body>
            <plank-table-row selected>
              <plank-table-cell>Selected Row</plank-table-cell>
            </plank-table-row>
            <plank-table-row>
              <plank-table-cell>Normal Row</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `)

      const rows = container.querySelectorAll("tr")
      expect(rows[0]?.dataset.state).toBe("selected")
      expect(rows[1]?.dataset.state).toBeUndefined()
    })
  })
})
