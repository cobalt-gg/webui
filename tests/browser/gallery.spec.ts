import { test, expect } from "@playwright/test";
import { registry } from "../../src/registry";

const title = (name: string) =>
  name.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, "$1$3 $2$4");

test("every component renders live on one page, with search and index", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".component")).toHaveCount(registry.length);
  await expect(page.locator(".component .stage .demo-content")).toHaveCount(
    registry.length,
  );
  for (const c of registry)
    await expect(
      page.locator(`#${c.slug} > .component__head h3`),
    ).toHaveAccessibleName(title(c.name));

  const search = page.getByRole("searchbox", { name: "Search components" });
  await search.fill("keyboard");
  await expect(page.locator(".component")).toHaveCount(
    registry.filter((c) =>
      [c.name, title(c.name), c.category, c.description, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes("keyboard"),
    ).length,
  );
  await search.fill("not-a-component");
  await expect(page.getByText("Nothing matches that")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".component")).toHaveCount(registry.length);

  await page
    .getByRole("navigation", { name: "Components" })
    .getByRole("link", { name: "Hotkey Input" })
    .click();
  await expect(page.locator("#hotkey-input")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("old detail links land on the component card", async ({ page }) => {
  await page.goto("/#/accordion");
  await expect(page.locator("#accordion")).toBeInViewport();
});

test("code panel shows variants, usage, props and accessibility", async ({
  page,
  context,
}) => {
  await page.goto("/#button");
  const card = page.locator("#button");
  const toggle = card.getByRole("button", { name: /code for Button/i });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  for (const heading of ["Variants", "Usage", "Props", "Accessibility"])
    await expect(card.getByRole("heading", { name: heading })).toBeVisible();
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await card.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(card.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "@cobalt/ui",
  );
});

test("Cobalt identity: local fonts, graphite ground, no external requests", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1:4173")) external.push(r.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('14px "Geist"'))).toBe(
    true,
  );
  expect(
    await page.evaluate(() => document.fonts.check('14px "JetBrains Mono"')),
  ).toBe(true);
  expect(
    await page
      .locator("body")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(14, 14, 13)");
  await page.keyboard.press("/");
  await expect(
    page.getByRole("searchbox", { name: "Search components" }),
  ).toBeFocused();
  expect(external).toEqual([]);
});

test("tokens, focus, reduced motion and small viewport", async ({ page }) => {
  await page.goto("/");
  const button = page
    .locator("#button .stage")
    .getByRole("button", { name: "Continue" });
  expect(
    await button.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(59, 66, 117)");
  await button.focus();
  expect(await button.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    "solid",
  );
  await page
    .locator("#button .stage")
    .evaluate((el) =>
      (el as HTMLElement).style.setProperty("--ui-accent", "rgb(120, 40, 160)"),
    );
  await expect
    .poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor))
    .toBe("rgb(120, 40, 160)");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(
    await page
      .locator("#spinner .ui-spinner")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to components")).toBeFocused();
});
