import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/select"

describe("Select (React)", () => {
  afterEach(() => {
    cleanup()
    // Clean up any portaled select content
    document.querySelectorAll('[data-slot="select-content"]').forEach((el) => {
      el.remove()
    })
    document.querySelectorAll('[role="listbox"]').forEach((el) => {
      el.remove()
    })
  })

  it("renders trigger with correct data-slot", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.dataset.slot).toBe("select-trigger")
  })

  it("select content is hidden by default", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )
    const listbox = screen.queryByRole("listbox")
    expect(listbox).toBeNull()
  })

  it("shows select content on click", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      const listbox = screen.getByRole("listbox")
      expect(listbox).toBeDefined()
    })
  })

  it("shows placeholder when no value selected", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.textContent).toContain("Select a fruit")
  })

  it("shows selected value in trigger", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })

    const appleOption = screen.getByRole("option", { name: /apple/i })
    await user.click(appleOption)

    await waitFor(() => {
      expect(trigger.textContent).toContain("Apple")
    })
  })

  it("closes on item selection", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })

    const appleOption = screen.getByRole("option", { name: /apple/i })
    await user.click(appleOption)

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).toBeNull()
    })
  })

  it("can be controlled via value prop", async () => {
    render(
      <Select value="banana">
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.textContent).toContain("Banana")
  })

  it("fires onValueChange when selection changes", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })

    const appleOption = screen.getByRole("option", { name: /apple/i })
    await user.click(appleOption)

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("apple")
    })
  })

  it("fires onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Select onOpenChange={onOpenChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("trigger has correct ARIA attributes when open", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")

    await user.click(trigger)

    await waitFor(() => {
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })
  })

  it("disabled select cannot be opened", async () => {
    const user = userEvent.setup()
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await new Promise((r) => setTimeout(r, 100))
    expect(screen.queryByRole("listbox")).toBeNull()
  })

  it("disabled item cannot be selected", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple" disabled>
            Apple
          </SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })

    const appleOption = screen.getByRole("option", { name: /apple/i })
    expect(appleOption.getAttribute("aria-disabled")).toBe("true")
  })

  it("renders group with label", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      const group = screen.getByRole("group")
      expect(group).toBeDefined()
    })
  })

  it("renders separator between groups", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem value="carrot">Carrot</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      const separator = document.querySelector('[data-slot="select-separator"]')
      expect(separator).toBeDefined()
    })
  })

  it("select content has correct data-state", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    await waitFor(() => {
      const content = document.querySelector('[data-slot="select-content"]')
      expect(content?.getAttribute("data-state")).toBe("open")
    })
  })

  it("trigger has data-placeholder when no value", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.hasAttribute("data-placeholder")).toBe(true)
  })

  it("opens on keyboard Enter", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    trigger.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })
  })

  it("opens on keyboard Space", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    trigger.focus()
    await user.keyboard(" ")

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })
  })

  it("opens on ArrowDown", async () => {
    const user = userEvent.setup()
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    trigger.focus()
    await user.keyboard("{ArrowDown}")

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeDefined()
    })
  })

  it("supports small size trigger", () => {
    render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger.getAttribute("data-size")).toBe("sm")
  })
})
