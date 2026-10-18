import { test, expect } from "@playwright/test";
import { registry } from "../../src/registry";
test("gallery search, category filters, routes, and all previews", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".gallery-card")).toHaveCount(46);
  await page
    .getByRole("searchbox", { name: "Search components" })
    .fill("keyboard");
  await expect(page.locator(".gallery-card")).toHaveCount(
    registry.filter((c) =>
      [c.name, c.category, c.description, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes("keyboard"),
    ).length,
  );
  await page
    .getByRole("searchbox", { name: "Search components" })
    .fill("not-a-component");
  await expect(page.getByText("No components found")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page
    .getByRole("navigation", { name: "Filter components" })
    .getByRole("button", { name: "Layout", exact: true })
    .click();
  await expect(page.locator(".gallery-card")).toHaveCount(5);
  for (const c of registry) {
    await page.goto(`/#/${c.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      c.name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    );
    await expect(page.locator(".detail-preview .demo-content")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Accessibility", exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("dialog keyboard focus, portal theme, menu navigation and tabs", async ({
  page,
}) => {
  await page.goto("/#/dialog");
  await page.getByLabel("Preview theme").selectOption("dark");
  const trigger = page
    .locator(".detail-preview")
    .getByRole("button", { name: "Open dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox")).toBeFocused();
  expect(
    await dialog.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(35, 42, 54)");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.goto("/#/dropdown-menu");
  await page
    .locator(".detail-preview")
    .getByRole("button", { name: "Actions" })
    .focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: "Duplicate", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("menuitem", { name: "Archive", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.locator(".detail-preview").getByRole("status"),
  ).toContainText("archived");
  await page.goto("/#/tabs");
  await page
    .locator(".detail-preview")
    .getByRole("tab", { name: "Overview" })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.locator(".detail-preview").getByRole("tabpanel"),
  ).toContainText("recent activity");
});
test("theme, token overrides, reduced motion, focus, copy and small viewport", async ({
  page,
  context,
}) => {
  await page.goto("/#/button");
  await page.getByLabel("Preview theme").selectOption("light");
  const button = page
    .locator(".detail-preview")
    .getByRole("button", { name: "Continue" });
  await button.focus();
  expect(await button.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    "solid",
  );
  await page
    .locator(".detail-preview")
    .evaluate((el) =>
      (el as HTMLElement).style.setProperty("--ui-accent", "rgb(120, 40, 160)"),
    );
  await expect
    .poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe("rgb(120, 40, 160)");
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-ui-theme",
    /light|dark/,
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy", exact: true }).first().click();
  await expect(
    page.getByRole("button", { name: "Copied", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "@cobalt/ui",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/spinner");
  expect(
    await page
      .locator(".detail-preview .ui-spinner")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
  await page.keyboard.press("Tab");
  await page.getByText("Skip to content").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator(".gallery-card")).toHaveCount(46);
});
