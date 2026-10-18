import { test, expect } from "@playwright/test";

test("Cobalt identity, local fonts, search shortcut, theme persistence and reduced motion", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:4173"))
      externalRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "dark");
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
  await page.keyboard.type("dialog");
  await expect(page.locator(".gallery-card")).toHaveCount(3);
  await page.getByRole("searchbox", { name: "Search components" }).fill("");
  const card = page.locator(".gallery-card").last();
  await card.scrollIntoViewIfNeeded();

  await expect(card).toBeVisible();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-ui-theme", "light");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/otp-input");
  await page
    .locator(".detail-preview")
    .getByRole("textbox", { name: "Verification code" })
    .fill("123456");
  expect(
    await page
      .locator(".detail-preview .ui-otp-slot")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(externalRequests).toEqual([]);
});
