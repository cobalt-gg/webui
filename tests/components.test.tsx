import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  Button, Calendar, ColorPicker, Combobox, CommandPalette, DownloadItem, FileUpload, FormField, HotkeyInput, Input, NumberInput,
  OTPInput, Pagination, PlayButton, Rating, SegmentedControl, Select, Switch, Table, TagInput, Toaster, TreeView, useToast,
  cx, formatBytes,
} from "@cobalt/ui";

afterEach(cleanup);

describe("utils", () => {
  it("cx joins only non-empty strings", () => {
    expect(cx("a", false, null, undefined, 0, "", "b")).toBe("a b");
  });
  it("formatBytes uses readable units", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(12.4 * 1024 ** 3)).toBe("12.4 GB");
  });
});

describe("Button", () => {
  it("ignores clicks and reports busy while loading", async () => {
    const onClick = vi.fn();
    render(<Button loading loadingLabel="Saving" onClick={onClick}>Save</Button>);
    const btn = screen.getByRole("button", { name: /save/i });
    expect(btn).toHaveAttribute("aria-busy", "true");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });
  it("defaults to type=button so it never submits forms by accident", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });
});

describe("FormField", () => {
  it("wires label, hint and error to the control", () => {
    render(
      <FormField label="Email" hint="We never share it" error="Enter a valid email">
        <Input />
      </FormField>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby")!.split(" ");
    expect(describedBy.map((id) => document.getElementById(id)?.textContent)).toEqual(["We never share it", "Enter a valid email"]);
  });
});

describe("OTPInput", () => {
  it("keeps digits only, caps the length and reports completion", async () => {
    const onComplete = vi.fn();
    render(<OTPInput length={4} onComplete={onComplete} />);
    const input = screen.getByLabelText("Verification code") as HTMLInputElement;
    await userEvent.type(input, "1a2-34 5");
    expect(input.value).toBe("1234");
    expect(onComplete).toHaveBeenCalledWith("1234");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
  });
});

describe("NumberInput", () => {
  it("steps with buttons and arrows and clamps to min/max", async () => {
    render(<NumberInput aria-label="Slots" min={1} max={3} defaultValue={2} />);
    const input = screen.getByRole("spinbutton");
    await userEvent.click(screen.getByLabelText("Increase"));
    expect(input).toHaveValue("3");
    expect(screen.getByLabelText("Increase")).toBeDisabled();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveValue("1");
  });
});

describe("Switch", () => {
  it("toggles from its label", async () => {
    const onChange = vi.fn();
    render(<Switch label="Launch on startup" onCheckedChange={onChange} />);
    await userEvent.click(screen.getByText("Launch on startup"));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });
});

describe("SegmentedControl", () => {
  it("selects one option at a time", async () => {
    const onChange = vi.fn();
    render(<SegmentedControl aria-label="View" onValueChange={onChange} options={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }]} />);
    await userEvent.click(screen.getByText("List"));
    expect(onChange).toHaveBeenCalledWith("list");
    expect(screen.getByText("List").closest("button")).toHaveAttribute("data-state", "on");
  });
});

describe("Combobox", () => {
  it("filters as you type and picks with Enter", async () => {
    const onChange = vi.fn();
    render(<Combobox aria-label="Game" onValueChange={onChange} options={[{ value: "sky", label: "Skyhaven" }, { value: "deep", label: "Deepwater" }]} />);
    const box = screen.getByRole("combobox");
    await userEvent.type(box, "deep");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Deepwater"]);
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("deep");
    expect(box).toHaveValue("Deepwater");
  });
});

describe("TagInput", () => {
  it("adds on Enter, ignores duplicates and removes with Backspace", async () => {
    render(<TagInput aria-label="Tags" defaultValue={["coop"]} />);
    const input = screen.getByLabelText("Tags");
    await userEvent.type(input, "weekend{Enter}coop{Enter}");
    expect(screen.getAllByRole("button", { name: /^Remove/ }).map((b) => b.getAttribute("aria-label"))).toEqual(["Remove coop", "Remove weekend"]);
    await userEvent.type(input, "{Backspace}");
    expect(screen.queryByLabelText("Remove weekend")).toBeNull();
  });
});

describe("Rating", () => {
  it("is a radio group when interactive", async () => {
    const onChange = vi.fn();
    render(<Rating onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText("4 stars"));
    expect(onChange).toHaveBeenCalledWith(4);
  });
  it("is a labelled image when read-only", () => {
    render(<Rating readOnly value={3} />);
    expect(screen.getByRole("img", { name: "Rating: 3 out of 5" })).toBeInTheDocument();
  });
});

describe("Calendar", () => {
  it("moves focus with arrow keys and selects with click", async () => {
    const onChange = vi.fn();
    render(<Calendar defaultValue={new Date(2026, 10, 12)} onValueChange={onChange} locale="en-US" />);
    expect(screen.getByText("November 2026")).toBeInTheDocument();
    const focused = () => document.querySelector<HTMLButtonElement>(".ui-day[tabindex='0']")!;
    expect(focused().textContent).toBe("12");
    fireEvent.keyDown(focused(), { key: "ArrowDown" });
    expect(focused().textContent).toBe("19");
    await userEvent.click(screen.getByRole("button", { name: /November 20, 2026/ }));
    expect(onChange.mock.calls[0][0].getDate()).toBe(20);
  });
});

describe("HotkeyInput", () => {
  it("records a combination and clears with Backspace", () => {
    render(<HotkeyInput aria-label="Overlay" />);
    const btn = screen.getByRole("button", { name: "Overlay" });
    fireEvent.keyDown(btn, { key: "o", ctrlKey: true, shiftKey: true });
    expect(btn.textContent).toBe("CtrlShiftO");
    fireEvent.keyDown(btn, { key: "Backspace" });
    expect(btn.textContent).toMatch(/Press a shortcut|Listening/);
  });
});

describe("Pagination", () => {
  it("marks the current page and collapses far pages", async () => {
    render(<Pagination total={20} defaultPage={10} />);
    expect(screen.getByRole("button", { name: "Page 10" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("button", { name: "Page 5" })).toBeNull();
    await userEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByRole("button", { name: "Page 11" })).toHaveAttribute("aria-current", "page");
  });
});

describe("Table", () => {
  const rows = [{ id: "a", n: "Bravo", s: 2 }, { id: "b", n: "Alpha", s: 9 }];
  const columns = [
    { key: "n", header: "Name", cell: (r: (typeof rows)[0]) => r.n, sortValue: (r: (typeof rows)[0]) => r.n },
    { key: "s", header: "Size", cell: (r: (typeof rows)[0]) => r.s },
  ];
  it("sorts by a sortable column and sets aria-sort", async () => {
    render(<Table rows={rows} columns={columns} rowKey={(r) => r.id} />);
    const names = () => screen.getAllByRole("row").slice(1).map((r) => r.firstElementChild!.textContent);
    expect(names()).toEqual(["Bravo", "Alpha"]);
    await userEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(names()).toEqual(["Alpha", "Bravo"]);
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");
  });
  it("selects all rows from the header checkbox", async () => {
    const Demo = () => {
      const [sel, setSel] = useState<string[]>([]);
      return <Table rows={rows} columns={columns} rowKey={(r) => r.id} selectable selected={sel} onSelectedChange={setSel} />;
    };
    render(<Demo />);
    await userEvent.click(screen.getByLabelText("Select all rows"));
    expect(screen.getByLabelText("Select row a")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByLabelText("Select row b")).toHaveAttribute("aria-checked", "true");
  });
});

describe("TreeView", () => {
  it("expands with ArrowRight and selects with Enter", () => {
    const onSelect = vi.fn();
    render(<TreeView aria-label="Files" onSelect={onSelect} nodes={[{ id: "a", label: "Folder", children: [{ id: "b", label: "File" }] }]} />);
    const folder = screen.getByRole("treeitem", { name: /Folder/ });
    expect(folder).toHaveAttribute("aria-expanded", "false");
    fireEvent.keyDown(folder, { key: "ArrowRight" });
    expect(folder).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("treeitem", { name: "File" }), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("b");
  });
});

describe("FileUpload", () => {
  it("rejects files over maxSize with an alert", () => {
    const onFiles = vi.fn();
    const { container } = render(<FileUpload maxSize={10} onFilesChange={onFiles} />);
    const input = container.querySelector("input[type=file]")!;
    fireEvent.change(input, { target: { files: [new File(["x".repeat(20)], "big.png", { type: "image/png" })] } });
    expect(screen.getByRole("alert")).toHaveTextContent("big.png is larger than");
    expect(onFiles).not.toHaveBeenCalled();
  });
});

describe("CommandPalette", () => {
  it("filters commands and runs the active one with Enter", async () => {
    const run = vi.fn();
    render(<CommandPalette defaultOpen hotkey={false} commands={[{ id: "a", label: "Open store", onSelect: () => {} }, { id: "b", label: "Show downloads", onSelect: run }]} />);
    await userEvent.type(screen.getByRole("combobox"), "down{Enter}");
    expect(run).toHaveBeenCalled();
  });
});

describe("Toaster", () => {
  it("shows queued toasts from useToast", async () => {
    const Fire = () => {
      const toast = useToast();
      return <button onClick={() => toast({ title: "Saved", tone: "success" })}>fire</button>;
    };
    render(<Toaster><Fire /></Toaster>);
    await userEvent.click(screen.getByText("fire"));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });
});

describe("Launcher", () => {
  it("PlayButton label follows state and reports it on click", async () => {
    const onAction = vi.fn();
    const { rerender } = render(<PlayButton state="install" onAction={onAction} />);
    await userEvent.click(screen.getByRole("button", { name: "Install" }));
    expect(onAction).toHaveBeenCalledWith("install");
    rerender(<PlayButton state="downloading" progress={40} />);
    expect(screen.getByRole("button")).toHaveTextContent("Pause40%");
  });
  it("DownloadItem shows size, speed and time left", () => {
    render(<DownloadItem title="Skyhaven" downloaded={1024 ** 3} total={3 * 1024 ** 3} speed={10 * 1024 ** 2} status="downloading" onPause={() => {}} />);
    expect(screen.getByText("1.0 GB / 3.0 GB")).toBeInTheDocument();
    expect(screen.getByText("10.0 MB/s · 4 min left")).toBeInTheDocument();
    expect(screen.getByLabelText("Pause Skyhaven")).toBeInTheDocument();
  });
});


describe("Select (custom)", () => {
  it("opens a listbox, picks with the keyboard and keeps a form value", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <Select aria-label="Language" name="lang" defaultValue="en" onValueChange={onChange} options={[{ value: "en", label: "English" }, { value: "de", label: "Deutsch" }]} />
      </form>,
    );
    const trigger = screen.getByRole("combobox", { name: "Language" });
    expect(trigger).toHaveTextContent("English");
    // Only Radix's hidden form-bubble select exists; the visible control is custom.
    expect(container.querySelector("select:not([aria-hidden='true'])")).toBeNull();
    await userEvent.click(trigger);
    expect(await screen.findByRole("listbox")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: "Deutsch" }));
    expect(onChange).toHaveBeenCalledWith("de");
    expect(trigger).toHaveTextContent("Deutsch");
  });
  it("gets its label and error wiring from FormField", () => {
    render(<FormField label="Region" error="Pick one"><Select options={[{ value: "eu", label: "Europe" }]} /></FormField>);
    const trigger = screen.getByRole("combobox", { name: "Region" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
  });
});

describe("ColorPicker (custom)", () => {
  it("updates from the hex field and moves with arrow keys", async () => {
    const onChange = vi.fn();
    render(<ColorPicker inline label="Accent" defaultValue="#ff0000" onValueChange={onChange} />);
    expect(document.querySelector("input[type=color]")).toBeNull();
    const hex = screen.getByLabelText("Accent hex value");
    await userEvent.clear(hex);
    await userEvent.type(hex, "#3b4275");
    expect(onChange).toHaveBeenLastCalledWith("#3b4275");
    const area = screen.getByRole("slider", { name: "Accent saturation and brightness" });
    fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    const last = onChange.mock.calls.at(-1)![0] as string;
    expect(last).not.toBe("#3b4275");
    expect(last).toMatch(/^#[0-9a-f]{6}$/);
  });
  it("opens from a swatch button that names the current color", async () => {
    render(<ColorPicker label="Accent" defaultValue="#5cdba1" />);
    await userEvent.click(screen.getByRole("button", { name: "Accent: #5cdba1" }));
    expect(await screen.findByRole("slider", { name: "Accent hue" })).toBeInTheDocument();
  });
});
