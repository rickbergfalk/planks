import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalTable - A styled table container
 *
 * Wraps content in a scrollable container and a native <table> element.
 * Children must be hal-table-header, hal-table-body, hal-table-footer,
 * or hal-table-caption components.
 */
@customElement("hal-table")
export class HalTable extends LitElement {
  @property({ type: String })
  class: string = ""

  private _tableEl: HTMLTableElement | null = null
  private _containerEl: HTMLDivElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table"
  }

  firstUpdated() {
    this._setupTable()
  }

  private _setupTable() {
    // Create container div for scrolling
    this._containerEl = document.createElement("div")
    this._containerEl.dataset.slot = "table-container"
    this._containerEl.className = "relative w-full overflow-x-auto"

    // Create native table element
    this._tableEl = document.createElement("table")
    this._tableEl.dataset.slot = "table"
    this._tableEl.className = cn("w-full caption-bottom text-sm", this.class)

    // Move children into the table
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._containerEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._tableEl!.appendChild(child))

    this._containerEl.appendChild(this._tableEl)
    this.appendChild(this._containerEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableHeader - Table header section (<thead>)
 */
@customElement("hal-table-header")
export class HalTableHeader extends LitElement {
  @property({ type: String })
  class: string = ""

  private _theadEl: HTMLTableSectionElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-header"
  }

  firstUpdated() {
    this._setupThead()
  }

  private _setupThead() {
    this._theadEl = document.createElement("thead")
    this._theadEl.dataset.slot = "table-header"
    this._theadEl.className = cn("[&_tr]:border-b", this.class)

    // Move children into thead
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._theadEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._theadEl!.appendChild(child))

    this.appendChild(this._theadEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableBody - Table body section (<tbody>)
 */
@customElement("hal-table-body")
export class HalTableBody extends LitElement {
  @property({ type: String })
  class: string = ""

  private _tbodyEl: HTMLTableSectionElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-body"
  }

  firstUpdated() {
    this._setupTbody()
  }

  private _setupTbody() {
    this._tbodyEl = document.createElement("tbody")
    this._tbodyEl.dataset.slot = "table-body"
    // Use :last-child > tr since tr is inside hal-table-row (with display:contents)
    this._tbodyEl.className = cn("[&>:last-child_tr]:border-0", this.class)

    // Move children into tbody
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._tbodyEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._tbodyEl!.appendChild(child))

    this.appendChild(this._tbodyEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableFooter - Table footer section (<tfoot>)
 */
@customElement("hal-table-footer")
export class HalTableFooter extends LitElement {
  @property({ type: String })
  class: string = ""

  private _tfootEl: HTMLTableSectionElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-footer"
  }

  firstUpdated() {
    this._setupTfoot()
  }

  private _setupTfoot() {
    this._tfootEl = document.createElement("tfoot")
    this._tfootEl.dataset.slot = "table-footer"
    // Use :last-child_tr since tr is inside hal-table-row (with display:contents)
    this._tfootEl.className = cn(
      "bg-muted/50 border-t font-medium [&>:last-child_tr]:border-b-0",
      this.class
    )

    // Move children into tfoot
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._tfootEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._tfootEl!.appendChild(child))

    this.appendChild(this._tfootEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableRow - Table row (<tr>)
 */
@customElement("hal-table-row")
export class HalTableRow extends LitElement {
  @property({ type: String })
  class: string = ""

  @property({ type: Boolean, reflect: true })
  selected: boolean = false

  private _trEl: HTMLTableRowElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-row"
  }

  firstUpdated() {
    this._setupRow()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("selected") && this._trEl) {
      if (this.selected) {
        this._trEl.dataset.state = "selected"
      } else {
        delete this._trEl.dataset.state
      }
    }
  }

  private _setupRow() {
    this._trEl = document.createElement("tr")
    this._trEl.dataset.slot = "table-row"
    this._trEl.className = cn(
      "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
      this.class
    )

    if (this.selected) {
      this._trEl.dataset.state = "selected"
    }

    // Move children into tr
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._trEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._trEl!.appendChild(child))

    this.appendChild(this._trEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableHead - Table header cell (<th>)
 */
@customElement("hal-table-head")
export class HalTableHead extends LitElement {
  @property({ type: String })
  class: string = ""

  @property({ type: Number })
  colspan: number | undefined

  @property({ type: Number })
  rowspan: number | undefined

  @property({ type: String })
  scope: string | undefined

  private _thEl: HTMLTableCellElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-head"
  }

  firstUpdated() {
    this._setupHead()
  }

  private _setupHead() {
    this._thEl = document.createElement("th")
    this._thEl.dataset.slot = "table-head"
    this._thEl.className = cn(
      "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      this.class
    )

    if (this.colspan !== undefined) {
      this._thEl.colSpan = this.colspan
    }
    if (this.rowspan !== undefined) {
      this._thEl.rowSpan = this.rowspan
    }
    if (this.scope) {
      this._thEl.scope = this.scope
    }

    // Move children into th
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._thEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._thEl!.appendChild(child))

    this.appendChild(this._thEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableCell - Table data cell (<td>)
 */
@customElement("hal-table-cell")
export class HalTableCell extends LitElement {
  @property({ type: String })
  class: string = ""

  @property({ type: Number })
  colspan: number | undefined

  @property({ type: Number })
  rowspan: number | undefined

  private _tdEl: HTMLTableCellElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-cell"
  }

  firstUpdated() {
    this._setupCell()
  }

  private _setupCell() {
    this._tdEl = document.createElement("td")
    this._tdEl.dataset.slot = "table-cell"
    this._tdEl.className = cn(
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      this.class
    )

    if (this.colspan !== undefined) {
      this._tdEl.colSpan = this.colspan
    }
    if (this.rowspan !== undefined) {
      this._tdEl.rowSpan = this.rowspan
    }

    // Move children into td
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._tdEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._tdEl!.appendChild(child))

    this.appendChild(this._tdEl)
  }

  render() {
    return html``
  }
}

/**
 * HalTableCaption - Table caption (<caption>)
 */
@customElement("hal-table-caption")
export class HalTableCaption extends LitElement {
  @property({ type: String })
  class: string = ""

  private _captionEl: HTMLTableCaptionElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Use display: contents so this element is invisible to table layout
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "table-caption"
  }

  firstUpdated() {
    this._setupCaption()
  }

  private _setupCaption() {
    this._captionEl = document.createElement("caption")
    this._captionEl.dataset.slot = "table-caption"
    this._captionEl.className = cn(
      "text-muted-foreground mt-4 text-sm",
      this.class
    )

    // Move children into caption
    const children = [...this.childNodes].filter(
      (n) =>
        n !== this._captionEl &&
        n.nodeType !== Node.COMMENT_NODE &&
        !(n.nodeType === Node.TEXT_NODE && !n.textContent?.trim())
    )
    children.forEach((child) => this._captionEl!.appendChild(child))

    this.appendChild(this._captionEl)
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-table": HalTable
    "hal-table-header": HalTableHeader
    "hal-table-body": HalTableBody
    "hal-table-footer": HalTableFooter
    "hal-table-row": HalTableRow
    "hal-table-head": HalTableHead
    "hal-table-cell": HalTableCell
    "hal-table-caption": HalTableCaption
  }
}
