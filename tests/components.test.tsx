import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import {
  Button,
  Dialog,
  AlertDialog,
  Tabs,
  Input,
  ProgressBar,
  Switch,
  SegmentedControl,
  Pagination,
} from "../src";
import { registry } from "../src/registry";
import { Preview } from "../site/src/previews";
import { ToastProvider, ToastViewport } from "../src";
afterEach(cleanup);
it("renders every registered component without throwing", () => {
  for (const c of registry) {
    const view = render(
      <ToastProvider>
        <Preview name={c.name} />
        <ToastViewport />
      </ToastProvider>,
    );
    expect(view.container.querySelector(".demo-content")).toBeTruthy();
    cleanup();
  }
  expect(registry.length).toBe(68);
  expect(new Set(registry.map((c) => c.slug)).size).toBe(registry.length);
});
it("forwards native props and refs and respects disabled actions", async () => {
  const click = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  render(
    <Button ref={ref} disabled onClick={click} data-testid="action">
      Save
    </Button>,
  );
  await userEvent.click(screen.getByText("Save"));
  expect(click).not.toHaveBeenCalled();
  expect(ref.current?.tagName).toBe("BUTTON");
  const inputRef = createRef<HTMLInputElement>();
  render(<Input ref={inputRef} invalid aria-label="Name" required />);
  expect(inputRef.current?.required).toBe(true);
  expect(screen.getByLabelText("Name").getAttribute("aria-invalid")).toBe(
    "true",
  );
});
it("traps and restores dialog focus and dismisses on Escape", async () => {
  const user = userEvent.setup();
  render(
    <Dialog
      trigger={<Button>Open</Button>}
      title="Details"
      description="Edit details"
    >
      <Input aria-label="Name" />
    </Dialog>,
  );
  const trigger = screen.getByText("Open");
  await user.click(trigger);
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  await user.tab();
  expect(document.activeElement).toBe(screen.getByText("Close"));
  await user.tab();
  expect(document.activeElement).toBe(screen.getByLabelText("Name"));
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
it("alert dialog starts at cancel and requires an explicit action", async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(
    <AlertDialog
      trigger={<Button>Remove</Button>}
      title="Confirm"
      description="Review first"
      actionLabel="Confirm remove"
      onAction={action}
    />,
  );
  await user.click(screen.getByText("Remove"));
  expect(document.activeElement).toBe(screen.getByText("Cancel"));
  await user.keyboard("{Escape}");
  expect(action).not.toHaveBeenCalled();
  await user.click(screen.getByText("Remove"));
  await user.click(screen.getByText("Confirm remove"));
  expect(action).toHaveBeenCalledOnce();
});
it("switch and segmented control expose their state", async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <>
      <Switch label="Notifications" onCheckedChange={change} />
      <SegmentedControl
        aria-label="View"
        options={[
          { value: "a", label: "List" },
          { value: "b", label: "Grid" },
        ]}
      />
    </>,
  );
  await user.click(screen.getByRole("switch"));
  expect(change).toHaveBeenCalledWith(true);
  await user.click(screen.getByText("Grid"));
  expect(screen.getByText("Grid").getAttribute("aria-checked")).toBe("true");
});
it("tabs change panels with arrow keys and skip disabled tabs", async () => {
  const user = userEvent.setup();
  render(
    <Tabs
      label="Sections"
      defaultValue="one"
      items={[
        { value: "one", label: "First", content: "One" },
        { value: "two", label: "Disabled", content: "Two", disabled: true },
        { value: "three", label: "Third", content: "Three" },
      ]}
    />,
  );
  screen.getByRole("tab", { name: "First" }).focus();
  await user.keyboard("{ArrowRight}");
  await vi.waitFor(() =>
    expect(screen.getByRole("tabpanel").textContent).toBe("Three"),
  );
});
it("clamps progress values and disables pagination boundaries", () => {
  const page = vi.fn();
  render(
    <>
      <ProgressBar label="Progress" value={150} />
      <Pagination page={1} pageCount={3} onPageChange={page} />
    </>,
  );
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    "100",
  );
  expect((screen.getByText("Previous") as HTMLButtonElement).disabled).toBe(
    true,
  );
  fireEvent.click(screen.getByText("Next"));
  expect(page).toHaveBeenCalledWith(2);
});

it("loading buttons expose busy state and prevent duplicate activation", async () => {
  const click = vi.fn();
  render(
    <Button loading loadingLabel="Saving changes" onClick={click}>
      Save
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Saving changes" });
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect((button as HTMLButtonElement).disabled).toBe(true);
  await userEvent.click(button);
  expect(click).not.toHaveBeenCalled();
});
