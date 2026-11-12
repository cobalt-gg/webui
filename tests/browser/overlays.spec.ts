import { expect, test } from "@playwright/test";

test("dialog traps focus, closes on Escape and restores focus", async ({ page }) => {
  await page.goto("/#/dialog");
  const trigger = page.locator("#dialog").getByRole("button", { name: "Game details" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Skyhaven" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 4; i++) await page.keyboard.press("Tab");
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("alert dialog starts on Cancel", async ({ page }) => {
  await page.goto("/#/alert-dialog");
  await page.locator("#alert-dialog").getByRole("button", { name: "Uninstall" }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
});

test("dropdown menu opens with keyboard and has a danger item", async ({ page }) => {
  await page.goto("/#/dropdown-menu");
  const trigger = page.locator("#dropdown-menu").getByRole("button", { name: "Game options" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Uninstall" })).toHaveClass(/is-danger/);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("command palette filters and runs a command", async ({ page }) => {
  await page.goto("/#/command-palette");
  await page.locator("#command-palette").getByRole("button", { name: /Search or jump/ }).click();
  await page.keyboard.type("store");
  await page.keyboard.press("Enter");
  await expect(page.locator("#command-palette")).toContainText("Last command: Open store");
});

test("toast appears from useToast", async ({ page }) => {
  await page.goto("/#/toast");
  await page.locator("#toast").getByRole("button", { name: "Success toast" }).click();
  await expect(page.getByText("Settings saved")).toBeVisible();
});

test("sheet slides in and lists friends", async ({ page }) => {
  await page.goto("/#/sheet");
  await page.locator("#sheet").getByRole("button", { name: "Friends" }).click();
  await expect(page.getByRole("dialog", { name: "Friends" })).toContainText("Nova Reyes");
});
