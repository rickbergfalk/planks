import { LitElement, html, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalCalendar - A date picker calendar component
 *
 * Supports single date selection, multiple date selection, and date range selection.
 * Provides full keyboard navigation and accessibility support.
 *
 * @fires date-select - Fired when a date is selected (single mode)
 * @fires dates-select - Fired when dates change (multiple mode)
 * @fires range-select - Fired when range changes (range mode)
 */
@customElement("hal-calendar")
export class HalCalendar extends LitElement {
  /** Selection mode: single, multiple, or range */
  @property({ type: String })
  mode: "single" | "multiple" | "range" = "single"

  /** Selected date (single mode) - ISO date string YYYY-MM-DD */
  @property({ type: String })
  selected: string = ""

  /** Selected dates (multiple mode) - comma-separated ISO date strings */
  @property({ type: String, attribute: "selected-dates" })
  selectedDates: string = ""

  /** Range start date (range mode) - ISO date string */
  @property({ type: String, attribute: "range-start" })
  rangeStart: string = ""

  /** Range end date (range mode) - ISO date string */
  @property({ type: String, attribute: "range-end" })
  rangeEnd: string = ""

  /** Minimum selectable date - ISO date string */
  @property({ type: String, attribute: "min-date" })
  minDate: string = ""

  /** Maximum selectable date - ISO date string */
  @property({ type: String, attribute: "max-date" })
  maxDate: string = ""

  /** Show days from adjacent months */
  @property({
    type: Boolean,
    attribute: "show-outside-days",
    converter: {
      fromAttribute: (value) => value !== "false",
      toAttribute: (value) => (value ? "" : "false"),
    },
  })
  showOutsideDays: boolean = true

  /** Number of months to display */
  @property({ type: Number, attribute: "number-of-months" })
  numberOfMonths: number = 1

  /** First day of week (0 = Sunday, 1 = Monday, etc.) */
  @property({ type: Number, attribute: "week-starts-on" })
  weekStartsOn: number = 0

  /** Initial month to display - ISO date string */
  @property({ type: String, attribute: "default-month" })
  defaultMonth: string = ""

  /** Show dropdown for month/year selection */
  @property({ type: String, attribute: "caption-layout" })
  captionLayout: "label" | "dropdown" = "label"

  /** Custom class for styling */
  @property({ type: String })
  class: string = ""

  /** Currently displayed month (internal state) */
  @state()
  private _displayDate: Date = new Date()

  /** Currently focused date for keyboard navigation */
  @state()
  private _focusedDate: Date | null = null

  /** Hover date for range preview */
  @state()
  private _hoverDate: Date | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "block"

    // Initialize display date
    if (this.defaultMonth) {
      this._displayDate = this._parseDate(this.defaultMonth) || new Date()
    } else if (this.selected) {
      this._displayDate = this._parseDate(this.selected) || new Date()
    } else if (this.rangeStart) {
      this._displayDate = this._parseDate(this.rangeStart) || new Date()
    }

    // Reset to first of month
    this._displayDate = new Date(
      this._displayDate.getFullYear(),
      this._displayDate.getMonth(),
      1
    )
  }

  willUpdate() {
    this.dataset.slot = "calendar"
  }

  private _parseDate(dateStr: string): Date | null {
    if (!dateStr) return null
    const date = new Date(dateStr + "T00:00:00")
    return isNaN(date.getTime()) ? null : date
  }

  private _formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  private _isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  private _isToday(date: Date): boolean {
    return this._isSameDay(date, new Date())
  }

  private _isSelected(date: Date): boolean {
    if (this.mode === "single" && this.selected) {
      const selectedDate = this._parseDate(this.selected)
      return selectedDate ? this._isSameDay(date, selectedDate) : false
    }
    if (this.mode === "multiple" && this.selectedDates) {
      const dates = this.selectedDates
        .split(",")
        .map((d) => this._parseDate(d.trim()))
      return dates.some((d) => d && this._isSameDay(date, d))
    }
    if (this.mode === "range") {
      const start = this._parseDate(this.rangeStart)
      const end = this._parseDate(this.rangeEnd)
      if (start && this._isSameDay(date, start)) return true
      if (end && this._isSameDay(date, end)) return true
    }
    return false
  }

  private _isRangeStart(date: Date): boolean {
    if (this.mode !== "range") return false
    const start = this._parseDate(this.rangeStart)
    return start ? this._isSameDay(date, start) : false
  }

  private _isRangeEnd(date: Date): boolean {
    if (this.mode !== "range") return false
    const end = this._parseDate(this.rangeEnd)
    return end ? this._isSameDay(date, end) : false
  }

  private _isInRange(date: Date): boolean {
    if (this.mode !== "range") return false
    const start = this._parseDate(this.rangeStart)
    let end = this._parseDate(this.rangeEnd)

    // Use hover date for preview if we have start but not end
    if (start && !end && this._hoverDate) {
      end = this._hoverDate
    }

    if (!start || !end) return false

    const dateTime = date.getTime()
    const startTime = start.getTime()
    const endTime = end.getTime()

    const minTime = Math.min(startTime, endTime)
    const maxTime = Math.max(startTime, endTime)

    return dateTime > minTime && dateTime < maxTime
  }

  private _isDisabled(date: Date): boolean {
    if (this.minDate) {
      const min = this._parseDate(this.minDate)
      if (min && date < min) return true
    }
    if (this.maxDate) {
      const max = this._parseDate(this.maxDate)
      if (max && date > max) return true
    }
    return false
  }

  private _isOutsideMonth(date: Date, displayMonth: Date): boolean {
    return date.getMonth() !== displayMonth.getMonth()
  }

  private _getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }

  private _getMonthDays(displayDate: Date): Date[][] {
    const year = displayDate.getFullYear()
    const month = displayDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const lastDayOfMonth = lastDay.getDate()

    // Adjust for week start day
    let startOffset = firstDay.getDay() - this.weekStartsOn
    if (startOffset < 0) startOffset += 7

    const days: Date[][] = []
    const currentDate = new Date(year, month, 1 - startOffset)

    // Generate weeks until we've covered the month
    while (true) {
      const weekDays: Date[] = []
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      days.push(weekDays)

      // Stop if this week contains the last day of the month
      // Check if any day in this week is the last day of the target month
      const hasLastDay = weekDays.some(
        (d) => d.getMonth() === month && d.getDate() === lastDayOfMonth
      )
      if (hasLastDay) {
        break
      }
    }

    return days
  }

  private _getWeekdayNames(): string[] {
    const names: string[] = []
    const baseDate = new Date(2024, 0, 7) // A Sunday

    for (let i = 0; i < 7; i++) {
      const dayIndex = (this.weekStartsOn + i) % 7
      const date = new Date(baseDate)
      date.setDate(date.getDate() + dayIndex)
      names.push(
        date.toLocaleDateString("default", { weekday: "short" }).slice(0, 2)
      )
    }

    return names
  }

  private _handleDayClick(date: Date) {
    if (this._isDisabled(date)) return

    if (this.mode === "single") {
      this.selected = this._formatDate(date)
      this.dispatchEvent(
        new CustomEvent("date-select", {
          detail: { date: this._formatDate(date) },
          bubbles: true,
          composed: true,
        })
      )
    } else if (this.mode === "multiple") {
      const dates = this.selectedDates
        ? this.selectedDates.split(",").map((d) => d.trim())
        : []
      const dateStr = this._formatDate(date)
      const index = dates.indexOf(dateStr)

      if (index >= 0) {
        dates.splice(index, 1)
      } else {
        dates.push(dateStr)
      }

      this.selectedDates = dates.join(",")
      this.dispatchEvent(
        new CustomEvent("dates-select", {
          detail: { dates: dates },
          bubbles: true,
          composed: true,
        })
      )
    } else if (this.mode === "range") {
      if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
        // Start new range
        this.rangeStart = this._formatDate(date)
        this.rangeEnd = ""
      } else {
        // Complete range
        const start = this._parseDate(this.rangeStart)!
        if (date < start) {
          this.rangeEnd = this.rangeStart
          this.rangeStart = this._formatDate(date)
        } else {
          this.rangeEnd = this._formatDate(date)
        }
      }

      this.dispatchEvent(
        new CustomEvent("range-select", {
          detail: { from: this.rangeStart, to: this.rangeEnd },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  private _handleDayHover(date: Date) {
    if (this.mode === "range" && this.rangeStart && !this.rangeEnd) {
      this._hoverDate = date
    }
  }

  private _handleDayLeave() {
    this._hoverDate = null
  }

  private _handlePrevMonth() {
    this._displayDate = new Date(
      this._displayDate.getFullYear(),
      this._displayDate.getMonth() - 1,
      1
    )
  }

  private _handleNextMonth() {
    this._displayDate = new Date(
      this._displayDate.getFullYear(),
      this._displayDate.getMonth() + 1,
      1
    )
  }

  private _handleKeyDown(e: KeyboardEvent, date: Date) {
    let newDate: Date | null = null

    switch (e.key) {
      case "ArrowLeft":
        newDate = new Date(date)
        newDate.setDate(newDate.getDate() - 1)
        break
      case "ArrowRight":
        newDate = new Date(date)
        newDate.setDate(newDate.getDate() + 1)
        break
      case "ArrowUp":
        newDate = new Date(date)
        newDate.setDate(newDate.getDate() - 7)
        break
      case "ArrowDown":
        newDate = new Date(date)
        newDate.setDate(newDate.getDate() + 7)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        this._handleDayClick(date)
        return
      default:
        return
    }

    if (newDate) {
      e.preventDefault()
      this._focusedDate = newDate

      // Update display month if needed
      if (newDate.getMonth() !== this._displayDate.getMonth()) {
        this._displayDate = new Date(
          newDate.getFullYear(),
          newDate.getMonth(),
          1
        )
      }

      // Focus the new day button after render
      this.updateComplete.then(() => {
        const dateStr = this._formatDate(newDate!)
        const button = this.querySelector(
          `[data-date="${dateStr}"]`
        ) as HTMLButtonElement
        button?.focus()
      })
    }
  }

  private _renderMonth(displayDate: Date) {
    const weeks = this._getMonthDays(displayDate)
    const weekdays = this._getWeekdayNames()
    const monthName = displayDate.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    })

    return html`
      <div class="flex flex-col w-full gap-4" data-slot="month">
        <!-- Month Caption -->
        <div
          class="flex items-center justify-center h-[--cell-size] w-full px-[--cell-size]"
          data-slot="month-caption"
        >
          <span class="select-none font-medium text-sm">${monthName}</span>
        </div>

        <!-- Weekday Headers -->
        <div class="flex" data-slot="weekdays">
          ${weekdays.map(
            (day) => html`
              <div
                class="text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none text-center"
                data-slot="weekday"
              >
                ${day}
              </div>
            `
          )}
        </div>

        <!-- Days Grid - wrapped to contain weeks without extra gap -->
        <div class="flex flex-col -mt-1.5" data-slot="weeks">
          ${weeks.map(
            (week) => html`
              <div class="flex w-full mt-2" data-slot="week">
                ${week.map((date) => this._renderDay(date, displayDate))}
              </div>
            `
          )}
        </div>
      </div>
    `
  }

  private _renderDay(date: Date, displayMonth: Date) {
    const isOutside = this._isOutsideMonth(date, displayMonth)
    const isDisabled = this._isDisabled(date)
    const isSelected = this._isSelected(date)
    const isToday = this._isToday(date)
    const isRangeStart = this._isRangeStart(date)
    const isRangeEnd = this._isRangeEnd(date)
    const isInRange = this._isInRange(date)
    const dateStr = this._formatDate(date)

    // Hide outside days if not showing them
    if (isOutside && !this.showOutsideDays) {
      return html`<div
        class="relative p-0 text-center select-none flex-1"
      ></div>`
    }

    const dayClasses = cn(
      "relative p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md [&:first-child[data-selected=true]_button]:rounded-l-md select-none flex-1",
      isRangeStart && "rounded-l-md bg-accent",
      isRangeEnd && "rounded-r-md bg-accent",
      isInRange && "bg-accent"
    )

    const buttonClasses = cn(
      // Base button styles from React's Button ghost variant
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "hover:bg-accent hover:text-accent-foreground",
      // Day button specific - fixed size like React (--cell-size = 2rem = 32px)
      "size-8 flex-col gap-1 leading-none font-normal p-0",
      // Selection states
      isSelected &&
        !isRangeStart &&
        !isRangeEnd &&
        !isInRange &&
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
      isRangeStart &&
        "bg-primary text-primary-foreground rounded-md rounded-l-md",
      isRangeEnd &&
        "bg-primary text-primary-foreground rounded-md rounded-r-md",
      isInRange && "bg-accent text-accent-foreground rounded-none",
      // Today highlight (when not selected)
      isToday && !isSelected && "bg-accent text-accent-foreground rounded-md",
      // Outside month styling
      isOutside && "text-muted-foreground",
      // Disabled styling
      isDisabled && "text-muted-foreground opacity-50 pointer-events-none"
    )

    return html`
      <div
        class=${dayClasses}
        data-slot="day"
        data-selected=${isSelected || nothing}
      >
        <button
          type="button"
          class=${buttonClasses}
          data-date=${dateStr}
          data-today=${isToday || nothing}
          data-selected=${isSelected || nothing}
          data-outside=${isOutside || nothing}
          data-disabled=${isDisabled || nothing}
          data-range-start=${isRangeStart || nothing}
          data-range-end=${isRangeEnd || nothing}
          data-range-middle=${isInRange || nothing}
          ?disabled=${isDisabled}
          aria-pressed=${isSelected ? "true" : "false"}
          tabindex=${isDisabled ? -1 : 0}
          @click=${() => this._handleDayClick(date)}
          @mouseenter=${() => this._handleDayHover(date)}
          @mouseleave=${() => this._handleDayLeave()}
          @keydown=${(e: KeyboardEvent) => this._handleKeyDown(e, date)}
        >
          ${date.getDate()}
        </button>
      </div>
    `
  }

  render() {
    const months: Date[] = []
    for (let i = 0; i < this.numberOfMonths; i++) {
      months.push(
        new Date(
          this._displayDate.getFullYear(),
          this._displayDate.getMonth() + i,
          1
        )
      )
    }

    const containerClasses = cn(
      "bg-background group/calendar p-3",
      "[--cell-size:2rem]",
      this.class
    )

    return html`
      <div
        class=${containerClasses}
        data-slot="calendar"
        role="application"
        aria-label="Calendar"
      >
        <!-- Months container - relative for nav positioning -->
        <div
          class=${cn(
            "flex gap-4 relative",
            this.numberOfMonths > 1 ? "flex-col md:flex-row" : "flex-col"
          )}
          data-slot="months"
        >
          <!-- Navigation - absolute positioned overlaying months -->
          <div
            class="flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between"
            data-slot="nav"
          >
            <button
              type="button"
              class=${cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "hover:bg-accent hover:text-accent-foreground",
                "size-[--cell-size] p-0 select-none"
              )}
              aria-label="Previous month"
              @click=${this._handlePrevMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              class=${cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "hover:bg-accent hover:text-accent-foreground",
                "size-[--cell-size] p-0 select-none"
              )}
              aria-label="Next month"
              @click=${this._handleNextMonth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          ${months.map((month) => this._renderMonth(month))}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-calendar": HalCalendar
  }
}
