import { test, expect } from "@playwright/test";

test("dialog focus, menu keyboard navigation and tabs", async ({ page }) => {
  await page.goto("/");
  const trigger = page
    .locator("#dialog")
    .getByRole("button", { name: "Open dialog" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox")).toBeFocused();
  expect(
    await dialog.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(26, 26, 24)");
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("textbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await page
    .locator("#dropdown-menu")
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
    page.locator("#dropdown-menu").getByRole("status"),
  ).toContainText("archived");

  await page.locator("#tabs").getByRole("tab", { name: "Overview" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#tabs").getByRole("tabpanel")).toContainText(
    "recent activity",
  );
});

test("popover, sheet, context menu, tooltip, alert and toast", async ({
  page,
}) => {
  await page.goto("/");
  const popoverTrigger = page
    .locator("#popover")
    .getByRole("button", { name: "Quick details" });
  await popoverTrigger.click();
  await expect(
    page.getByRole("dialog", { name: "Quick details" }),
  ).toContainText("Project overview");
  await page.keyboard.press("Escape");
  await expect(popoverTrigger).toBeFocused();

  await page
    .locator("#sheet")
    .getByRole("button", { name: "Open sheet" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Project settings");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.locator("#context-menu .ui-context-trigger").focus();
  await page.keyboard.press("Shift+F10");
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");

  await page
    .locator("#tooltip")
    .getByRole("button", { name: "Add item" })
    .focus();
  await expect(page.getByRole("tooltip")).toHaveText("Add a new item");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);

  await page
    .locator("#alert-dialog")
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
  await expect(page.locator("#alert-dialog").getByRole("status")).toContainText(
    "removed",
  );

  await page
    .locator("#toast")
    .getByRole("button", { name: "Show notification" })
    .click();
  await expect(page.locator(".ui-toast")).toContainText("Changes saved");
  await page.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(
    page.locator(".ui-toast", { hasText: "Changes saved" }),
  ).toHaveCount(0);
});
