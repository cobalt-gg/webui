import { expect, test } from "@playwright/test";

const errorsOf = (page: import("@playwright/test").Page) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
};

test("renders every component with no console errors", async ({ page }) => {
  const errors = errorsOf(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Every cobalt component, live.");
  const count = await page.locator("article.g-card").count();
  expect(count).toBeGreaterThanOrEqual(114);
  await expect(page.locator(".g-preview:has-text('No preview')")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("search filters cards and / focuses it", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  await expect(page.getByLabel("Search components")).toBeFocused();
  await page.keyboard.type("date");
  await expect(page.getByRole("status").filter({ hasText: "results" })).toBeVisible();
  const names = await page.locator(".g-card-title a").allTextContents();
  expect(names).toEqual(expect.arrayContaining(["Calendar", "DatePicker"]));
  expect(names).not.toContain("Button");
});

test("hash links scroll to and highlight a component", async ({ page }) => {
  await page.goto("/#/play-button");
  const card = page.locator("#play-button");
  await expect(card).toHaveClass(/is-highlighted/);
  await expect(card).toBeInViewport();
});

test("theme toggle switches and persists", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "light");
});

test("code panel shows usage, props and accessibility", async ({ page }) => {
  await page.goto("/#/button");
  const card = page.locator("#button");
  await card.getByRole("button", { name: /Code, props/ }).click();
  await expect(card.getByText("Accessibility.")).toBeVisible();
  await expect(card.locator(".g-props dt").first()).toHaveText("variant");
});

test("phone width has no horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
