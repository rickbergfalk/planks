import { createRoot } from "react-dom/client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/navigation-menu"
import { ComparisonRow } from "./comparison-row"

function NavigationMenuComparison() {
  return (
    <ComparisonRow
      reactContent={
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-48">
                  <NavigationMenuLink href="#">
                    Introduction
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    Installation
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-48">
                  <NavigationMenuLink href="#">Button</NavigationMenuLink>
                  <NavigationMenuLink href="#">Card</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      }
      hallucnHtml={`
        <hal-navigation-menu>
          <hal-navigation-menu-list>
            <hal-navigation-menu-item>
              <hal-navigation-menu-trigger>Getting Started</hal-navigation-menu-trigger>
              <hal-navigation-menu-content>
                <div class="grid gap-3 p-4 w-48">
                  <hal-navigation-menu-link href="#">Introduction</hal-navigation-menu-link>
                  <hal-navigation-menu-link href="#">Installation</hal-navigation-menu-link>
                </div>
              </hal-navigation-menu-content>
            </hal-navigation-menu-item>
            <hal-navigation-menu-item>
              <hal-navigation-menu-trigger>Components</hal-navigation-menu-trigger>
              <hal-navigation-menu-content>
                <div class="grid gap-3 p-4 w-48">
                  <hal-navigation-menu-link href="#">Button</hal-navigation-menu-link>
                  <hal-navigation-menu-link href="#">Card</hal-navigation-menu-link>
                </div>
              </hal-navigation-menu-content>
            </hal-navigation-menu-item>
          </hal-navigation-menu-list>
        </hal-navigation-menu>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<NavigationMenuComparison />)
}
