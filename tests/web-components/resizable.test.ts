import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-resizable"
import type {
  HalResizablePanelGroup,
  HalResizablePanel,
  HalResizableHandle,
} from "../../src/web-components/hal-resizable"

describe("hal-resizable-panel-group", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with default direction (horizontal)", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector(
      "hal-resizable-panel-group"
    ) as HalResizablePanelGroup
    await group.updateComplete

    expect(group.direction).toBe("horizontal")
    expect(group.getAttribute("data-panel-group-direction")).toBe("horizontal")
    expect(group.classList.contains("flex")).toBe(true)
  })

  it("renders with vertical direction", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="vertical">
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector(
      "hal-resizable-panel-group"
    ) as HalResizablePanelGroup
    await group.updateComplete

    expect(group.direction).toBe("vertical")
    expect(group.getAttribute("data-panel-group-direction")).toBe("vertical")
    expect(group.classList.contains("flex-col")).toBe(true)
  })

  it("sets initial panel sizes from default-size", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="30">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="70">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector(
      "hal-resizable-panel-group"
    ) as HalResizablePanelGroup
    await group.updateComplete

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const panels = container.querySelectorAll("hal-resizable-panel")
    expect((panels[0] as HalResizablePanel)._size).toBe(30)
    expect((panels[1] as HalResizablePanel)._size).toBe(70)
  })

  it("distributes remaining size to panels without default-size", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel>
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector(
      "hal-resizable-panel-group"
    ) as HalResizablePanelGroup
    await group.updateComplete

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const panels = container.querySelectorAll("hal-resizable-panel")
    expect((panels[0] as HalResizablePanel)._size).toBe(50)
    expect((panels[1] as HalResizablePanel)._size).toBe(50)
  })

  it("has correct data-slot attribute", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector(
      "hal-resizable-panel-group"
    ) as HalResizablePanelGroup
    await group.updateComplete

    expect(group.dataset.slot).toBe("resizable-panel-group")
  })
})

describe("hal-resizable-panel", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with data-slot attribute", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="100">
          <div>Panel</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel")
    const panel = container.querySelector(
      "hal-resizable-panel"
    ) as HalResizablePanel
    await panel.updateComplete

    expect(panel.dataset.slot).toBe("resizable-panel")
  })

  it("respects min-size constraint", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50" min-size="30">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel")
    const panel = container.querySelector(
      "hal-resizable-panel"
    ) as HalResizablePanel
    await panel.updateComplete

    expect(panel.minSize).toBe(30)
  })

  it("respects max-size constraint", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50" max-size="80">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel")
    const panel = container.querySelector(
      "hal-resizable-panel"
    ) as HalResizablePanel
    await panel.updateComplete

    expect(panel.maxSize).toBe(80)
  })
})

describe("hal-resizable-handle", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with data-slot attribute", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    expect(handle.dataset.slot).toBe("resizable-handle")
  })

  it("renders with grip icon when with-handle is set", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle with-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    const svg = handle.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("does not render grip icon without with-handle", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    const svg = handle.querySelector("svg")
    expect(svg).toBeNull()
  })

  it("has correct ARIA attributes", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group>
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    expect(handle.getAttribute("role")).toBe("separator")
    expect(handle.getAttribute("tabindex")).toBe("0")
    expect(handle.getAttribute("aria-orientation")).toBe("horizontal")
  })

  it("sets col-resize cursor for horizontal direction", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="horizontal">
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    expect(handle.classList.contains("cursor-col-resize")).toBe(true)
  })

  it("sets row-resize cursor for vertical direction", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="vertical">
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div>Panel 2</div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-handle")
    const handle = container.querySelector(
      "hal-resizable-handle"
    ) as HalResizableHandle
    await handle.updateComplete

    expect(handle.classList.contains("cursor-row-resize")).toBe(true)
  })
})

describe("hal-resizable - nested groups", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("supports nested panel groups", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="horizontal">
        <hal-resizable-panel default-size="50">
          <div>Panel 1</div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <hal-resizable-panel-group direction="vertical">
            <hal-resizable-panel default-size="50">
              <div>Panel 2a</div>
            </hal-resizable-panel>
            <hal-resizable-handle></hal-resizable-handle>
            <hal-resizable-panel default-size="50">
              <div>Panel 2b</div>
            </hal-resizable-panel>
          </hal-resizable-panel-group>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")

    const groups = container.querySelectorAll("hal-resizable-panel-group")
    expect(groups.length).toBe(2)
    expect((groups[0] as HalResizablePanelGroup).direction).toBe("horizontal")
    expect((groups[1] as HalResizablePanelGroup).direction).toBe("vertical")
  })
})
