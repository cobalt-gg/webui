import { test, expect } from "@playwright/test";
import { examples } from "../../site/src/example-registry";

test("all compositions render, source is copyable, screenshots load, and mobile pages fit", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#/examples");
  await expect(page.locator(".example-card")).toHaveCount(6);
  for (const example of examples) {
    await page.goto(`/#/examples/${example.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      example.name,
    );
    await expect(
      page
        .locator(".example-stage")
        .locator(
          "form, .ui-app-shell, .ui-auth-panel, .recipe-website, .appearance-recipe",
        )
        .first(),
    ).toBeVisible();
  }
  await page.goto("/#/examples/website");
  const image = page.locator(".example-stage .ui-media-tile img").first();
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "View Library", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Game page" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "View Library", exact: true }),
  ).toBeFocused();
  await page.getByText("View and copy the full React source").click();
  await expect(page.locator(".example-source code")).toContainText(
    "SiteHeader",
  );
  await page.getByRole("tab", { name: "Styles", exact: true }).click();
  await expect(page.locator(".example-source code")).toContainText(
    ".recipe-page",
  );
  await page.setViewportSize({ width: 375, height: 850 });
  for (const example of examples) {
    await page.goto(`/#/examples/${example.slug}`);
    await expect(
      page
        .locator(".example-stage")
        .locator(
          "form, .ui-app-shell, .ui-auth-panel, .recipe-website, .appearance-recipe",
        )
        .first(),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(375);
  }
  expect(errors).toEqual([]);
});
test("authenticator errors, recovery path, success, and session revocation work", async ({
  page,
}) => {
  await page.goto("/#/examples/security");
  const code = page.getByRole("textbox", { name: "Authenticator code" });
  await code.fill("000000");
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("wasn’t accepted");
  await code.fill("123456");
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Verification complete");
  await page.getByRole("button", { name: "Reset verification" }).click();
  await page
    .getByRole("button", { name: "Use a recovery code", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Recovery code" }).fill("DEMO-1234");
  await page.getByRole("button", { name: "Verify code", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Verification complete");
  await page
    .getByRole("button", { name: "Sign out: Firefox on Linux" })
    .click();
  await expect(
    page
      .locator(".example-stage")
      .getByText("Example session signed out", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "View setup and recovery" }).click();
  await page.getByRole("button", { name: "Reveal codes" }).click();
  await expect(page.getByRole("dialog")).toContainText("DEMO-1234");
  await page.keyboard.press("Escape");
});
test("appearance settings change the shared preview and source includes its schema", async ({
  page,
}) => {
  await page.goto("/#/examples/appearance");
  const preview = page.locator(".appearance-canvas > div");
  await page
    .getByRole("radiogroup", { name: "App view", exact: true })
    .getByRole("radio", { name: "Casual", exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-view", "casual");
  await page
    .getByRole("radiogroup", { name: "Color scheme", exact: true })
    .getByRole("radio", { name: "Light", exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-ui-theme", "light");
  await page.getByRole("button", { name: "Use #c2410c", exact: true }).click();
  await expect
    .poll(() =>
      preview.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue("--recipe-accent"),
      ),
    )
    .toBe("#c2410c");
  await page
    .getByRole("switch", { name: "Reduce motion", exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-ui-motion", "reduce");
  await page
    .getByRole("switch", {
      name: "Different accent in light mode",
      exact: true,
    })
    .click();
  await expect(
    page.getByLabel("Light mode accent", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("radiogroup", { name: "Surface style", exact: true })
    .getByRole("radio", { name: "Glass", exact: true })
    .click();
  await expect(preview).toHaveAttribute("data-surface", "glass");
  await page.getByText("View and copy the full React source").click();
  await page.getByRole("tab", { name: "Schema", exact: true }).click();
  await expect(page.locator(".example-source code")).toContainText(
    "appearance.adaptiveAccent",
  );
});
test("library filters, favorites and shortcuts plus waitlist and profile states", async ({
  page,
}) => {
  await page.goto("/#/examples/library");
  await page.getByRole("textbox", { name: "Search games" }).fill("Hades");
  await expect(page.locator(".game-example-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Favorite Hades", exact: true })
    .click();
  await page.getByLabel("Filter games").selectOption("favorites");
  await expect(page.locator(".game-example-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(
    "No game or store was opened",
  );
  await page.getByRole("link", { name: "Capture", exact: true }).click();
  await page.getByRole("button", { name: "Save clip hotkey" }).click();
  await page.keyboard.press("Control+Shift+K");
  await expect(
    page.getByRole("button", { name: "Save clip hotkey" }),
  ).toContainText("Ctrl+Shift+K");
  await page.goto("/#/examples/waitlist");
  await page.getByRole("button", { name: "Preview sign-in handoff" }).click();
  await expect(
    page.getByRole("heading", { name: "You’re on the waitlist" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Approved", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your spot is ready" }),
  ).toBeVisible();
  await page.goto("/#/examples/account");
  await page
    .getByRole("textbox", { name: "Display name", exact: true })
    .fill("Sam Rivera");
  await page.getByRole("button", { name: "Save example profile" }).click();
  await expect(page.getByRole("status")).toContainText("Example profile saved");
});
