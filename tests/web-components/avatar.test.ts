import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-avatar"
import type {
  HalAvatar,
  HalAvatarImage,
  HalAvatarFallback,
} from "@/web-components/hal-avatar"

describe("HalAvatar (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("HalAvatar", () => {
    it("renders with correct data-slot", async () => {
      container.innerHTML = `<hal-avatar></hal-avatar>`
      await customElements.whenDefined("hal-avatar")
      const avatar = container.querySelector("hal-avatar") as HalAvatar
      await avatar.updateComplete

      expect(avatar.dataset.slot).toBe("avatar")
    })

    it("applies base classes", async () => {
      container.innerHTML = `<hal-avatar></hal-avatar>`
      await customElements.whenDefined("hal-avatar")
      const avatar = container.querySelector("hal-avatar") as HalAvatar
      await avatar.updateComplete

      expect(avatar.classList.contains("relative")).toBe(true)
      expect(avatar.classList.contains("flex")).toBe(true)
      expect(avatar.classList.contains("rounded-full")).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<hal-avatar class="rounded-lg"></hal-avatar>`
      await customElements.whenDefined("hal-avatar")
      const avatar = container.querySelector("hal-avatar") as HalAvatar
      await avatar.updateComplete

      expect(avatar.classList.contains("rounded-lg")).toBe(true)
    })
  })

  describe("HalAvatarImage", () => {
    it("renders with correct data-slot", async () => {
      container.innerHTML = `<hal-avatar-image src="test.jpg" alt="Test"></hal-avatar-image>`
      await customElements.whenDefined("hal-avatar-image")
      const avatarImage = container.querySelector(
        "hal-avatar-image"
      ) as HalAvatarImage
      await avatarImage.updateComplete

      expect(avatarImage.dataset.slot).toBe("avatar-image")
    })

    it("creates an img element", async () => {
      container.innerHTML = `<hal-avatar-image src="test.jpg" alt="Test"></hal-avatar-image>`
      await customElements.whenDefined("hal-avatar-image")
      const avatarImage = container.querySelector(
        "hal-avatar-image"
      ) as HalAvatarImage
      await avatarImage.updateComplete

      const img = avatarImage.querySelector("img")
      expect(img).toBeTruthy()
      expect(img?.getAttribute("src")).toBe("test.jpg")
      expect(img?.getAttribute("alt")).toBe("Test")
    })

    it("passes src and alt attributes", async () => {
      container.innerHTML = `<hal-avatar-image src="avatar.png" alt="User avatar"></hal-avatar-image>`
      await customElements.whenDefined("hal-avatar-image")
      const avatarImage = container.querySelector(
        "hal-avatar-image"
      ) as HalAvatarImage
      await avatarImage.updateComplete

      const img = avatarImage.querySelector("img")
      expect(img?.getAttribute("src")).toBe("avatar.png")
      expect(img?.getAttribute("alt")).toBe("User avatar")
    })
  })

  describe("HalAvatarFallback", () => {
    it("renders with correct data-slot", async () => {
      container.innerHTML = `<hal-avatar-fallback>CN</hal-avatar-fallback>`
      await customElements.whenDefined("hal-avatar-fallback")
      const fallback = container.querySelector(
        "hal-avatar-fallback"
      ) as HalAvatarFallback
      await fallback.updateComplete

      expect(fallback.dataset.slot).toBe("avatar-fallback")
    })

    it("applies base classes", async () => {
      container.innerHTML = `<hal-avatar-fallback>CN</hal-avatar-fallback>`
      await customElements.whenDefined("hal-avatar-fallback")
      const fallback = container.querySelector(
        "hal-avatar-fallback"
      ) as HalAvatarFallback
      await fallback.updateComplete

      expect(fallback.classList.contains("bg-muted")).toBe(true)
      expect(fallback.classList.contains("flex")).toBe(true)
      expect(fallback.classList.contains("items-center")).toBe(true)
      expect(fallback.classList.contains("justify-center")).toBe(true)
    })

    it("preserves children content", async () => {
      container.innerHTML = `<hal-avatar-fallback>AB</hal-avatar-fallback>`
      await customElements.whenDefined("hal-avatar-fallback")
      const fallback = container.querySelector(
        "hal-avatar-fallback"
      ) as HalAvatarFallback
      await fallback.updateComplete

      expect(fallback.textContent).toContain("AB")
    })
  })

  describe("Avatar composition", () => {
    it("renders complete avatar with image and fallback", async () => {
      container.innerHTML = `
        <hal-avatar>
          <hal-avatar-image src="test.jpg" alt="Test"></hal-avatar-image>
          <hal-avatar-fallback>CN</hal-avatar-fallback>
        </hal-avatar>
      `
      await customElements.whenDefined("hal-avatar")
      await customElements.whenDefined("hal-avatar-image")
      await customElements.whenDefined("hal-avatar-fallback")

      const avatar = container.querySelector("hal-avatar") as HalAvatar
      const image = container.querySelector(
        "hal-avatar-image"
      ) as HalAvatarImage
      const fallback = container.querySelector(
        "hal-avatar-fallback"
      ) as HalAvatarFallback

      await avatar.updateComplete
      await image.updateComplete
      await fallback.updateComplete

      expect(avatar).toBeTruthy()
      expect(image).toBeTruthy()
      expect(fallback).toBeTruthy()
    })
  })
})
