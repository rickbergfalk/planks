import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Calendar } from "@/components/calendar"

describe("Calendar (React) - Visual", () => {
  it("basic calendar", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          className="rounded-lg border shadow-sm"
        />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "calendar-basic"
    )
  })

  it("calendar with selected date", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          selected={new Date(2025, 0, 15)}
          className="rounded-lg border shadow-sm"
        />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "calendar-selected"
    )
  })

  it("calendar with range", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 0, 1)}
          selected={{
            from: new Date(2025, 0, 10),
            to: new Date(2025, 0, 20),
          }}
          className="rounded-lg border shadow-sm"
        />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "calendar-range"
    )
  })

  it("calendar with multiple months", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Calendar
          mode="single"
          defaultMonth={new Date(2025, 0, 1)}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "calendar-multiple-months"
    )
  })
})
