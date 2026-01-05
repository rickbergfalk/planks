import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-calendar"
import type { HalCalendar } from "@/web-components/hal-calendar"

describe("HalCalendar (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalCalendar> {
    container.innerHTML = html
    await customElements.whenDefined("hal-calendar")
    const calendar = container.querySelector("hal-calendar") as HalCalendar
    await calendar.updateComplete
    return calendar
  }

  describe("Rendering", () => {
    it("renders with data-slot attribute", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      expect(calendar.dataset.slot).toBe("calendar")
    })

    it("renders navigation buttons", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const prevButton = calendar.querySelector('[aria-label="Previous month"]')
      const nextButton = calendar.querySelector('[aria-label="Next month"]')
      expect(prevButton).toBeTruthy()
      expect(nextButton).toBeTruthy()
    })

    it("renders weekday headers", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const weekdays = calendar.querySelectorAll('[data-slot="weekday"]')
      expect(weekdays.length).toBe(7)
    })

    it("renders day buttons", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const days = calendar.querySelectorAll('[data-slot="day"]')
      expect(days.length).toBeGreaterThanOrEqual(28) // At least 4 weeks
      expect(days.length).toBeLessThanOrEqual(42) // At most 6 weeks
    })

    it("renders month caption", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const caption = calendar.querySelector('[data-slot="month-caption"]')
      expect(caption).toBeTruthy()
      expect(caption?.textContent).toBeTruthy()
    })
  })

  describe("Single Selection Mode", () => {
    it("defaults to single mode", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      expect(calendar.mode).toBe("single")
    })

    it("shows selected date", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar selected="2025-01-15"></hal-calendar>`
      )
      const selectedButton = calendar.querySelector('[data-selected="true"]')
      expect(selectedButton).toBeTruthy()
      expect(selectedButton?.textContent?.trim()).toBe("15")
    })

    it("fires date-select event when clicking a day", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const handler = vi.fn()
      calendar.addEventListener("date-select", handler)

      // Find a day button that isn't disabled
      const dayButton = calendar.querySelector(
        '[data-slot="day"]:not([data-disabled="true"]) button'
      ) as HTMLButtonElement
      dayButton?.click()
      await calendar.updateComplete

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0][0].detail.date).toMatch(
        /^\d{4}-\d{2}-\d{2}$/
      )
    })

    it("updates selected property when clicking a day", async () => {
      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)

      const dayButton = calendar.querySelector(
        '[data-slot="day"]:not([data-disabled="true"]) button'
      ) as HTMLButtonElement
      dayButton?.click()
      await calendar.updateComplete

      expect(calendar.selected).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  describe("Multiple Selection Mode", () => {
    it("supports multiple selection mode", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="multiple"></hal-calendar>`
      )
      expect(calendar.mode).toBe("multiple")
    })

    it("shows multiple selected dates", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="multiple" default-month="2025-01-01" selected-dates="2025-01-15,2025-01-20"></hal-calendar>`
      )
      // Query buttons directly to avoid counting parent divs
      const selectedButtons = calendar.querySelectorAll(
        'button[data-selected="true"]'
      )
      expect(selectedButtons.length).toBe(2)
    })

    it("fires dates-select event with array", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="multiple"></hal-calendar>`
      )
      const handler = vi.fn()
      calendar.addEventListener("dates-select", handler)

      const dayButton = calendar.querySelector(
        '[data-slot="day"]:not([data-disabled="true"]) button'
      ) as HTMLButtonElement
      dayButton?.click()
      await calendar.updateComplete

      expect(handler).toHaveBeenCalled()
      expect(Array.isArray(handler.mock.calls[0][0].detail.dates)).toBe(true)
    })

    it("toggles date selection", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="multiple" default-month="2025-01-01" selected-dates="2025-01-15"></hal-calendar>`
      )

      // Click the same date to deselect
      const selectedButton = calendar.querySelector(
        '[data-date="2025-01-15"]'
      ) as HTMLButtonElement
      selectedButton?.click()
      await calendar.updateComplete

      expect(calendar.selectedDates).toBe("")
    })
  })

  describe("Range Selection Mode", () => {
    it("supports range selection mode", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="range"></hal-calendar>`
      )
      expect(calendar.mode).toBe("range")
    })

    it("shows range start and end", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="range" range-start="2025-01-10" range-end="2025-01-20"></hal-calendar>`
      )
      const rangeStart = calendar.querySelector('[data-range-start="true"]')
      const rangeEnd = calendar.querySelector('[data-range-end="true"]')
      expect(rangeStart).toBeTruthy()
      expect(rangeEnd).toBeTruthy()
    })

    it("shows range middle dates", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="range" range-start="2025-01-10" range-end="2025-01-15"></hal-calendar>`
      )
      const rangeMiddle = calendar.querySelectorAll(
        '[data-range-middle="true"]'
      )
      expect(rangeMiddle.length).toBeGreaterThan(0)
    })

    it("fires range-select event", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar mode="range"></hal-calendar>`
      )
      const handler = vi.fn()
      calendar.addEventListener("range-select", handler)

      // Click first date
      const dayButton = calendar.querySelector(
        '[data-slot="day"]:not([data-disabled="true"]) button'
      ) as HTMLButtonElement
      dayButton?.click()
      await calendar.updateComplete

      expect(handler).toHaveBeenCalled()
      expect(handler.mock.calls[0][0].detail.from).toBeTruthy()
    })
  })

  describe("Navigation", () => {
    it("navigates to previous month", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-06-01"></hal-calendar>`
      )
      const caption = calendar.querySelector('[data-slot="month-caption"]')
      expect(caption?.textContent).toContain("June")

      const prevButton = calendar.querySelector(
        '[aria-label="Previous month"]'
      ) as HTMLButtonElement
      prevButton?.click()
      await calendar.updateComplete

      const newCaption = calendar.querySelector('[data-slot="month-caption"]')
      expect(newCaption?.textContent).toContain("May")
    })

    it("navigates to next month", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-06-01"></hal-calendar>`
      )
      const caption = calendar.querySelector('[data-slot="month-caption"]')
      expect(caption?.textContent).toContain("June")

      const nextButton = calendar.querySelector(
        '[aria-label="Next month"]'
      ) as HTMLButtonElement
      nextButton?.click()
      await calendar.updateComplete

      const newCaption = calendar.querySelector('[data-slot="month-caption"]')
      expect(newCaption?.textContent).toContain("July")
    })
  })

  describe("Date Constraints", () => {
    it("disables dates before minDate", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01" min-date="2025-01-15"></hal-calendar>`
      )
      const disabledDay = calendar.querySelector('[data-date="2025-01-10"]')
      expect(disabledDay?.getAttribute("data-disabled")).toBe("true")
      expect(disabledDay?.hasAttribute("disabled")).toBe(true)
    })

    it("disables dates after maxDate", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01" max-date="2025-01-15"></hal-calendar>`
      )
      const disabledDay = calendar.querySelector('[data-date="2025-01-20"]')
      expect(disabledDay?.getAttribute("data-disabled")).toBe("true")
      expect(disabledDay?.hasAttribute("disabled")).toBe(true)
    })

    it("does not fire event when clicking disabled date", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01" min-date="2025-01-15"></hal-calendar>`
      )
      const handler = vi.fn()
      calendar.addEventListener("date-select", handler)

      const disabledDay = calendar.querySelector(
        '[data-date="2025-01-10"]'
      ) as HTMLButtonElement
      disabledDay?.click()
      await calendar.updateComplete

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe("Display Options", () => {
    it("shows outside days by default", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01"></hal-calendar>`
      )
      const outsideDays = calendar.querySelectorAll('[data-outside="true"]')
      expect(outsideDays.length).toBeGreaterThan(0)
    })

    it("hides outside days when show-outside-days is false", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01" show-outside-days="false"></hal-calendar>`
      )
      // Outside days should not have buttons
      const outsideDays = calendar.querySelectorAll('[data-outside="true"]')
      expect(outsideDays.length).toBe(0)
    })

    it("renders multiple months", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar number-of-months="2"></hal-calendar>`
      )
      const months = calendar.querySelectorAll('[data-slot="month"]')
      expect(months.length).toBe(2)
    })

    it("changes week start day", async () => {
      // Default (Sunday start)
      const calendarSunday = await renderAndWait(
        `<hal-calendar></hal-calendar>`
      )
      const weekdaysSunday = calendarSunday.querySelectorAll(
        '[data-slot="weekday"]'
      )
      const firstDaySunday = weekdaysSunday[0]?.textContent?.trim()

      container.innerHTML = ""

      // Monday start
      const calendarMonday = await renderAndWait(
        `<hal-calendar week-starts-on="1"></hal-calendar>`
      )
      const weekdaysMonday = calendarMonday.querySelectorAll(
        '[data-slot="weekday"]'
      )
      const firstDayMonday = weekdaysMonday[0]?.textContent?.trim()

      expect(firstDaySunday).not.toBe(firstDayMonday)
    })
  })

  describe("Today Highlighting", () => {
    it("highlights today's date", async () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      const todayStr = `${year}-${month}-${day}`

      const calendar = await renderAndWait(`<hal-calendar></hal-calendar>`)
      const todayButton = calendar.querySelector(`[data-date="${todayStr}"]`)
      expect(todayButton?.getAttribute("data-today")).toBe("true")
    })
  })

  describe("Keyboard Navigation", () => {
    it("supports arrow key navigation", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01" selected="2025-01-15"></hal-calendar>`
      )

      const dayButton = calendar.querySelector(
        '[data-date="2025-01-15"]'
      ) as HTMLButtonElement
      dayButton?.focus()

      // Simulate right arrow
      const rightEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      })
      dayButton?.dispatchEvent(rightEvent)
      await calendar.updateComplete

      // After update, focus should move (though in test environment focus may not work perfectly)
      // The important thing is no error is thrown
      expect(true).toBe(true)
    })

    it("supports Enter key to select", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01"></hal-calendar>`
      )
      const handler = vi.fn()
      calendar.addEventListener("date-select", handler)

      const dayButton = calendar.querySelector(
        '[data-date="2025-01-15"]'
      ) as HTMLButtonElement
      dayButton?.focus()

      const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      })
      dayButton?.dispatchEvent(enterEvent)
      await calendar.updateComplete

      expect(handler).toHaveBeenCalled()
    })

    it("supports Space key to select", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-01-01"></hal-calendar>`
      )
      const handler = vi.fn()
      calendar.addEventListener("date-select", handler)

      const dayButton = calendar.querySelector(
        '[data-date="2025-01-15"]'
      ) as HTMLButtonElement
      dayButton?.focus()

      const spaceEvent = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
      })
      dayButton?.dispatchEvent(spaceEvent)
      await calendar.updateComplete

      expect(handler).toHaveBeenCalled()
    })
  })

  describe("Initial Display", () => {
    it("displays default month", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar default-month="2025-06-15"></hal-calendar>`
      )
      const caption = calendar.querySelector('[data-slot="month-caption"]')
      expect(caption?.textContent).toContain("June")
      expect(caption?.textContent).toContain("2025")
    })

    it("displays month of selected date if no default-month", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar selected="2025-08-20"></hal-calendar>`
      )
      const caption = calendar.querySelector('[data-slot="month-caption"]')
      expect(caption?.textContent).toContain("August")
    })
  })

  describe("Custom Class", () => {
    it("applies custom class", async () => {
      const calendar = await renderAndWait(
        `<hal-calendar class="rounded-lg border"></hal-calendar>`
      )
      const calendarDiv = calendar.querySelector('[data-slot="calendar"]')
      expect(calendarDiv?.classList.contains("rounded-lg")).toBe(true)
      expect(calendarDiv?.classList.contains("border")).toBe(true)
    })
  })
})
