import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, createRef } from "react";
import {
  OTPInput,
  PasswordInput,
  FormField,
  Accordion,
  OptionCard,
  FileUpload,
  MediaGallery,
  HotkeyInput,
} from "../src";
afterEach(cleanup);
it("OTP supports formatted paste, selection, completion and form submission", async () => {
  const user = userEvent.setup();
  const complete = vi.fn();
  const ref = createRef<HTMLInputElement>();
  function Controlled() {
    const [code, setCode] = useState("");
    return (
      <form aria-label="Verification">
        <OTPInput
          ref={ref}
          label="Code"
          name="code"
          value={code}
          onValueChange={setCode}
          onComplete={complete}
          required
        />
      </form>
    );
  }
  render(<Controlled />);
  const input = screen.getByRole("textbox", { name: "Code" });
  await user.click(input);
  await user.paste("123 456");
  expect(ref.current?.value).toBe("123456");
  expect(complete).toHaveBeenCalledExactlyOnceWith("123456");
  expect(
    new FormData(screen.getByRole("form") as HTMLFormElement).get("code"),
  ).toBe("123456");
  await user.keyboard("{ArrowLeft}{Backspace}");
  expect(ref.current?.value).toBe("12346");
  await user.keyboard("{Control>}a{/Control}");
  await user.paste("abc 98-76-54");
  expect(ref.current?.value).toBe("987654");
  expect(complete).toHaveBeenLastCalledWith("987654");
  expect(ref.current?.getAttribute("autocomplete")).toBe("one-time-code");
});
it("OTP clamps length, supports disabled and exposes invalid state", async () => {
  const user = userEvent.setup();
  render(
    <OTPInput
      label="Short code"
      length={4}
      invalid
      defaultValue="12a3456"
      disabled
    />,
  );
  const input = screen.getByLabelText("Short code") as HTMLInputElement;
  expect(input.value).toBe("1234");
  expect(input.disabled).toBe(true);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  await user.click(input);
  expect(document.activeElement).not.toBe(input);
});
it("password visibility preserves value and form field errors are linked", async () => {
  const user = userEvent.setup();
  render(
    <FormField
      label="Password"
      hint="Use a long password"
      error="Too short"
      required
    >
      {(field) => (
        <PasswordInput
          {...field}
          defaultValue="secret"
          autoComplete="new-password"
        />
      )}
    </FormField>,
  );
  const input = screen.getByLabelText(/^Password/) as HTMLInputElement;
  expect(input.type).toBe("password");
  expect(input.required).toBe(true);
  const ids = input.getAttribute("aria-describedby")!.split(" ");
  expect(
    ids.map((id) => document.getElementById(id)?.textContent).join(" "),
  ).toBe("Use a long password Too short");
  await user.click(screen.getByRole("button", { name: "Show password" }));
  expect(input.type).toBe("text");
  expect(input.value).toBe("secret");
  expect(
    screen
      .getByRole("button", { name: "Hide password" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
});
it("accordion state and native option form semantics work", async () => {
  const user = userEvent.setup();
  render(
    <>
      <Accordion
        items={[
          { value: "one", title: "First question", content: "First answer" },
          { value: "two", title: "Second question", content: "Second answer" },
        ]}
      />
      <form aria-label="Layout">
        <OptionCard
          name="layout"
          value="workspace"
          title="Workspace"
          description="Compact"
          defaultChecked
        />
        <OptionCard
          name="layout"
          value="casual"
          title="Casual"
          description="Roomy"
        />
      </form>
    </>,
  );
  await user.click(screen.getByRole("button", { name: "First question" }));
  expect(
    screen
      .getByRole("button", { name: "First question" })
      .getAttribute("aria-expanded"),
  ).toBe("true");
  await user.click(screen.getByRole("button", { name: "Second question" }));
  expect(
    screen
      .getByRole("button", { name: "First question" })
      .getAttribute("aria-expanded"),
  ).toBe("false");
  await user.click(screen.getByRole("radio", { name: /Casual/ }));
  expect(
    new FormData(screen.getByRole("form") as HTMLFormElement).get("layout"),
  ).toBe("casual");
});
it("upload validates size and type, announces errors and removes selected files", async () => {
  const change = vi.fn();
  render(
    <FileUpload
      label="Avatar"
      accept="image/png"
      maxBytes={100}
      onFilesChange={change}
    />,
  );
  const input = screen.getByLabelText("Avatar");
  fireEvent.change(input, {
    target: { files: [new File(["x"], "bad.txt", { type: "text/plain" })] },
  });
  expect(screen.getByRole("alert").textContent).toContain("supported");
  expect(change).not.toHaveBeenCalled();
  fireEvent.change(input, {
    target: {
      files: [new File(["x".repeat(101)], "large.png", { type: "image/png" })],
    },
  });
  expect(screen.getByRole("alert").textContent).toContain("smaller");
  fireEvent.change(input, {
    target: {
      files: [new File(["image"], "avatar.png", { type: "image/png" })],
    },
  });
  expect(change).toHaveBeenCalledOnce();
  expect(screen.queryByRole("alert")).toBeNull();
  await userEvent.click(
    screen.getByRole("button", { name: "Remove avatar.png" }),
  );
  expect(change).toHaveBeenLastCalledWith([]);
});
it("hotkey recording captures modifiers and does not trap Tab or Escape", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <HotkeyInput
      label="Capture shortcut"
      value="Ctrl+F10"
      onValueChange={change}
    />,
  );
  const trigger = screen.getByRole("button", { name: "Capture shortcut" });
  await user.click(trigger);
  await user.keyboard("{Control>}{Shift>}k{/Shift}{/Control}");
  expect(change).toHaveBeenCalledWith("Ctrl+Shift+K");
  await user.click(trigger);
  await user.keyboard("{Escape}");
  expect(trigger.getAttribute("aria-pressed")).toBe("false");
  await user.click(trigger);
  await user.tab();
  expect(document.activeElement).not.toBe(trigger);
});
it("lightbox arrows change images and Escape restores original thumbnail focus", async () => {
  const user = userEvent.setup();
  render(
    <MediaGallery
      label="Screens"
      items={[
        { src: "/one.webp", alt: "First screen", title: "Library" },
        { src: "/two.webp", alt: "Second screen", title: "Settings" },
      ]}
    />,
  );
  const trigger = screen.getByRole("button", { name: "View Library" });
  await user.click(trigger);
  expect(screen.getByRole("dialog").textContent).toContain("Library");
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("dialog").textContent).toContain("Settings");
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it("OTP preserves read-only values during paste", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <OTPInput
      label="Read-only code"
      readOnly
      defaultValue="123456"
      onValueChange={change}
    />,
  );
  await user.click(screen.getByLabelText("Read-only code"));
  await user.keyboard("{Control>}a{/Control}");
  await user.paste("654321");
  expect(
    (screen.getByLabelText("Read-only code") as HTMLInputElement).value,
  ).toBe("123456");
  expect(change).not.toHaveBeenCalled();
});
