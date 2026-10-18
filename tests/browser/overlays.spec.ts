import { test, expect } from "@playwright/test";
test("popover, sheet, context menu, tooltip, alert and toast interactions", async ({
  page,
}) => {
  await page.goto("/#/popover");
  const popoverTrigger = page
    .locator(".detail-preview")
    .getByRole("button", { name: "Quick details" });
  await popoverTrigger.click();
  await expect(
    page.getByRole("dialog", { name: "Quick details" }),
  ).toContainText("Project overview");
  await page.keyboard.press("Escape");
  await expect(popoverTrigger).toBeFocused();
  await page.goto("/#/sheet");
  await page
    .locator(".detail-preview")
    .getByRole("button", { name: "Open sheet" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Project settings");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/#/context-menu");
  await page.locator(".detail-preview .ui-context-trigger").focus();
  await page.keyboard.press("Shift+F10");
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/#/tooltip");
  await page
    .locator(".detail-preview")
    .getByRole("button", { name: "Add item" })
    .focus();
  await expect(page.getByRole("tooltip")).toHaveText("Add a new item");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.goto("/#/alert-dialog");
  await page
    .locator(".detail-preview")
    .getByRole("button", { name: "Remove item" })
    .click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Remove item", exact: true })
    .click();
  await expect(
    page.locator(".detail-preview").getByRole("status"),
  ).toContainText("removed");
  await page.goto("/#/toast");
  await page
    .locator(".detail-preview")
    .getByRole("button", { name: "Show notification" })
    .click();
  await expect(page.locator(".ui-toast")).toContainText("Changes saved");
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(page.locator(".ui-toast")).toHaveCount(0);
});
