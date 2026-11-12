// One live, interactive preview per registry entry. tests/gallery.test.tsx
// fails if a component in the registry has no preview here.
import { useState, type ReactNode } from "react";
import {
  Bell, Bold, Cloud, Cpu, Download, Folder, FileText, Gamepad2, HardDrive, Heart, Home, Italic, Library,
  MessageCircle, MoreHorizontal, Play, Plus, Settings, Share2, ShoppingBag, Star, Trash2, Trophy,
  Underline, User, Users, Zap,
} from "lucide-react";
import * as UI from "@cobalt/ui";

const cover = (slug: string) => `/covers/${slug}.svg`;
const GAMES = [
  ["Skyhaven", "skyhaven"],
  ["Ember Trail", "ember-trail"],
  ["Deepwater", "deepwater"],
  ["Neon Drift", "neon-drift"],
  ["Hollow Pines", "hollow-pines"],
  ["Starfall", "starfall"],
] as const;
const SHOTS = [
  { src: "/examples/library.webp", alt: "Library view in the cobalt Launcher" },
  { src: "/examples/game.webp", alt: "Game page in the cobalt Launcher" },
  { src: "/examples/settings.webp", alt: "Settings in the cobalt Launcher" },
];
const FRIENDS = ["Nova Reyes", "Kai Mercer", "Iris Vale", "Theo Park", "Mila Stone", "Juno Hart"].map((name) => ({ name }));

function Toggleable({ children }: { children: (open: boolean, setOpen: (o: boolean) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>{children(open, setOpen)}</>;
}

function ToastDemo() {
  const toast = UI.useToast();
  return (
    <UI.Inline>
      <UI.Button onClick={() => toast({ title: "Settings saved", tone: "success" })}>Success toast</UI.Button>
      <UI.Button
        variant="ghost"
        onClick={() => toast({ title: "Download failed", description: "Check your connection and try again.", tone: "danger", action: { label: "Retry", onClick: () => {} } })}
      >
        Error toast
      </UI.Button>
    </UI.Inline>
  );
}

function TableDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [
    { id: "skyhaven", name: "Skyhaven", size: 12.4, played: 128 },
    { id: "ember", name: "Ember Trail", size: 34.1, played: 46 },
    { id: "deep", name: "Deepwater", size: 7.9, played: 302 },
    { id: "neon", name: "Neon Drift", size: 21.0, played: 12 },
  ];
  return (
    <UI.Table
      rows={rows}
      rowKey={(r) => r.id}
      selectable
      selected={selected}
      onSelectedChange={setSelected}
      columns={[
        { key: "name", header: "Game", cell: (r) => <strong style={{ fontWeight: 500, color: "var(--ui-text)" }}>{r.name}</strong>, sortValue: (r) => r.name },
        { key: "size", header: "Size", cell: (r) => `${r.size} GB`, sortValue: (r) => r.size, align: "end" },
        { key: "played", header: "Hours", cell: (r) => r.played, sortValue: (r) => r.played, align: "end" },
      ]}
    />
  );
}

function PaletteDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("nothing yet");
  const cmd = (id: string, label: string, group: string, icon: ReactNode, shortcut?: string[]) => ({ id, label, group, icon, shortcut, onSelect: () => setLast(label) });
  return (
    <UI.Stack gap={2} align="start">
      <UI.CommandMenuTrigger onClick={() => setOpen(true)} />
      <span className="ui-hint">Last command: {last}</span>
      <UI.CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        commands={[
          cmd("lib", "Go to library", "Navigate", <Library size={15} />, ["G", "L"]),
          cmd("store", "Open store", "Navigate", <ShoppingBag size={15} />),
          cmd("dl", "Show downloads", "Navigate", <Download size={15} />),
          cmd("sky", "Play Skyhaven", "Games", <Play size={15} />),
          cmd("set", "Settings", "App", <Settings size={15} />, ["⌘", ","]),
        ]}
      />
    </UI.Stack>
  );
}

function LightboxDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <UI.Button onClick={() => setOpen(true)}>Open screenshots</UI.Button>
      <UI.Lightbox images={SHOTS} open={open} onOpenChange={setOpen} />
    </>
  );
}

function DownloadDemo() {
  const [paused, setPaused] = useState(false);
  return (
    <UI.Stack gap={2}>
      <UI.DownloadItem title="Skyhaven" cover={cover("skyhaven")} downloaded={4.6e9} total={12.4e9} speed={paused ? undefined : 48.2e6} status={paused ? "paused" : "downloading"} onPause={() => setPaused(true)} onResume={() => setPaused(false)} onCancel={() => {}} />
      <UI.DownloadItem title="Deepwater" cover={cover("deepwater")} downloaded={0} total={7.9e9} status="queued" onCancel={() => {}} />
    </UI.Stack>
  );
}

function PlayDemo() {
  const [state, setState] = useState<UI.GameState>("install");
  const [progress, setProgress] = useState(0);
  const next = (s: UI.GameState) => {
    if (s === "install") {
      setState("downloading");
      let p = 0;
      const t = window.setInterval(() => {
        p += 7;
        setProgress(Math.min(100, p));
        if (p >= 100) {
          window.clearInterval(t);
          setState("ready");
        }
      }, 120);
    } else if (s === "ready") setState("running");
    else if (s === "running") setState("ready");
  };
  return (
    <UI.Inline gap={3}>
      <UI.PlayButton state={state} progress={progress} onAction={next} />
      <UI.PlayButton state="update" size="md" />
    </UI.Inline>
  );
}

const sampleMenu: UI.MenuItem[] = [
  { label: "Play", icon: <Play size={15} />, shortcut: "↵" },
  { label: "Add to favorites", icon: <Heart size={15} /> },
  { label: "Manage", items: [{ label: "Browse local files" }, { label: "Verify files" }, { label: "Properties" }] },
  { separator: true },
  { label: "Show in library", checked: true },
  { separator: true },
  { label: "Uninstall", icon: <Trash2 size={15} />, danger: true },
];

export const previews: Record<string, () => ReactNode> = {
  /* Text */
  SplitText: () => <UI.SplitText className="pv-display" text="All your games in one place." />,
  ScrambleText: () => <UI.ScrambleText className="pv-display ui-mono" text="READY TO PLAY" />,
  Typewriter: () => <UI.Typewriter className="pv-lg" text="Downloading update 2.4.1…" />,
  GradientText: () => <UI.GradientText className="pv-display">cobalt UI</UI.GradientText>,
  ShinyText: () => <UI.ShinyText className="pv-lg">New: cloud saves for every game</UI.ShinyText>,
  CountUp: () => <span className="pv-display"><UI.CountUp to={1284} suffix=" hrs" autoStart /></span>,
  BlurReveal: () => <UI.BlurReveal className="pv-lg" text="Play anywhere. Pick up where you left off." />,
  Marquee: () => (
    <UI.Marquee speed={22}>
      {["Co-op", "Open world", "Roguelike", "Racing", "Strategy", "Indie", "Puzzle", "Shooter"].map((t) => <UI.Tag key={t}>{t}</UI.Tag>)}
    </UI.Marquee>
  ),
  Kbd: () => (
    <UI.Inline gap={4}>
      <UI.Kbd keys={["⌘", "K"]} />
      <UI.Kbd keys={["Ctrl", "Shift", "P"]} />
      <UI.Kbd>Esc</UI.Kbd>
    </UI.Inline>
  ),
  Highlight: () => <p className="pv-lg" style={{ margin: 0 }}>Downloads are now <UI.Highlight>2× faster</UI.Highlight> on fiber.</p>,
  Heading: () => <UI.Heading level={3} size="lg" eyebrow="Library">Recently played</UI.Heading>,

  /* Actions */
  Button: () => (
    <UI.Stack gap={3}>
      <UI.Inline>
        <UI.Button variant="primary" leading={<Download size={15} />}>Install</UI.Button>
        <UI.Button>Secondary</UI.Button>
        <UI.Button variant="outline">Outline</UI.Button>
        <UI.Button variant="ghost">Ghost</UI.Button>
        <UI.Button variant="danger">Uninstall</UI.Button>
      </UI.Inline>
      <UI.Inline>
        <UI.Button size="sm">Small</UI.Button>
        <UI.Button size="lg" variant="primary">Large</UI.Button>
        <UI.Button loading loadingLabel="Saving">Save</UI.Button>
        <UI.Button disabled>Disabled</UI.Button>
      </UI.Inline>
    </UI.Stack>
  ),
  IconButton: () => (
    <UI.Inline>
      <UI.IconButton aria-label="Settings" icon={<Settings size={16} />} />
      <UI.IconButton aria-label="Notifications" variant="secondary" icon={<Bell size={16} />} />
      <UI.IconButton aria-label="Add" variant="primary" icon={<Plus size={16} />} />
    </UI.Inline>
  ),
  ButtonGroup: () => (
    <UI.Stack gap={3} align="start">
      <UI.ButtonGroup><UI.Button>Cancel</UI.Button><UI.Button variant="primary">Save</UI.Button></UI.ButtonGroup>
      <UI.ButtonGroup attached aria-label="Sort"><UI.Button>Recent</UI.Button><UI.Button>A–Z</UI.Button><UI.Button>Size</UI.Button></UI.ButtonGroup>
    </UI.Stack>
  ),
  Toggle: () => (
    <UI.Inline>
      <UI.Toggle aria-label="Favorite" defaultPressed><Star size={16} /></UI.Toggle>
      <UI.Toggle>Hide installed</UI.Toggle>
    </UI.Inline>
  ),
  Switch: () => (
    <UI.Stack gap={4} style={{ width: "100%", maxWidth: 360 }}>
      <UI.Switch label="Launch on startup" description="Opens minimized to the tray" defaultChecked />
      <UI.Switch label="Auto-update games" />
    </UI.Stack>
  ),
  SegmentedControl: () => (
    <UI.SegmentedControl aria-label="View" options={[{ value: "grid", label: "Grid" }, { value: "list", label: "List" }, { value: "shelf", label: "Shelf" }]} />
  ),
  ToggleGroup: () => (
    <UI.ToggleGroup aria-label="Formatting" defaultValue={["bold"]} options={[{ value: "bold", label: "Bold", icon: <Bold size={15} /> }, { value: "italic", label: "Italic", icon: <Italic size={15} /> }, { value: "underline", label: "Underline", icon: <Underline size={15} /> }]} />
  ),
  CopyButton: () => <UI.CopyButton value="cobalt.gg/invite/8F2K-Q7" label="Copy invite link" />,
  SplitButton: () => <UI.SplitButton label={<><Play size={15} fill="currentColor" /> Play</>} actions={[{ label: "Play offline", onSelect: () => {} }, { label: "Play with mods", onSelect: () => {} }]} />,

  /* Inputs */
  Input: () => (
    <UI.Stack gap={3} style={{ maxWidth: 320, width: "100%" }}>
      <UI.Input aria-label="Display name" placeholder="Display name" leading={<User size={15} />} />
      <UI.Input aria-label="Invalid" defaultValue="taken-name" invalid />
    </UI.Stack>
  ),
  Textarea: () => <div style={{ width: "100%", maxWidth: 360 }}><UI.Textarea aria-label="Review" placeholder="Write a review…" showCount maxLength={280} autoResize /></div>,
  SearchInput: () => {
    const Demo = () => {
      const [q, setQ] = useState("");
      return <UI.SearchInput placeholder="Search library" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shortcut="/" />;
    };
    return <div style={{ width: "100%", maxWidth: 320 }}><Demo /></div>;
  },
  PasswordInput: () => (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <UI.FormField label="New password"><UI.PasswordInput showStrength autoComplete="new-password" /></UI.FormField>
    </div>
  ),
  NumberInput: () => <UI.NumberInput aria-label="Download slots" min={1} max={8} defaultValue={3} />,
  InputGroup: () => (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <UI.InputGroup prefix="cobalt.gg/u/"><UI.Input aria-label="Profile URL" defaultValue="nova" /></UI.InputGroup>
    </div>
  ),
  OTPInput: () => <UI.OTPInput label="Verification code" />,
  Select: () => (
    <UI.Inline gap={3}>
      <div style={{ width: 220 }}>
        <UI.Select aria-label="Language" defaultValue="en" options={[{ value: "en", label: "English" }, { value: "de", label: "Deutsch" }, { value: "ja", label: "日本語" }, { value: "pt", label: "Português" }]} />
      </div>
      <div style={{ width: 240 }}>
        <UI.Select aria-label="Install location" placeholder="Choose a drive" options={[{ value: "ssd", label: "Games SSD", hint: "412 GB free", icon: <Zap size={15} /> }, { value: "hdd", label: "Storage", hint: "1.8 TB free", icon: <HardDrive size={15} /> }, { value: "ext", label: "External", hint: "Offline", disabled: true }]} />
      </div>
    </UI.Inline>
  ),
  Checkbox: () => (
    <UI.Stack gap={3}>
      <UI.Checkbox label="Sync achievements" description="Uploads unlocks when you're online" defaultChecked />
      <UI.Checkbox label="Share playtime with friends" />
      <UI.Checkbox label="Indeterminate" checked="indeterminate" />
    </UI.Stack>
  ),
  RadioGroup: () => (
    <UI.RadioGroup label="Download region" defaultValue="auto" options={[{ value: "auto", label: "Automatic", description: "Picks the fastest server" }, { value: "eu", label: "Europe" }, { value: "na", label: "North America" }]} />
  ),
  OptionCard: () => (
    <div style={{ width: "100%" }}>
      <UI.OptionCard
        label="Install location"
        defaultValue="ssd"
        options={[
          { value: "ssd", label: "Games SSD", description: "D:\\Games", icon: <Zap size={18} />, meta: "412 GB free" },
          { value: "hdd", label: "Storage", description: "E:\\Library", icon: <HardDrive size={18} />, meta: "1.8 TB free" },
        ]}
      />
    </div>
  ),
  Slider: () => <div style={{ width: "100%", maxWidth: 320 }}><UI.Slider label="Volume" showValue defaultValue={64} formatValue={(n) => `${n}%`} /></div>,
  FormField: () => {
    const Demo = () => {
      const [v, setV] = useState("nova@");
      const err = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? undefined : "Enter a valid email address.";
      return (
        <UI.FormField label="Email" hint="Used for sign-in and receipts." error={err} required>
          <UI.Input type="email" value={v} onChange={(e) => setV(e.target.value)} />
        </UI.FormField>
      );
    };
    return <div style={{ width: "100%", maxWidth: 340 }}><Demo /></div>;
  },
  FileUpload: () => <div style={{ width: "100%", maxWidth: 380 }}><UI.FileUpload accept="image/*" maxSize={5_000_000} label="Drop a profile picture or browse" hint="PNG or JPG, up to 5 MB" /></div>,
  ColorPicker: () => (
    <UI.Inline gap={5} align="start">
      <UI.ColorPicker label="Accent color" />
      <UI.ColorPicker label="Highlight color" defaultValue="#5cdba1" inline />
    </UI.Inline>
  ),
  HotkeyInput: () => <UI.HotkeyInput aria-label="Overlay shortcut" defaultValue={["Shift", "Tab"]} />,

  /* Pickers */
  Combobox: () => (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <UI.Combobox aria-label="Game" placeholder="Find a game…" options={GAMES.map(([label, value]) => ({ label, value, hint: value === "skyhaven" ? "Installed" : undefined }))} />
    </div>
  ),
  TagInput: () => <div style={{ width: "100%", maxWidth: 360 }}><UI.TagInput aria-label="Collection tags" defaultValue={["co-op", "weekend"]} /></div>,
  RangeSlider: () => <div style={{ width: "100%", maxWidth: 320 }}><UI.RangeSlider label="Price" min={0} max={80} defaultValue={[10, 40]} formatValue={(n) => `$${n}`} /></div>,
  Rating: () => (
    <UI.Inline gap={5}>
      <UI.Rating defaultValue={4} label="Your rating" />
      <UI.Rating readOnly value={3.5} size={14} />
    </UI.Inline>
  ),
  Calendar: () => <UI.Calendar defaultValue={new Date()} />,
  DatePicker: () => <UI.DatePicker placeholder="Schedule download" />,

  /* Navigation */
  Tabs: () => (
    <div style={{ width: "100%" }}>
      <UI.Tabs
        aria-label="Library filter"
        items={[
          { value: "all", label: "All games", badge: 48, content: <p className="ui-hint">48 games across 2 drives.</p> },
          { value: "installed", label: "Installed", badge: 12, content: <p className="ui-hint">12 installed, 214 GB.</p> },
          { value: "fav", label: "Favorites", content: <p className="ui-hint">Star a game to pin it here.</p> },
        ]}
      />
    </div>
  ),
  Breadcrumbs: () => <UI.Breadcrumbs items={[{ label: "Library", href: "#" }, { label: "Collections", href: "#" }, { label: "Co-op nights" }]} />,
  SidebarItem: () => (
    <div className="pv-sidebar">
      <UI.SidebarItem href="#" icon={<Home />} active onClick={(e) => e.preventDefault()}>Home</UI.SidebarItem>
      <UI.SidebarItem href="#" icon={<Library />} badge={48} onClick={(e) => e.preventDefault()}>Library</UI.SidebarItem>
      <UI.SidebarItem href="#" icon={<Download />} badge={2} onClick={(e) => e.preventDefault()}>Downloads</UI.SidebarItem>
    </div>
  ),
  SidebarSection: () => (
    <div className="pv-sidebar">
      <UI.SidebarSection title="Collections" action={<UI.IconButton size="sm" aria-label="New collection" icon={<Plus size={14} />} />}>
        <UI.SidebarItem href="#" icon={<Folder />} onClick={(e) => e.preventDefault()}>Co-op nights</UI.SidebarItem>
        <UI.SidebarItem href="#" icon={<Folder />} onClick={(e) => e.preventDefault()}>Backlog</UI.SidebarItem>
      </UI.SidebarSection>
    </div>
  ),
  NavigationItem: () => (
    <UI.Inline gap={1}>
      <UI.NavigationItem href="#" active onClick={(e) => e.preventDefault()}>Library</UI.NavigationItem>
      <UI.NavigationItem href="#" onClick={(e) => e.preventDefault()}>Store</UI.NavigationItem>
      <UI.NavigationItem href="#" badge={3} onClick={(e) => e.preventDefault()}>Friends</UI.NavigationItem>
    </UI.Inline>
  ),
  Pagination: () => <UI.Pagination total={12} defaultPage={5} />,
  CommandMenuTrigger: () => <UI.CommandMenuTrigger />,
  Stepper: () => (
    <div style={{ width: "100%" }}>
      <UI.Stepper current={1} steps={[{ label: "Account" }, { label: "Import library" }, { label: "Install" }, { label: "Play" }]} />
    </div>
  ),
  SiteHeader: () => (
    <div className="pv-frame">
      <UI.SiteHeader
        brand={<Logo />}
        links={[{ label: "Features", href: "#", active: true }, { label: "Games", href: "#" }, { label: "Support", href: "#" }]}
        actions={<UI.Button variant="primary" size="sm">Download</UI.Button>}
      />
    </div>
  ),
  SiteFooter: () => (
    <div className="pv-frame">
      <UI.SiteFooter
        brand={<Stack><Logo /><span>One launcher for every game.</span></Stack>}
        columns={[
          { title: "Product", links: [{ label: "Download", href: "#" }, { label: "Changelog", href: "#" }] },
          { title: "Company", links: [{ label: "About", href: "#" }, { label: "Brand", href: "#" }] },
        ]}
        legal="© 2026 cobalt"
      />
    </div>
  ),
  Menubar: () => (
    <UI.Menubar
      menus={[
        { label: "File", items: [{ label: "Add game…", shortcut: "⌘N" }, { label: "Import library" }, { separator: true }, { label: "Quit", shortcut: "⌘Q" }] },
        { label: "View", items: [{ label: "Grid", checked: true }, { label: "List", checked: false }, { separator: true }, { label: "Show hidden games", checked: false }] },
        { label: "Help", items: [{ label: "Support" }, { label: "Release notes" }] },
      ]}
    />
  ),
  Toolbar: () => (
    <UI.Toolbar aria-label="Formatting">
      <UI.ToolbarButton aria-label="Bold"><Bold size={15} /></UI.ToolbarButton>
      <UI.ToolbarButton aria-label="Italic"><Italic size={15} /></UI.ToolbarButton>
      <UI.ToolbarSeparator />
      <UI.ToolbarButton>Share</UI.ToolbarButton>
    </UI.Toolbar>
  ),
  TreeView: () => (
    <div style={{ width: 260 }}>
      <UI.TreeView
        aria-label="Mods"
        defaultExpanded={["sky"]}
        nodes={[
          { id: "sky", label: "Skyhaven", icon: <Folder />, children: [{ id: "tex", label: "HD textures", icon: <FileText /> }, { id: "ui", label: "Minimal HUD", icon: <FileText /> }] },
          { id: "ember", label: "Ember Trail", icon: <Folder />, children: [{ id: "coop", label: "8-player co-op", icon: <FileText /> }] },
        ]}
      />
    </div>
  ),

  /* Overlays */
  Dialog: () => (
    <UI.Dialog
      trigger={<UI.Button>Game details</UI.Button>}
      title="Skyhaven"
      description="Installed on Games SSD · 12.4 GB"
      footer={<UI.DialogClose asChild><UI.Button variant="primary">Done</UI.Button></UI.DialogClose>}
    >
      <UI.DescriptionList items={[{ term: "Developer", detail: "Northlight Studio" }, { term: "Last played", detail: "2 hours ago" }, { term: "Playtime", detail: "128 hours" }]} />
    </UI.Dialog>
  ),
  AlertDialog: () => (
    <UI.AlertDialog
      trigger={<UI.Button variant="danger">Uninstall</UI.Button>}
      title="Uninstall Skyhaven?"
      description="This frees 12.4 GB. Your saves stay in the cloud."
      confirmLabel="Uninstall"
      onConfirm={() => {}}
    />
  ),
  Sheet: () => (
    <UI.Sheet trigger={<UI.Button leading={<Users size={15} />}>Friends</UI.Button>} title="Friends" description="3 online">
      <UI.Stack gap={1}>
        <UI.FriendRow name="Nova Reyes" status="playing" activity="Skyhaven" />
        <UI.FriendRow name="Kai Mercer" status="online" />
        <UI.FriendRow name="Iris Vale" status="away" />
        <UI.FriendRow name="Theo Park" status="offline" />
      </UI.Stack>
    </UI.Sheet>
  ),
  Popover: () => (
    <UI.Popover trigger={<UI.Button>Filters</UI.Button>} title="Show">
      <UI.Stack gap={2}>
        <UI.Checkbox label="Installed" defaultChecked />
        <UI.Checkbox label="Favorites" />
        <UI.Checkbox label="Hidden" />
      </UI.Stack>
    </UI.Popover>
  ),
  Tooltip: () => (
    <UI.Inline>
      <UI.Tooltip content="Settings" shortcut={["⌘", ","]}><UI.IconButton aria-label="Settings" icon={<Settings size={16} />} /></UI.Tooltip>
      <UI.Tooltip content="Share" side="bottom"><UI.IconButton aria-label="Share" icon={<Share2 size={16} />} /></UI.Tooltip>
    </UI.Inline>
  ),
  HoverCard: () => (
    <UI.HoverCard trigger={<a href="#" className="pv-link" onClick={(e) => e.preventDefault()}>@nova</a>}>
      <UI.Stack gap={3}>
        <UI.Inline gap={3}><UI.Avatar alt="Nova Reyes" size="lg" status="playing" /><UI.Stack gap={0}><strong>Nova Reyes</strong><span className="ui-hint">Playing Skyhaven</span></UI.Stack></UI.Inline>
        <span className="ui-hint">Friends since 2024 · 312 achievements</span>
      </UI.Stack>
    </UI.HoverCard>
  ),
  DropdownMenu: () => <UI.DropdownMenu trigger={<UI.IconButton aria-label="Game options" variant="secondary" icon={<MoreHorizontal size={16} />} />} items={sampleMenu} />,
  ContextMenu: () => (
    <UI.ContextMenu items={sampleMenu}>
      <div className="pv-dropzone">Right-click here</div>
    </UI.ContextMenu>
  ),
  CommandPalette: () => <PaletteDemo />,
  Lightbox: () => <LightboxDemo />,

  /* Feedback */
  Toast: () => <ToastDemo />,
  Alert: () => (
    <UI.Stack gap={2} style={{ width: "100%" }}>
      <UI.Alert tone="accent" title="Cloud saves are on">Your progress syncs across every device you sign in on.</UI.Alert>
      <UI.Alert tone="warning" title="Update required" action={<UI.Button size="sm">Update</UI.Button>}>Skyhaven needs 1.2 GB to keep playing online.</UI.Alert>
      <UI.Alert tone="danger" title="Download failed">Check your connection and try again.</UI.Alert>
    </UI.Stack>
  ),
  Banner: () => (
    <div className="pv-frame">
      <UI.Banner action={<UI.Button size="sm" variant="ghost">Restart now</UI.Button>} onDismiss={() => {}}>cobalt 2.4 is ready. Restart to update.</UI.Banner>
    </div>
  ),
  ProgressBar: () => (
    <UI.Stack gap={4} style={{ width: "100%", maxWidth: 380 }}>
      <UI.ProgressBar label="Downloading Skyhaven" value={62} showValue />
      <UI.ProgressBar label="Verifying files" />
    </UI.Stack>
  ),
  ProgressRing: () => (
    <UI.Inline gap={5}>
      <UI.ProgressRing value={72} />
      <UI.ProgressRing value={100} tone="success" size={48} thickness={5}><Trophy size={16} /></UI.ProgressRing>
    </UI.Inline>
  ),
  Meter: () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <UI.Meter label="Games SSD · 412 GB free of 1 TB" max={1000} segments={[{ label: "Games", value: 486 }, { label: "Mods", value: 42, tone: "success" }, { label: "Other", value: 60, tone: "neutral" }]} />
    </div>
  ),
  Spinner: () => <UI.Inline gap={4}><UI.Spinner size="sm" /><UI.Spinner /><UI.Spinner size="lg" label="Loading library" /></UI.Inline>,
  Skeleton: () => (
    <UI.Inline gap={3} align="start" wrap={false} style={{ width: "100%", maxWidth: 380 }}>
      <UI.Skeleton shape="circle" />
      <UI.Skeleton lines={3} />
    </UI.Inline>
  ),
  Badge: () => (
    <UI.Inline>
      <UI.Badge>Neutral</UI.Badge>
      <UI.Badge tone="accent">New</UI.Badge>
      <UI.Badge tone="success">Installed</UI.Badge>
      <UI.Badge tone="warning">Update</UI.Badge>
      <UI.Badge tone="danger" variant="solid">Error</UI.Badge>
      <UI.Badge variant="outline">Beta</UI.Badge>
    </UI.Inline>
  ),
  StatusIndicator: () => (
    <UI.Inline gap={4}>
      <UI.StatusIndicator status="online" pulse />
      <UI.StatusIndicator status="playing" label="In game" />
      <UI.StatusIndicator status="away" />
      <UI.StatusIndicator status="offline" />
    </UI.Inline>
  ),

  /* Data */
  Card: () => (
    <div style={{ width: "100%", maxWidth: 340 }}>
      <UI.Card title="Storage" description="2 drives connected" action={<UI.IconButton size="sm" aria-label="Storage settings" icon={<Settings size={14} />} />} footer={<UI.Button size="sm">Manage</UI.Button>}>
        486 GB used by games.
      </UI.Card>
    </div>
  ),
  ListItem: () => (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <UI.ListItem title="Skyhaven" description="Played 2 hours ago" leading={<img src={cover("skyhaven")} alt="" width={32} height={42} style={{ borderRadius: 4 }} />} trailing="128 h" onSelect={() => {}} />
      <UI.ListItem title="Deepwater" description="Not installed" leading={<img src={cover("deepwater")} alt="" width={32} height={42} style={{ borderRadius: 4 }} />} trailing="7.9 GB" onSelect={() => {}} />
    </div>
  ),
  Avatar: () => (
    <UI.Inline gap={3}>
      <UI.Avatar alt="Nova Reyes" size="sm" />
      <UI.Avatar alt="Kai Mercer" status="online" />
      <UI.Avatar alt="Iris Vale" size="lg" status="playing" />
      <UI.Avatar alt="Theo Park" size="xl" shape="square" />
    </UI.Inline>
  ),
  AvatarGroup: () => <UI.AvatarGroup people={FRIENDS} max={4} size="md" />,
  Table: () => <div style={{ width: "100%" }}><TableDemo /></div>,
  EmptyState: () => (
    <div style={{ width: "100%" }}>
      <UI.EmptyState icon={<Gamepad2 size={20} />} title="Nothing here yet" description="Install a game and it'll show up in your library." action={<UI.Button variant="primary">Browse store</UI.Button>} />
    </div>
  ),
  Divider: () => (
    <UI.Stack gap={4} style={{ width: "100%", maxWidth: 360 }}>
      <UI.Divider />
      <UI.Divider label="or continue with" />
      <UI.Inline gap={3}><span>Library</span><UI.Divider orientation="vertical" /><span>Store</span></UI.Inline>
    </UI.Stack>
  ),
  Tag: () => {
    const Demo = () => {
      const [tags, setTags] = useState(["Co-op", "Open world", "Roguelike"]);
      return <UI.Inline>{tags.map((t) => <UI.Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</UI.Tag>)}<UI.Tag icon={<Cpu />}>Steam Deck</UI.Tag></UI.Inline>;
    };
    return <Demo />;
  },
  CodeBlock: () => <div style={{ width: "100%" }}><UI.CodeBlock title="Install" language="bash" code={'npm install github:cobalt-gg/webui\nnpm run dev'} lineNumbers /></div>,
  CopyField: () => <div style={{ width: "100%", maxWidth: 400 }}><UI.CopyField label="Invite link" value="https://cobalt.gg/invite/8F2K-Q7" /></div>,
  RecoveryCodes: () => <div style={{ width: "100%", maxWidth: 380 }}><UI.RecoveryCodes codes={["DEMO-1234", "DEMO-5678", "DEMO-9012", "DEMO-3456", "DEMO-7890", "DEMO-2468"]} /></div>,
  DeviceSession: () => (
    <UI.Stack gap={2} style={{ width: "100%", maxWidth: 420 }}>
      <UI.DeviceSession device="Windows PC" location="Berlin" lastActive="Active now" current />
      <UI.DeviceSession device="iPhone" kind="mobile" location="Berlin" lastActive="3 days ago" onRevoke={() => {}} />
    </UI.Stack>
  ),
  Accordion: () => (
    <div style={{ width: "100%" }}>
      <UI.Accordion
        defaultValue={["saves"]}
        items={[
          { value: "saves", title: "Where are my saves stored?", content: "In the cloud and on this device. They sync when you go online." },
          { value: "move", title: "Can I move a game to another drive?", content: "Yes. Open the game's menu and choose Manage › Move install folder." },
          { value: "offline", title: "Does cobalt work offline?", content: "Games you've played once will launch offline for 30 days." },
        ]}
      />
    </div>
  ),
  StatCard: () => (
    <UI.Grid columns={2} style={{ width: "100%" }}>
      <UI.StatCard label="Hours this month" value="42" delta="+12%" trend="up" spark={[4, 6, 5, 8, 7, 9, 12]} icon={<Gamepad2 size={16} />} />
      <UI.StatCard label="Avg. download" value="48 MB/s" delta="−6%" trend="down" spark={[9, 8, 8, 7, 7, 6, 6]} />
    </UI.Grid>
  ),
  Sparkline: () => (
    <UI.Inline gap={5}>
      <UI.Sparkline data={[3, 5, 4, 8, 6, 9, 7, 11]} label="Playtime trend" />
      <UI.Sparkline data={[9, 7, 8, 5, 6, 4, 3]} area={false} width={120} height={32} />
    </UI.Inline>
  ),
  FeatureCard: () => (
    <UI.Grid columns={2} style={{ width: "100%" }}>
      <UI.FeatureCard icon={<Cloud size={18} />} title="Cloud saves" description="Your progress follows you to every device." />
      <UI.FeatureCard icon={<Zap size={18} />} title="Fast downloads" description="Parallel chunks and resume after reboot." href="#" />
    </UI.Grid>
  ),
  DescriptionList: () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <UI.DescriptionList items={[{ term: "Developer", detail: "Northlight Studio" }, { term: "Released", detail: "12 Mar 2025" }, { term: "Size", detail: "12.4 GB" }]} />
    </div>
  ),
  Timeline: () => (
    <UI.Timeline
      items={[
        { title: "Update 2.4", time: "Today", description: "Faster downloads and a new friends panel.", tone: "accent" },
        { title: "Achievement unlocked", time: "Yesterday", description: "First flight in Skyhaven.", icon: <Trophy />, tone: "success" },
        { title: "Installed Deepwater", time: "3 days ago" },
      ]}
    />
  ),
  MediaGallery: () => <div style={{ width: "100%" }}><UI.MediaGallery items={SHOTS} /></div>,
  Carousel: () => (
    <div style={{ width: "100%" }}>
      <UI.Carousel aria-label="Featured games" slideWidth="150px">
        {GAMES.map(([title, slug]) => <UI.GameCard key={slug} title={title} cover={cover(slug)} subtitle="Featured" />)}
      </UI.Carousel>
    </div>
  ),

  /* Layout */
  Stack: () => <UI.Stack gap={2} style={{ width: 200 }}>{[1, 2, 3].map((n) => <div key={n} className="pv-block">Item {n}</div>)}</UI.Stack>,
  Inline: () => <UI.Inline gap={2}>{[1, 2, 3, 4].map((n) => <div key={n} className="pv-block">Item {n}</div>)}</UI.Inline>,
  Grid: () => <UI.Grid minItemWidth="90px" gap={2} style={{ width: "100%" }}>{Array.from({ length: 8 }, (_, n) => <div key={n} className="pv-block">{n + 1}</div>)}</UI.Grid>,
  Container: () => <div className="pv-frame" style={{ padding: "12px 0" }}><UI.Container size="sm"><div className="pv-block">Max 640px, centered</div></UI.Container></div>,
  Panel: () => (
    <div style={{ width: "100%" }}>
      <UI.Panel title="Downloads" description="Applies to all games" actions={<UI.Button size="sm">Reset</UI.Button>}>
        <UI.SettingsRow title="Limit bandwidth" description="Keep some speed for streaming" control={<UI.Switch aria-label="Limit bandwidth" />} />
        <UI.SettingsRow title="Simultaneous downloads" control={<UI.NumberInput aria-label="Simultaneous downloads" size="sm" defaultValue={2} min={1} max={6} />} />
      </UI.Panel>
    </div>
  ),
  SplitView: () => (
    <div style={{ width: "100%" }}>
      <UI.SplitView asideWidth="140px" aside={<div className="pv-block" style={{ height: 96 }}>Aside</div>}>
        <div className="pv-block" style={{ height: 96 }}>Main</div>
      </UI.SplitView>
    </div>
  ),
  SettingsRow: () => (
    <div style={{ width: "100%" }}>
      <UI.SettingsRow title="Launch on startup" description="Opens minimized to the tray" control={<UI.Switch aria-label="Launch on startup" defaultChecked />} />
      <UI.SettingsRow title="Language" control={<div style={{ width: 160 }}><UI.Select aria-label="Language" size="sm" defaultValue="en" options={[{ value: "en", label: "English" }, { value: "de", label: "Deutsch" }]} /></div>} />
    </div>
  ),
  AppShell: () => (
    <div className="pv-frame" style={{ height: 320 }}>
      <UI.AppShell
        sidebar={
          <>
            <Logo small />
            <UI.SidebarSection>
              <UI.SidebarItem href="#" icon={<Home />} active onClick={(e) => e.preventDefault()}>Home</UI.SidebarItem>
              <UI.SidebarItem href="#" icon={<Library />} onClick={(e) => e.preventDefault()}>Library</UI.SidebarItem>
              <UI.SidebarItem href="#" icon={<Download />} badge={2} onClick={(e) => e.preventDefault()}>Downloads</UI.SidebarItem>
            </UI.SidebarSection>
          </>
        }
        header={<><strong style={{ fontWeight: 600 }}>Home</strong><span style={{ marginLeft: "auto" }}><UI.Avatar alt="Nova Reyes" size="sm" status="online" /></span></>}
      >
        <UI.Grid minItemWidth="96px" gap={3}>
          {GAMES.slice(0, 4).map(([t, s]) => <UI.GameCard key={s} title={t} cover={cover(s)} />)}
        </UI.Grid>
      </UI.AppShell>
    </div>
  ),
  PageHeader: () => (
    <div style={{ width: "100%" }}>
      <UI.PageHeader headingLevel={4} eyebrow="Library" title="Recently played" description="Pick up where you left off." actions={<UI.Button leading={<Plus size={15} />}>Add game</UI.Button>} />
    </div>
  ),
  AuthPanel: () => {
    const Demo = () => {
      const [code, setCode] = useState("");
      return (
        <UI.AuthPanel headingLevel={4} logo={<img src="/brand/cobalt-app-icon.svg" alt="" width={48} height={48} />} title="Verify it's you" description="Enter the 6-digit code from your authenticator app." footer={<a href="#" className="pv-link">Use a recovery code</a>}>
          <UI.OTPInput value={code} onValueChange={setCode} />
          <UI.Button variant="primary" fullWidth disabled={code.length !== 6}>Continue</UI.Button>
        </UI.AuthPanel>
      );
    };
    return <Demo />;
  },
  AspectRatio: () => <div style={{ width: "100%", maxWidth: 360 }}><UI.AspectRatio ratio={16 / 9}><img src="/examples/game.webp" alt="Game page screenshot" /></UI.AspectRatio></div>,
  ScrollArea: () => (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <UI.ScrollArea maxHeight={160} aria-label="Friends">
        <UI.Stack gap={1} style={{ padding: 4 }}>
          {[...FRIENDS, ...FRIENDS].map((f, i) => <UI.FriendRow key={i} name={f.name} status={i % 3 === 0 ? "online" : "offline"} />)}
        </UI.Stack>
      </UI.ScrollArea>
    </div>
  ),

  /* Launcher */
  PlayButton: () => <PlayDemo />,
  GameCard: () => (
    <UI.Grid minItemWidth="130px" gap={4} style={{ width: "100%" }}>
      <UI.GameCard title="Skyhaven" cover={cover("skyhaven")} subtitle="Played 2h ago" />
      <UI.GameCard title="Ember Trail" cover={cover("ember-trail")} subtitle="Downloading" progress={46} />
      <UI.GameCard title="Neon Drift" cover={cover("neon-drift")} subtitle="Not installed" installed={false} badge={<UI.Badge tone="accent" variant="solid">New</UI.Badge>} />
      <UI.GameCard title="Starfall" cover={cover("starfall")} subtitle="128 hours" />
    </UI.Grid>
  ),
  GameHero: () => (
    <div style={{ width: "100%" }}>
      <UI.GameHero
        headingLevel={4}
        title="Skyhaven"
        art="/examples/game.webp"
        meta={<><UI.Badge tone="success">Installed</UI.Badge><span>Northlight Studio · Open world</span></>}
        actions={<UI.Inline><UI.PlayButton state="ready" /><UI.IconButton aria-label="Game settings" variant="secondary" size="lg" icon={<Settings size={18} />} /></UI.Inline>}
        stats={[{ label: "Played", value: "128 h" }, { label: "Achievements", value: "34/50" }, { label: "Last played", value: "2h ago" }]}
      />
    </div>
  ),
  DownloadItem: () => <div style={{ width: "100%" }}><DownloadDemo /></div>,
  FriendRow: () => (
    <UI.Stack gap={1} style={{ width: "100%", maxWidth: 320 }}>
      <UI.FriendRow name="Nova Reyes" status="playing" activity="Skyhaven" actions={<><UI.IconButton size="sm" aria-label="Message Nova" icon={<MessageCircle size={14} />} /><UI.IconButton size="sm" aria-label="Join Nova" icon={<Play size={14} />} /></>} />
      <UI.FriendRow name="Kai Mercer" status="online" />
      <UI.FriendRow name="Iris Vale" status="busy" />
      <UI.FriendRow name="Theo Park" status="offline" />
    </UI.Stack>
  ),
  AchievementCard: () => (
    <UI.Stack gap={2} style={{ width: "100%" }}>
      <UI.AchievementCard title="First flight" description="Leave the starting island." unlocked unlockedAt="12 Nov 2026" rarity={64} />
      <UI.AchievementCard title="Cartographer" description="Discover every region." progress={{ value: 7, max: 12 }} rarity={8.4} />
      <UI.AchievementCard title="Untouchable" description="Finish the story without dying." unlocked rarity={1.2} unlockedAt="Yesterday" />
    </UI.Stack>
  ),
  TitleBar: () => (
    <UI.Stack gap={3} style={{ width: "100%" }}>
      <div className="pv-frame"><UI.TitleBar title={<Logo small />} center={<UI.CommandMenuTrigger style={{ height: 28, width: 280 }} />} /></div>
      <div className="pv-frame"><UI.TitleBar platform="mac" title="cobalt" /></div>
    </UI.Stack>
  ),
};

function Logo({ small }: { small?: boolean }) {
  return (
    <span className="pv-logo">
      <img className="pv-on-dark" src="/brand/cobalt-lockup-white.svg" alt="cobalt" height={small ? 16 : 20} />
      <img className="pv-on-light" src="/brand/cobalt-lockup-black.svg" alt="cobalt" height={small ? 16 : 20} />
    </span>
  );
}

function Stack({ children }: { children: ReactNode }) {
  return <UI.Stack gap={2}>{children}</UI.Stack>;
}

export { Logo };
