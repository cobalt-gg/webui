import { useId, useState } from "react";
import * as UI from "@cobalt/ui";
import { Plus, Ellipsis } from "lucide-react";
import { PatternPreview } from "./pattern-previews";
import type { ComponentName } from "../../src/registry";
export interface PreviewOptions {
  size: UI.Size;
  variant: UI.ButtonProps["variant"];
  disabled: boolean;
}
export function Preview({
  name,
  size = "md",
  variant = "primary",
  disabled = false,
}: { name: ComponentName } & Partial<PreviewOptions>) {
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(false);
  const [action, setAction] = useState("");
  const [command, setCommand] = useState("");
  const id = useId();
  const menu = [
    { label: "Duplicate", onSelect: () => setAction("Item duplicated") },
    { label: "Archive", onSelect: () => setAction("Item archived") },
    {
      label: "Delete",
      destructive: true,
      onSelect: () => setAction("Item deleted"),
    },
    { label: "Unavailable", disabled: true },
  ];
  const trigger = (label: string) => (
    <UI.Button variant="secondary" size={size} disabled={disabled}>
      {label}
    </UI.Button>
  );
  const options = [
    { value: "list", label: "List" },
    { value: "grid", label: "Grid" },
    { value: "board", label: "Board" },
  ];
  const demoPanels = [
    {
      value: "overview",
      label: "Overview",
      content: "Everything you need, in one place.",
    },
    {
      value: "activity",
      label: "Activity",
      content: "Your recent activity appears here.",
    },
    {
      value: "settings",
      label: "Settings",
      content: "Manage your project preferences.",
    },
  ];
  let preview: React.ReactNode;
  switch (name) {
    case "Button":
      preview = (
        <UI.Inline>
          <UI.Button size={size} variant={variant} disabled={disabled}>
            Continue
          </UI.Button>
          <UI.Button size={size} variant="secondary" disabled={disabled}>
            Secondary
          </UI.Button>
          <UI.Button size={size} variant="ghost" disabled={disabled}>
            Ghost
          </UI.Button>
        </UI.Inline>
      );
      break;
    case "IconButton":
      preview = (
        <UI.Inline>
          <UI.IconButton
            aria-label="Add item"
            size={size}
            variant={variant}
            disabled={disabled}
            onClick={() => setAction("Item added")}
          >
            <Plus size={16} aria-hidden="true" />
          </UI.IconButton>
          <UI.IconButton
            aria-label="More options"
            variant="secondary"
            disabled={disabled}
          >
            <Ellipsis size={16} aria-hidden="true" />
          </UI.IconButton>
        </UI.Inline>
      );
      break;
    case "ButtonGroup":
      preview = (
        <UI.ButtonGroup aria-label="Text alignment">
          {["Left", "Center", "Right"].map((t) => (
            <UI.Button
              key={t}
              size={size}
              variant="secondary"
              onClick={() => setAction(`${t} aligned`)}
            >
              {t}
            </UI.Button>
          ))}
        </UI.ButtonGroup>
      );
      break;
    case "Toggle":
      preview = (
        <UI.Toggle aria-label="Bold text" disabled={disabled}>
          Bold
        </UI.Toggle>
      );
      break;
    case "Switch":
      preview = (
        <UI.Switch label="Notifications" defaultChecked disabled={disabled} />
      );
      break;
    case "SegmentedControl":
      preview = (
        <UI.SegmentedControl
          aria-label="Display view"
          defaultValue="list"
          options={options}
          disabled={disabled}
        />
      );
      break;
    case "Input":
      preview = (
        <UI.Input
          aria-label="Project name"
          placeholder="Project name"
          size={size}
          disabled={disabled}
        />
      );
      break;
    case "Textarea":
      preview = (
        <UI.Textarea
          aria-label="Description"
          placeholder="Write a description…"
          disabled={disabled}
        />
      );
      break;
    case "SearchInput":
      preview = (
        <UI.SearchInput
          aria-label="Search example"
          placeholder="Search anything…"
          size={size}
          disabled={disabled}
        />
      );
      break;
    case "Select":
      preview = (
        <UI.Select aria-label="Region" size={size} disabled={disabled}>
          <option>Choose a region</option>
          <option>Europe</option>
          <option>Americas</option>
          <option>Asia Pacific</option>
        </UI.Select>
      );
      break;
    case "Checkbox":
      preview = (
        <UI.Stack>
          <UI.Checkbox
            label="Include archived"
            defaultChecked
            disabled={disabled}
          />
          <UI.Checkbox label="Only favorites" disabled={disabled} />
        </UI.Stack>
      );
      break;
    case "Radio":
      preview = (
        <fieldset className="demo-fieldset">
          <legend>Plan</legend>
          <UI.Inline>
            <UI.Radio
              name={id}
              label="Basic"
              value="basic"
              defaultChecked
              disabled={disabled}
            />
            <UI.Radio name={id} label="Pro" value="pro" disabled={disabled} />
          </UI.Inline>
        </fieldset>
      );
      break;
    case "Slider":
      preview = (
        <UI.Slider
          aria-label="Volume"
          defaultValue={60}
          min={0}
          max={100}
          disabled={disabled}
        />
      );
      break;
    case "NumberInput":
      preview = (
        <UI.NumberInput
          aria-label="Quantity"
          min={1}
          max={99}
          defaultValue={3}
          size={size}
          disabled={disabled}
        />
      );
      break;
    case "Tabs":
      preview = (
        <UI.Tabs
          label="Project sections"
          defaultValue="overview"
          items={demoPanels}
        />
      );
      break;
    case "Breadcrumbs":
      preview = (
        <UI.Breadcrumbs>
          <li>
            <a href="#/">Home</a>
          </li>
          <li>
            <a href="#/">Components</a>
          </li>
          <li aria-current="page">Current page</li>
        </UI.Breadcrumbs>
      );
      break;
    case "SidebarItem":
      preview = (
        <UI.Stack gap={1}>
          <UI.SidebarItem href="#/sidebar-item" active>
            Overview
          </UI.SidebarItem>
          <UI.SidebarItem href="#/sidebar-item">Activity</UI.SidebarItem>
        </UI.Stack>
      );
      break;
    case "NavigationItem":
      preview = (
        <UI.Inline>
          <UI.NavigationItem href="#/navigation-item" active>
            Overview
          </UI.NavigationItem>
          <UI.NavigationItem href="#/navigation-item">
            Settings
          </UI.NavigationItem>
        </UI.Inline>
      );
      break;
    case "Pagination":
      preview = (
        <UI.Pagination page={page} pageCount={5} onPageChange={setPage} />
      );
      break;
    case "CommandMenuTrigger":
      preview = (
        <UI.Dialog
          trigger={<UI.CommandMenuTrigger />}
          title="Commands"
          description="Search the example command list."
        >
          <UI.SearchInput
            aria-label="Search commands"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
          {["Create project", "Open settings", "View activity"]
            .filter((x) => x.toLowerCase().includes(command.toLowerCase()))
            .map((x) => (
              <UI.Button
                key={x}
                variant="ghost"
                onClick={() => setAction(`${x} selected`)}
              >
                {x}
              </UI.Button>
            ))}
        </UI.Dialog>
      );
      break;
    case "Dialog":
      preview = (
        <UI.Dialog
          trigger={trigger("Open dialog")}
          title="Project details"
          description="A focused space for information and actions."
        >
          <UI.Input aria-label="Project title" placeholder="Untitled project" />
        </UI.Dialog>
      );
      break;
    case "AlertDialog":
      preview = (
        <UI.AlertDialog
          trigger={trigger("Remove item")}
          title="Remove this item?"
          description="This example only updates the preview. No data will be changed."
          actionLabel="Remove item"
          onAction={() => setAction("Example item removed")}
        />
      );
      break;
    case "Popover":
      preview = (
        <UI.Popover trigger={trigger("Quick details")} label="Quick details">
          <strong>Project overview</strong>
          <p className="demo-paragraph">
            Everything is up to date. Last reviewed just now.
          </p>
        </UI.Popover>
      );
      break;
    case "DropdownMenu":
      preview = (
        <UI.DropdownMenu
          trigger={trigger("Actions")}
          items={menu}
          label="Item actions"
        />
      );
      break;
    case "ContextMenu":
      preview = (
        <UI.ContextMenu items={menu} label="Context actions">
          Right-click or press Shift + F10
        </UI.ContextMenu>
      );
      break;
    case "Tooltip":
      preview = (
        <UI.Tooltip content="Add a new item">
          <UI.IconButton aria-label="Add item" variant="secondary">
            <Plus size={16} aria-hidden="true" />
          </UI.IconButton>
        </UI.Tooltip>
      );
      break;
    case "Sheet":
      preview = (
        <UI.Sheet
          trigger={trigger("Open sheet")}
          title="Project settings"
          description="A little more room for supporting content."
        >
          <UI.Checkbox label="Send notifications" defaultChecked />
        </UI.Sheet>
      );
      break;
    case "Toast":
      preview = (
        <>
          <UI.Button variant="secondary" onClick={() => setToast(true)}>
            Show notification
          </UI.Button>
          <UI.Toast
            title="Changes saved"
            description="Your preferences are up to date."
            open={toast}
            onOpenChange={setToast}
          />
        </>
      );
      break;
    case "Alert":
      preview = (
        <UI.Alert tone="success" title="All changes saved">
          Your project is up to date.
        </UI.Alert>
      );
      break;
    case "ProgressBar":
      preview = (
        <UI.Stack>
          <div className="demo-caption">
            Uploading files <span>64%</span>
          </div>
          <UI.ProgressBar label="Upload progress" value={64} />
        </UI.Stack>
      );
      break;
    case "Spinner":
      preview = (
        <UI.Inline>
          <UI.Spinner />
          <span>Loading results…</span>
        </UI.Inline>
      );
      break;
    case "Skeleton":
      preview = (
        <UI.Stack gap={2}>
          <UI.Skeleton style={{ width: "65%" }} />
          <UI.Skeleton />
          <UI.Skeleton style={{ width: "85%" }} />
        </UI.Stack>
      );
      break;
    case "Badge":
      preview = (
        <UI.Inline>
          <UI.Badge size={size}>Draft</UI.Badge>
          <UI.Badge tone="success" size={size}>
            Ready
          </UI.Badge>
          <UI.Badge tone="warning" size={size}>
            Pending
          </UI.Badge>
          <UI.Badge tone="danger" size={size}>
            Failed
          </UI.Badge>
        </UI.Inline>
      );
      break;
    case "StatusIndicator":
      preview = (
        <UI.Inline>
          <UI.StatusIndicator>Operational</UI.StatusIndicator>
          <UI.StatusIndicator tone="warning">Degraded</UI.StatusIndicator>
        </UI.Inline>
      );
      break;
    case "Card":
      preview = (
        <UI.Card>
          <strong>A place for your content</strong>
          <p className="demo-paragraph">A simple surface with room to build.</p>
          <UI.Badge>Project</UI.Badge>
        </UI.Card>
      );
      break;
    case "ListItem":
      preview = (
        <ul className="demo-list">
          <UI.ListItem>Getting started</UI.ListItem>
          <UI.ListItem>Project configuration</UI.ListItem>
        </ul>
      );
      break;
    case "Avatar":
      preview = (
        <UI.Inline>
          <UI.Avatar alt="Alex Morgan" fallback="AM" size="sm" />
          <UI.Avatar alt="Sam Lee" fallback="SL" />
          <UI.Avatar alt="Taylor Reed" fallback="TR" size="lg" />
        </UI.Inline>
      );
      break;
    case "Table":
      preview = (
        <UI.Table>
          <caption className="ui-sr-only">Example projects</caption>
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Website</td>
              <td>
                <UI.Badge tone="success">Ready</UI.Badge>
              </td>
            </tr>
            <tr>
              <td>Dashboard</td>
              <td>
                <UI.Badge>Draft</UI.Badge>
              </td>
            </tr>
          </tbody>
        </UI.Table>
      );
      break;
    case "EmptyState":
      preview = (
        <UI.EmptyState
          title="Nothing here yet"
          description="Your items will appear here."
        />
      );
      break;
    case "Divider":
      preview = (
        <UI.Stack>
          <span>First section</span>
          <UI.Divider />
          <span>Second section</span>
        </UI.Stack>
      );
      break;
    case "CodeBlock":
      preview = <UI.CodeBlock code={'import { Button } from "@cobalt/ui";'} />;
      break;
    case "Stack":
      preview = (
        <UI.Stack gap={2}>
          {["First item", "Second item", "Third item"].map((x) => (
            <div className="demo-box" key={x}>
              {x}
            </div>
          ))}
        </UI.Stack>
      );
      break;
    case "Inline":
      preview = (
        <UI.Inline gap={2}>
          {["One", "Two", "Three"].map((x) => (
            <div className="demo-box" key={x}>
              {x}
            </div>
          ))}
        </UI.Inline>
      );
      break;
    case "Container":
      preview = (
        <UI.Container>
          <div className="demo-box">Centered content</div>
        </UI.Container>
      );
      break;
    case "Panel":
      preview = (
        <UI.Panel>
          <strong>Supporting information</strong>
          <p className="demo-paragraph">A quiet surface for related content.</p>
        </UI.Panel>
      );
      break;
    case "SplitView":
      preview = (
        <UI.SplitView>
          <UI.Panel>Sidebar</UI.Panel>
          <UI.Panel>Main content</UI.Panel>
        </UI.SplitView>
      );
      break;
    case "OTPInput":
    case "PasswordInput":
    case "FormField":
    case "InputGroup":
    case "CopyField":
    case "RecoveryCodes":
    case "DeviceSession":
    case "SettingsRow":
    case "Accordion":
    case "Stepper":
    case "OptionCard":
    case "FileUpload":
    case "StatCard":
    case "FeatureCard":
    case "AppShell":
    case "PageHeader":
    case "AuthPanel":
    case "SiteHeader":
    case "SiteFooter":
    case "MediaGallery":
    case "ColorPicker":
    case "HotkeyInput":
      preview = <PatternPreview name={name} disabled={disabled} />;
      break;
    default: {
      const exhaustive: never = name;
      throw new Error(`Missing preview: ${exhaustive}`);
    }
  }
  return (
    <div className="demo-content">
      {preview}
      {action && (
        <p className="demo-result" role="status">
          {action}
        </p>
      )}
    </div>
  );
}
export function Variants({ name }: { name: ComponentName }) {
  if (name === "OTPInput")
    return (
      <UI.Stack gap={5}>
        <UI.OTPInput label="Empty code" />
        <UI.OTPInput label="Completed code" defaultValue="123456" />
        <UI.OTPInput label="Invalid code" defaultValue="000000" invalid />
        <UI.OTPInput
          label="Four-digit code"
          length={4}
          separatorAfter={0}
          defaultValue="1234"
        />
        <UI.OTPInput label="Disabled code" disabled defaultValue="123456" />
        <UI.OTPInput label="Read-only code" readOnly defaultValue="123456" />
      </UI.Stack>
    );
  if (name === "FormField")
    return (
      <UI.Stack>
        <UI.FormField label="Email" hint="A linked hint.">
          {(field) => (
            <UI.Input {...field} type="email" placeholder="you@example.com" />
          )}
        </UI.FormField>
        <UI.FormField label="Email with error" error="Enter a valid email.">
          {(field) => (
            <UI.Input {...field} type="email" defaultValue="invalid" />
          )}
        </UI.FormField>
      </UI.Stack>
    );
  if (name === "PasswordInput")
    return (
      <UI.Stack>
        <PatternPreview name={name} />
        <PatternPreview name={name} disabled />
      </UI.Stack>
    );

  if (name === "Button" || name === "IconButton")
    return (
      <UI.Stack>
        {(["primary", "secondary", "ghost", "destructive"] as const).map(
          (v) => (
            <UI.Inline key={v}>
              <span className="variant-label">{v}</span>
              {(["sm", "md", "lg"] as const).map((s) =>
                name === "Button" ? (
                  <UI.Button key={s} variant={v} size={s}>
                    {s}
                  </UI.Button>
                ) : (
                  <UI.IconButton
                    key={s}
                    aria-label={`${v} ${s} add`}
                    variant={v}
                    size={s}
                  >
                    <Plus size={16} aria-hidden="true" />
                  </UI.IconButton>
                ),
              )}
            </UI.Inline>
          ),
        )}
        <UI.Button disabled>Disabled</UI.Button>
        <UI.Button loading loadingLabel="Saving…">
          Save changes
        </UI.Button>
      </UI.Stack>
    );
  if (
    ["Input", "SearchInput", "NumberInput", "Select", "Textarea"].includes(name)
  )
    return (
      <UI.Stack>
        {(["sm", "md", "lg"] as const).map((s) => (
          <Preview key={s} name={name} size={s} />
        ))}
        <UI.Input
          aria-label="Invalid example"
          invalid
          defaultValue="Invalid value"
        />
        <UI.Input
          aria-label="Disabled example"
          disabled
          placeholder="Disabled field"
        />
      </UI.Stack>
    );
  if (["Badge", "Alert", "StatusIndicator"].includes(name))
    return (
      <UI.Stack>
        {(["neutral", "success", "warning", "danger"] as const).map((t) =>
          name === "Alert" ? (
            <UI.Alert key={t} tone={t} title={t}>
              A contextual message.
            </UI.Alert>
          ) : name === "Badge" ? (
            <UI.Inline key={t}>
              {(["sm", "md", "lg"] as const).map((s) => (
                <UI.Badge key={s} tone={t} size={s}>
                  {t} · {s}
                </UI.Badge>
              ))}
            </UI.Inline>
          ) : (
            <UI.StatusIndicator key={t} tone={t}>
              {t}
            </UI.StatusIndicator>
          ),
        )}
      </UI.Stack>
    );
  if (name === "Card")
    return (
      <UI.Inline>
        {(["outlined", "elevated", "filled"] as const).map((v) => (
          <UI.Card key={v} variant={v}>
            {v}
          </UI.Card>
        ))}
      </UI.Inline>
    );
  if (
    [
      "Toggle",
      "Switch",
      "Checkbox",
      "Radio",
      "Slider",
      "SegmentedControl",
    ].includes(name)
  )
    return (
      <UI.Stack>
        <Preview name={name} />
        <Preview name={name} disabled />
      </UI.Stack>
    );
  if (name === "ProgressBar")
    return (
      <UI.Stack>
        {[0, 50, 100].map((v) => (
          <UI.ProgressBar key={v} label={`${v}% complete`} value={v} />
        ))}
      </UI.Stack>
    );
  if (name === "Tabs")
    return (
      <UI.Tabs
        label="Disabled tab example"
        defaultValue="first"
        items={[
          { value: "first", label: "Active", content: "Active panel" },
          { value: "second", label: "Available", content: "Second panel" },
          { value: "third", label: "Disabled", content: "", disabled: true },
        ]}
      />
    );
  return <Preview name={name} />;
}
