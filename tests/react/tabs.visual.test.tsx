import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs"

describe("Tabs (React) - Visual", () => {
  it("first tab selected", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="p-4 border rounded-md">
              Make changes to your account here.
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="p-4 border rounded-md">
              Change your password here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-first-selected"
    )
  })

  it("second tab selected", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Tabs defaultValue="password" className="w-full">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="p-4 border rounded-md">
              Make changes to your account here.
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="p-4 border rounded-md">
              Change your password here.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-second-selected"
    )
  })
})
