// Component metadata shared by the gallery and consumers (`@cobalt/ui/registry`).
// No React imports: safe to load in docs tooling.

export const categories = [
  "Text",
  "Actions",
  "Inputs",
  "Pickers",
  "Navigation",
  "Overlays",
  "Feedback",
  "Data",
  "Layout",
  "Launcher",
] as const;

export type Category = (typeof categories)[number];

export interface PropDoc {
  name: string;
  description: string;
}

export interface ComponentDoc {
  name: string;
  slug: string;
  category: Category;
  description: string;
  props: PropDoc[];
  example: string;
  accessibility: string;
  tags: string[];
  /** Added in the 1.0 rebuild */
  isNew?: boolean;
}

const slug = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function c(
  name: string,
  category: Category,
  description: string,
  example: string,
  accessibility: string,
  props: [string, string][] = [],
  tags: string[] = [],
  isNew = false,
): ComponentDoc {
  return {
    name,
    slug: slug(name),
    category,
    description,
    example,
    accessibility,
    props: props.map(([n, d]) => ({ name: n, description: d })),
    tags,
    ...(isNew ? { isNew } : {}),
  };
}

const NEW = true;
const replay = "Exposes the full text once to assistive technology and hides the animated pieces. Enter or Space replays it. Reduced motion skips the animation.";

export const registry: ComponentDoc[] = [
  // Text
  c("SplitText", "Text", "Letters or words rise in sequence when clicked.", '<SplitText text="All your games in one place." />', replay, [["text", "string"], ["by", "char | word"], ["stagger", "ms between pieces"]], ["animation", "headline"]),
  c("ScrambleText", "Text", "Scrambles into glyphs and decodes back, left to right.", '<ScrambleText text="Ready to play" />', replay, [["text", "string"], ["duration", "ms"]], ["glitch", "decode"]),
  c("Typewriter", "Text", "Retypes its text with a blinking caret.", '<Typewriter text="Downloading update…" />', replay, [["text", "string"], ["speed", "ms per character"], ["cursor", "boolean"]], ["typing"]),
  c("GradientText", "Text", "Cobalt gradient fill; click to sweep it across.", "<GradientText>cobalt</GradientText>", "Plain text with a background-clip fill. Check contrast if you pass your own colors.", [["colors", "CSS color stops"]], ["gradient"]),
  c("ShinyText", "Text", "One highlight passes over the text on click.", "<ShinyText>New: cloud saves</ShinyText>", "Decorative only; the text is unchanged for assistive technology.", [], ["shimmer"]),
  c("CountUp", "Text", "Counts to a number with an ease-out curve.", "<CountUp to={1284} suffix=\" games\" autoStart />", "The final value is the accessible label, so screen readers never hear intermediate numbers.", [["to / from", "numbers"], ["duration", "ms"], ["decimals", "number"], ["prefix / suffix", "string"], ["autoStart", "count on mount"]], ["number", "stat"]),
  c("BlurReveal", "Text", "Words sharpen out of a blur one after another.", '<BlurReveal text="Play anywhere, pick up where you left off." />', replay, [["text", "string"], ["stagger", "ms"]], ["reveal"], NEW),
  c("Marquee", "Text", "Endless horizontal scroll for logos or tags. Pauses on hover.", "<Marquee><Tag>Indie</Tag>…</Marquee>", "The duplicate track is aria-hidden. Stops entirely with reduced motion.", [["speed", "seconds per loop"], ["reverse", "boolean"], ["pauseOnHover", "boolean"]], ["ticker", "logos"], NEW),
  c("Kbd", "Text", "Keyboard key caps, single or as a combination.", '<Kbd keys={["⌘", "K"]} />', "Uses <kbd>. Pair symbols with a written hint where the meaning isn't obvious.", [["keys", "string[]"]], ["shortcut", "keyboard"], NEW),
  c("Highlight", "Text", "Marker-style highlight for a phrase.", "<Highlight>2× faster</Highlight>", "Uses <mark>, which screen readers may announce as highlighted.", [["tone", "accent | success | warning | danger"]], ["mark"], NEW),
  c("Heading", "Text", "Heading with optional eyebrow; level and visual size are independent.", '<Heading level={1} size="xl" eyebrow="Library">Recently played</Heading>', "Choose level for document outline and size for looks; never skip levels for styling.", [["level", "1–4"], ["size", "sm | md | lg | xl | display"], ["eyebrow", "ReactNode"]], ["title", "typography"], NEW),

  // Actions
  c("Button", "Actions", "Primary, secondary, outline, ghost and danger buttons with loading state.", '<Button variant="primary" leading={<Download />}>Install</Button>', "Native <button>. While loading, sets aria-busy, announces loadingLabel and ignores clicks.", [["variant", "primary | secondary | outline | ghost | danger"], ["size", "sm | md | lg"], ["loading / loadingLabel", "boolean / string"], ["leading / trailing", "ReactNode"], ["asChild", "style a child link as a button"]], ["cta", "submit"]),
  c("IconButton", "Actions", "Square icon-only button.", '<IconButton aria-label="Settings" icon={<Settings />} />', "aria-label is required because there is no visible text.", [["icon", "ReactNode"], ["aria-label", "string (required)"]], ["icon"]),
  c("ButtonGroup", "Actions", "Groups related buttons, optionally joined into one bar.", "<ButtonGroup attached>…</ButtonGroup>", "role=group. Add aria-label when the grouping meaning isn't clear from context.", [["attached", "boolean"]], ["group"]),
  c("Toggle", "Actions", "A button that stays pressed.", '<Toggle aria-label="Favorite"><Star /></Toggle>', "Exposes aria-pressed.", [["pressed / defaultPressed", "boolean"], ["onPressedChange", "(pressed) => void"]], ["pressed"]),
  c("Switch", "Actions", "On/off switch with optional label and description.", '<Switch label="Launch on startup" description="Opens minimised" />', "role=switch with checked state; the whole label row toggles it.", [["checked / defaultChecked", "boolean"], ["onCheckedChange", "(checked) => void"], ["label / description", "ReactNode"]], ["toggle", "setting"]),
  c("SegmentedControl", "Actions", "Single choice from 2–5 options with a sliding indicator.", '<SegmentedControl aria-label="View" options={[{value:"grid",label:"Grid"},{value:"list",label:"List"}]} />', "Radix toggle group with arrow-key navigation.", [["options", "{ value, label, icon? }[]"], ["value / onValueChange", "string"], ["fullWidth", "boolean"]], ["tabs", "switcher"]),
  c("ToggleGroup", "Actions", "Several independent toggles in one bar.", '<ToggleGroup aria-label="Filters" options={…} />', "Each item is a pressed toggle; arrows move between them.", [["options", "{ value, label, icon? }[]"], ["value / onValueChange", "string[]"]], ["filters", "multi"], NEW),
  c("CopyButton", "Actions", "Copies a string and confirms for two seconds.", '<CopyButton value="cobalt.gg/invite/8F2K" />', "The label change is announced politely.", [["value", "string"], ["label / copiedLabel", "string"], ["onCopy", "(value) => void"]], ["clipboard"], NEW),
  c("SplitButton", "Actions", "Primary action with a menu of alternatives.", '<SplitButton label="Play" actions={[{label:"Play offline", onSelect}]} />', "The menu trigger has its own label (menuLabel).", [["label", "ReactNode"], ["actions", "{ label, onSelect, disabled? }[]"], ["menuLabel", "string"]], ["menu", "dropdown"], NEW),

  // Inputs
  c("Input", "Inputs", "Text input with optional leading and trailing adornments.", '<Input placeholder="Display name" leading={<User />} />', "Inside FormField it picks up id, aria-describedby and aria-invalid automatically.", [["size", "sm | md | lg"], ["leading / trailing", "ReactNode"], ["invalid", "boolean"]], ["text", "field"]),
  c("Textarea", "Inputs", "Multi-line input with optional counter and auto-resize.", "<Textarea showCount maxLength={280} autoResize />", "The counter is a polite live region.", [["showCount", "boolean"], ["autoResize", "boolean"], ["invalid", "boolean"]], ["multiline"]),
  c("SearchInput", "Inputs", "Search field with clear button and shortcut hint.", '<SearchInput value={q} onChange={…} onClear={() => setQ("")} shortcut="/" />', "type=search with an accessible name from placeholder unless aria-label is set.", [["onClear", "() => void"], ["shortcut", "string"]], ["search", "filter"]),
  c("PasswordInput", "Inputs", "Password with show/hide and optional strength meter.", "<PasswordInput showStrength autoComplete=\"new-password\" />", "The reveal button is a labelled toggle; strength is announced politely.", [["showStrength", "boolean"]], ["password", "auth"]),
  c("NumberInput", "Inputs", "Stepper input with clamping and arrow keys.", "<NumberInput min={0} max={16} defaultValue={4} />", "role=spinbutton with aria-valuenow/min/max.", [["value / onValueChange", "number"], ["min / max / step", "number"]], ["stepper", "quantity"]),
  c("InputGroup", "Inputs", "Joins an input with addons or buttons.", '<InputGroup prefix="https://"><Input /></InputGroup>', "Addons are visual; include them in the label if they change meaning.", [["prefix / suffix", "ReactNode"]], ["addon"]),
  c("OTPInput", "Inputs", "One native input drawn as code cells: autofill, paste and form submit work.", '<OTPInput onComplete={verify} />', "Single input with autocomplete=one-time-code; the cells are hidden from assistive technology.", [["length", "1–12, default 6"], ["value / onValueChange", "string"], ["onComplete", "(code) => void"], ["separatorAfter", "number"]], ["2fa", "verification", "auth"]),
  c("Select", "Inputs", "Custom dropdown with icons, hints and a check on the chosen option.", '<Select aria-label="Language" options={[{value:"en",label:"English"}]} />', "Radix select: arrows, typeahead, Home/End and Escape; a hidden native select keeps form submission working.", [["options", "{ value, label, hint?, icon?, disabled? }[]"], ["value / onValueChange", "string"], ["placeholder", "string"], ["size", "sm | md | lg"], ["name", "form field name"]], ["dropdown", "listbox"]),
  c("Checkbox", "Inputs", "Checkbox with label, description and indeterminate state.", '<Checkbox label="Sync achievements" />', "Radix checkbox; the label is a real <label>.", [["checked", "boolean | 'indeterminate'"], ["onCheckedChange", "(checked) => void"], ["label / description", "ReactNode"]], ["check"]),
  c("RadioGroup", "Inputs", "Radio buttons with roving focus. Also exported as Radio.", '<RadioGroup label="Region" options={…} />', "Fieldset + legend; arrow keys move selection.", [["options", "{ value, label, description? }[]"], ["orientation", "vertical | horizontal"]], ["radio", "choice"]),
  c("OptionCard", "Inputs", "Large selectable cards that behave as a radio group.", '<OptionCard label="Install location" options={…} />', "Radix radio group with card visuals.", [["options", "{ value, label, description?, icon?, meta? }[]"], ["columns", "number"]], ["plan", "choice"]),
  c("Slider", "Inputs", "Single-value slider with optional label and value.", '<Slider label="Volume" showValue />', "Radix slider; arrow, Page and Home/End keys work.", [["value / onValueChange", "number"], ["min / max / step", "number"], ["formatValue", "(n) => string"]], ["range", "volume"]),
  c("FormField", "Inputs", "Label, hint and error wired to the control inside.", '<FormField label="Email" hint="We never share it" error={err}><Input type="email" /></FormField>', "Generates ids and connects aria-describedby and aria-invalid for children; also accepts a render function.", [["label / hint / error", "ReactNode"], ["required", "boolean"], ["aside", "ReactNode"]], ["form", "label"]),
  c("FileUpload", "Inputs", "Drop zone with local type and size checks.", '<FileUpload accept="image/*" maxSize={5_000_000} />', "The drop zone is a button; errors use role=alert. Validate on the server too.", [["accept", "string"], ["multiple", "boolean"], ["maxSize", "bytes"], ["onFilesChange", "(files) => void"]], ["upload", "drop"]),
  c("ColorPicker", "Inputs", "Saturation/brightness area, hue slider, hex field and presets, in a popover or inline.", "<ColorPicker label=\"Accent color\" />", "The area is a slider (arrows adjust saturation and brightness, Shift for bigger steps); hue is a slider; presets are labelled toggles.", [["value / onValueChange", "hex string"], ["presets", "string[]"], ["inline", "boolean"]], ["color", "picker"]),
  c("HotkeyInput", "Inputs", "Focus and press keys to record a shortcut.", "<HotkeyInput defaultValue={[\"Shift\", \"Tab\"]} />", "Tab still moves focus; Backspace clears.", [["value / onValueChange", "string[]"]], ["shortcut", "keybind"]),

  // Pickers
  c("Combobox", "Pickers", "Type to filter a list; arrows and Enter to pick.", '<Combobox aria-label="Game" options={games} />', "ARIA combobox with listbox and aria-activedescendant.", [["options", "{ value, label, hint? }[]"], ["value / onValueChange", "string | null"]], ["autocomplete", "search", "select"], NEW),
  c("TagInput", "Pickers", "Enter or comma adds a tag; Backspace removes the last.", '<TagInput aria-label="Tags" defaultValue={["coop"]} />', "Each tag has a labelled remove button.", [["value / onValueChange", "string[]"], ["max", "number"]], ["chips", "multi"], NEW),
  c("RangeSlider", "Pickers", "Two-thumb slider for a min–max range.", '<RangeSlider label="Price" formatValue={n => `$${n}`} />', "Thumbs are labelled Minimum and Maximum.", [["value / onValueChange", "[number, number]"], ["min / max / step", "number"]], ["filter", "price"], NEW),
  c("Rating", "Pickers", "Star rating input, or read-only display.", "<Rating defaultValue={4} />", "Interactive mode is a radio group; read-only is an image with a text label.", [["value / onValueChange", "number"], ["max", "number"], ["readOnly", "boolean"]], ["stars", "review"], NEW),
  c("Calendar", "Pickers", "Month grid with keyboard navigation.", "<Calendar onValueChange={setDate} />", "Grid of buttons with full-date labels; arrows move by day/week, PageUp/PageDown by month.", [["value / onValueChange", "Date"], ["min / max", "Date"], ["weekStartsOn", "0 | 1"], ["locale", "string"]], ["date"], NEW),
  c("DatePicker", "Pickers", "Field that opens a Calendar in a popover.", "<DatePicker />", "The trigger announces the chosen date; focus moves into the calendar.", [["value / onValueChange", "Date"], ["placeholder", "string"]], ["date", "schedule"], NEW),

  // Navigation
  c("Tabs", "Navigation", "Underline or pill tabs with optional badges.", '<Tabs items={[{value:"all",label:"All",content:…}]} />', "Radix tabs: arrow keys, Home/End, linked panels.", [["items", "{ value, label, content?, icon?, badge? }[]"], ["variant", "underline | pill"]], ["tabs"]),
  c("Breadcrumbs", "Navigation", "Path back to parent pages.", '<Breadcrumbs items={[{label:"Library",href:"/"},{label:"Skyhaven"}]} />', "nav landmark with aria-current on the last item.", [["items", "{ label, href? }[]"]], ["path"]),
  c("SidebarItem", "Navigation", "Vertical navigation link with icon and badge.", '<SidebarItem href="#" icon={<Library />} active>Library</SidebarItem>', "Sets aria-current=page when active.", [["active", "boolean"], ["icon / badge / trailing", "ReactNode"]], ["sidebar", "link"]),
  c("SidebarSection", "Navigation", "Labelled group of sidebar items.", '<SidebarSection title="Collections">…</SidebarSection>', "Purely structural; titles are text, not headings.", [["title / action", "ReactNode"]], ["sidebar", "group"], NEW),
  c("NavigationItem", "Navigation", "Horizontal top-nav link.", '<NavigationItem href="#" active>Store</NavigationItem>', "Sets aria-current=page when active.", [["active", "boolean"]], ["link", "header"]),
  c("Pagination", "Navigation", "Page numbers with previous/next and gaps.", "<Pagination total={12} />", "nav landmark; current page has aria-current.", [["page / onPageChange", "number"], ["total", "number"], ["siblings", "number"]], ["pages"]),
  c("CommandMenuTrigger", "Navigation", "Search-looking button that opens a CommandPalette.", "<CommandMenuTrigger onClick={() => setOpen(true)} />", "aria-haspopup=dialog; the shortcut hint is hidden from screen readers.", [["placeholder", "string"], ["shortcut", "string[]"]], ["search", "cmdk"]),
  c("Stepper", "Navigation", "Progress through a multi-step flow.", '<Stepper current={1} steps={[{label:"Account"},{label:"Library"},{label:"Done"}]} />', "Ordered list; the current step has aria-current=step and each step announces its state.", [["steps", "{ label, description? }[]"], ["current", "index"], ["orientation", "horizontal | vertical"]], ["wizard", "onboarding"]),
  c("SiteHeader", "Navigation", "Website header that collapses to a menu button.", '<SiteHeader brand={<Logo />} links={…} actions={<Button>Download</Button>} />', "Menu button exposes aria-expanded and controls the nav.", [["brand / actions", "ReactNode"], ["links", "{ label, href, active? }[]"], ["sticky", "boolean"]], ["marketing", "header"]),
  c("SiteFooter", "Navigation", "Website footer with link columns and legal line.", "<SiteFooter columns={…} legal=\"© cobalt\" />", "Each column is a labelled nav.", [["brand / legal", "ReactNode"], ["columns", "{ title, links }[]"]], ["marketing", "footer"]),
  c("Menubar", "Navigation", "Desktop-app menu bar (File, Edit, View).", '<Menubar menus={[{label:"File", items:[…]}]} />', "Radix menubar: arrows move between menus, typeahead in items.", [["menus", "{ label, items: { label, shortcut?, onSelect?, checked?, separator? }[] }[]"]], ["menu", "desktop"], NEW),
  c("Toolbar", "Navigation", "Arrow-key navigable row of controls.", '<Toolbar aria-label="Formatting"><ToolbarButton>…</ToolbarButton><ToolbarSeparator /></Toolbar>', "One tab stop; arrows move within.", [["aria-label", "string (required)"]], ["actions", "editor"], NEW),
  c("TreeView", "Navigation", "Collapsible hierarchy for folders or mod lists.", '<TreeView aria-label="Files" nodes={…} />', "ARIA tree: arrows move and expand/collapse, Enter selects.", [["nodes", "{ id, label, icon?, children? }[]"], ["selected / onSelect", "id"], ["defaultExpanded", "id[]"]], ["tree", "folders"], NEW),

  // Overlays
  c("Dialog", "Overlays", "Modal window with title, body and footer.", '<Dialog trigger={<Button>Details</Button>} title="Game details">…</Dialog>', "Traps focus, closes on Escape, restores focus, and always has a title and description.", [["trigger", "ReactElement"], ["title / description / footer", "ReactNode"], ["size", "sm | md | lg | xl"], ["open / onOpenChange", "controlled state"]], ["modal"]),
  c("AlertDialog", "Overlays", "Confirmation that must be answered.", '<AlertDialog title="Uninstall Skyhaven?" description="Saves stay in the cloud." onConfirm={…} trigger={…} />', "role=alertdialog; focus starts on Cancel; Escape cancels.", [["onConfirm", "() => void"], ["confirmLabel / cancelLabel", "string"], ["tone", "danger | accent"]], ["confirm", "destructive"]),
  c("Sheet", "Overlays", "Panel that slides in from an edge.", '<Sheet side="right" title="Friends" trigger={…}>…</Sheet>', "Same focus behavior as Dialog.", [["side", "right | left | bottom"], ["width", "CSS length"]], ["drawer", "panel"]),
  c("Popover", "Overlays", "Floating panel anchored to a trigger.", '<Popover trigger={<Button>Filters</Button>}>…</Popover>', "Focus moves in and returns on close; Escape closes.", [["trigger", "ReactElement"], ["side / align", "placement"], ["title", "ReactNode"]], ["floating"]),
  c("Tooltip", "Overlays", "Hover/focus hint with optional shortcut.", '<Tooltip content="Settings" shortcut={["⌘", ","]}><IconButton …/></Tooltip>', "Supplementary only; the trigger still needs its own accessible name.", [["content", "ReactNode"], ["side", "placement"], ["delay", "ms"], ["shortcut", "string[]"]], ["hint"]),
  c("HoverCard", "Overlays", "Rich preview on hover, like a profile or game.", '<HoverCard trigger={<a href="#">@nova</a>}>…</HoverCard>', "Not reachable by touch or screen readers alone; keep content supplementary.", [["trigger", "ReactElement"], ["openDelay", "ms"]], ["preview", "profile"], NEW),
  c("DropdownMenu", "Overlays", "Action menu with icons, shortcuts, checks, submenus.", '<DropdownMenu trigger={<IconButton …/>} items={[{label:"Rename"},{separator:true},{label:"Uninstall",danger:true}]} />', "Radix menu: arrows, typeahead, Escape.", [["items", "MenuItem[]"], ["align / side", "placement"]], ["menu", "actions"]),
  c("ContextMenu", "Overlays", "Right-click (or long-press, Shift+F10) menu.", "<ContextMenu items={…}><GameCard …/></ContextMenu>", "Also opens from the keyboard with Shift+F10 / Menu key.", [["items", "MenuItem[]"]], ["right-click"]),
  c("CommandPalette", "Overlays", "⌘K launcher: filter, arrow, Enter.", "<CommandPalette commands={…} />", "Dialog with a combobox input and grouped listbox options.", [["commands", "{ id, label, group?, icon?, shortcut?, keywords?, onSelect }[]"], ["hotkey", "bind ⌘K / Ctrl+K"]], ["cmdk", "search", "spotlight"], NEW),
  c("Lightbox", "Overlays", "Full-screen image viewer with arrow-key paging.", "<Lightbox images={shots} open={open} onOpenChange={setOpen} />", "Announces the image position; arrows page, Escape closes.", [["images", "{ src, alt, caption? }[]"], ["index / onIndexChange", "number"]], ["screenshots", "gallery"], NEW),

  // Feedback
  c("Toast", "Feedback", "Transient message. Use Toaster + useToast() for a queue.", 'const toast = useToast(); toast({ title: "Saved", tone: "success" })', "Announced via a live region; swipe or Close dismisses; F8 focuses the viewport.", [["title / description", "ReactNode"], ["tone", "neutral | accent | success | warning | danger"], ["action", "{ label, onClick }"], ["duration", "ms"]], ["notification", "snackbar"]),
  c("Alert", "Feedback", "Inline message in a tone with optional action.", '<Alert tone="warning" title="Update required">…</Alert>', "Danger alerts use role=alert; others use role=status.", [["tone", "Tone"], ["title", "ReactNode"], ["action", "ReactNode"], ["onDismiss", "() => void"]], ["callout", "notice"]),
  c("Banner", "Feedback", "Full-width strip for app-level notices.", '<Banner action={<Button size="sm">Restart</Button>}>Update ready</Banner>', "role=status; keep it short.", [["tone", "Tone"], ["action", "ReactNode"], ["onDismiss", "() => void"]], ["announcement"], NEW),
  c("ProgressBar", "Feedback", "Determinate or indeterminate progress.", '<ProgressBar value={42} label="Downloading" showValue />', "role=progressbar with value attributes; omit value for indeterminate.", [["value / max", "number"], ["label", "ReactNode"], ["showValue", "boolean"], ["tone", "Tone"], ["size", "sm | md"]], ["loading"]),
  c("ProgressRing", "Feedback", "Circular progress with content in the middle.", "<ProgressRing value={72} />", "role=progressbar with a label.", [["value / max", "number"], ["size / thickness", "px"], ["label", "string"]], ["circle", "completion"], NEW),
  c("Meter", "Feedback", "Stacked usage bar with legend (disk space).", "<Meter max={1000} segments={[{label:\"Games\",value:640}]} />", "Exposed as one image with a text summary.", [["segments", "{ label, value, tone? }[]"], ["max", "number"]], ["storage", "usage"], NEW),
  c("Spinner", "Feedback", "Loading indicator.", '<Spinner label="Loading library" />', "role=status with a visually hidden label.", [["size", "sm | md | lg"], ["label", "string"]], ["loading"]),
  c("Skeleton", "Feedback", "Placeholder shapes while content loads.", "<Skeleton lines={3} />", "Hidden from assistive technology; announce loading elsewhere.", [["shape", "line | rect | circle"], ["lines", "number"], ["width / height", "CSS length"]], ["placeholder"]),
  c("Badge", "Feedback", "Small status label.", '<Badge tone="success">Installed</Badge>', "Plain text; don't rely on color alone.", [["tone", "Tone"], ["variant", "soft | solid | outline"], ["icon", "ReactNode"]], ["label", "status"]),
  c("StatusIndicator", "Feedback", "Presence dot with label.", '<StatusIndicator status="online" />', "The label carries the meaning; the dot is decorative.", [["status", "online | away | busy | offline | playing"], ["label", "ReactNode"], ["pulse", "boolean"]], ["presence"]),

  // Data
  c("Card", "Data", "Surface with optional media, header, body and footer.", '<Card title="Storage" description="2 drives">…</Card>', "Structural only; use a heading-level title where it matters.", [["title / description / action / footer / media", "ReactNode"], ["variant", "default | sunken | outline | interactive"], ["padding", "none | sm | md | lg"]], ["container"]),
  c("ListItem", "Data", "Row with leading, text and trailing content.", '<ListItem title="Skyhaven" description="Played 2h ago" leading={<Avatar …/>} />', "Becomes a pressed-state button when onSelect is set.", [["title / description", "ReactNode"], ["leading / trailing", "ReactNode"], ["onSelect / selected", "interactive row"]], ["row"]),
  c("Avatar", "Data", "Image or initials with optional presence.", '<Avatar alt="Nova Reyes" status="online" />', "Initials fall back with the name as label.", [["src / alt", "string"], ["size", "xs–xl"], ["status", "presence"], ["shape", "circle | square"]], ["user", "profile"]),
  c("AvatarGroup", "Data", "Overlapping avatars with +n overflow.", "<AvatarGroup people={friends} max={4} />", "Group labelled with the total count.", [["people", "{ name, src? }[]"], ["max", "number"]], ["friends", "stack"], NEW),
  c("Table", "Data", "Data table with sorting and row selection.", "<Table columns={cols} rows={rows} rowKey={r => r.id} selectable />", "Sortable headers set aria-sort; selection checkboxes are labelled.", [["columns", "{ key, header, cell, sortValue?, align? }[]"], ["rows / rowKey", "data"], ["selectable / selected / onSelectedChange", "selection"], ["density", "compact | comfortable"]], ["grid", "list"]),
  c("EmptyState", "Data", "What to show when there's nothing yet.", '<EmptyState title="No games yet" action={<Button>Browse store</Button>} />', "Plain content; make the action specific.", [["icon / title / description / action", "ReactNode"]], ["blank", "zero"]),
  c("Divider", "Data", "Horizontal or vertical rule, optionally labelled.", '<Divider label="or" />', "role=separator.", [["label", "ReactNode"], ["orientation", "horizontal | vertical"]], ["separator", "hr"]),
  c("Tag", "Data", "Neutral label; removable when onRemove is set.", "<Tag>Co-op</Tag>", "Remove button is labelled with the tag text.", [["onRemove", "() => void"], ["icon", "ReactNode"]], ["chip", "genre"], NEW),
  c("CodeBlock", "Data", "Monospace block with title and copy.", '<CodeBlock language="bash" code="npm i @cobalt/ui" />', "Copy button announces success politely.", [["code", "string"], ["language / title", "string"], ["lineNumbers", "boolean"], ["copyable", "boolean"]], ["code", "snippet"]),
  c("CopyField", "Data", "Read-only value with copy; can mask secrets.", '<CopyField label="Invite link" value="…" />', "The input is labelled and selects on focus.", [["value / label", "string"], ["secret", "boolean"]], ["clipboard", "invite"]),
  c("RecoveryCodes", "Data", "Backup codes with copy-all and download.", "<RecoveryCodes codes={codes} />", "Ordered list; download is generated locally.", [["codes", "string[]"], ["filename", "string"]], ["2fa", "security"]),
  c("DeviceSession", "Data", "Signed-in device with sign-out.", '<DeviceSession device="Windows PC" lastActive="Active now" current />', "Sign-out button text names the action.", [["device / location / lastActive", "string"], ["kind", "desktop | laptop | mobile"], ["current", "boolean"], ["onRevoke", "() => void"]], ["security", "session"]),
  c("Accordion", "Data", "Expandable sections.", "<Accordion items={faq} />", "Radix accordion: buttons with aria-expanded and linked regions.", [["items", "{ value, title, content }[]"], ["multiple", "boolean"]], ["faq", "collapse"]),
  c("StatCard", "Data", "Metric with delta and sparkline.", '<StatCard label="Hours played" value="128" delta="+12%" trend="up" spark={[…]} />', "Delta direction is in the text, not color alone.", [["label / value", "ReactNode"], ["delta / trend / goodDirection", "change"], ["spark", "number[]"]], ["kpi", "metric"]),
  c("Sparkline", "Data", "Tiny inline trend line.", "<Sparkline data={[3,5,4,8,6,9]} />", "Hidden unless you pass a label.", [["data", "number[]"], ["width / height", "px"], ["area", "boolean"], ["label", "string"]], ["chart", "trend"], NEW),
  c("FeatureCard", "Data", "Icon, title and description; links when href is set.", '<FeatureCard icon={<Cloud />} title="Cloud saves" description="…" />', "Becomes a single link when href is given.", [["icon / title / description", "ReactNode"], ["href", "string"]], ["marketing"]),
  c("DescriptionList", "Data", "Term/value pairs as rows or columns.", '<DescriptionList items={[{term:"Developer",detail:"Northlight"}]} />', "Semantic <dl>.", [["items", "{ term, detail }[]"], ["layout", "rows | columns"]], ["details", "specs"], NEW),
  c("Timeline", "Data", "Vertical list of events.", "<Timeline items={patchNotes} />", "Ordered list.", [["items", "{ title, time?, description?, icon?, tone? }[]"]], ["activity", "history"], NEW),
  c("MediaGallery", "Data", "Lead image with thumbnail strip.", "<MediaGallery items={shots} onOpen={openLightbox} />", "Thumbnails are tabs with image labels.", [["items", "{ src, alt, caption? }[]"], ["onOpen", "(index) => void"]], ["screenshots"]),
  c("Carousel", "Data", "Scroll-snapping row with prev/next.", '<Carousel aria-label="Featured">…</Carousel>', "Native scrolling; buttons are labelled.", [["slideWidth", "CSS length"], ["aria-label", "string (required)"]], ["slider", "row"], NEW),

  // Layout
  c("Stack", "Layout", "Vertical flow with consistent gaps.", "<Stack gap={3}>…</Stack>", "Structural.", [["gap", "0–8 (spacing scale)"], ["align", "start | center | end | stretch"], ["as", "element"]], ["vstack"]),
  c("Inline", "Layout", "Horizontal row that wraps.", '<Inline gap={2} justify="between">…</Inline>', "Structural.", [["gap", "0–8"], ["align / justify", "alignment"], ["wrap", "boolean"]], ["hstack", "row"]),
  c("Grid", "Layout", "Fixed columns or auto-fill tiles.", '<Grid minItemWidth="160px">…</Grid>', "Structural.", [["columns", "number"], ["minItemWidth", "CSS length"], ["gap", "0–8"]], ["tiles"], NEW),
  c("Container", "Layout", "Centered max-width wrapper.", '<Container size="md">…</Container>', "Structural.", [["size", "sm | md | lg | full"]], ["wrapper"]),
  c("Panel", "Layout", "Titled section box for settings and dashboards.", '<Panel title="Downloads" actions={…}>…</Panel>', "Uses <section> with a heading.", [["title / description / actions", "ReactNode"]], ["section"]),
  c("SplitView", "Layout", "Two columns that stack below 640px.", "<SplitView aside={<Filters />}>…</SplitView>", "Source order follows the visual order.", [["aside", "ReactNode"], ["asideWidth", "CSS length"], ["asideSide", "start | end"]], ["columns"]),
  c("SettingsRow", "Layout", "Label and description beside a control.", '<SettingsRow title="Launch on startup" control={<Switch …/>} />', "Pass htmlFor to label the control.", [["title / description / control", "ReactNode"], ["htmlFor", "string"]], ["settings"]),
  c("AppShell", "Layout", "Sidebar, header, content and optional aside.", "<AppShell sidebar={…} header={…} aside={…}>…</AppShell>", "Provides nav, header, main and aside landmarks.", [["sidebar / header / aside", "ReactNode"], ["fullHeight", "boolean"]], ["frame", "layout"]),
  c("PageHeader", "Layout", "Page title with eyebrow, description and actions.", '<PageHeader title="Library" actions={…} />', "Renders the page <h1> by default; set headingLevel when it isn't the page title.", [["title / description / eyebrow / actions / breadcrumbs", "ReactNode"], ["headingLevel", "1–4, default 1"]], ["title"]),
  c("AuthPanel", "Layout", "Centered card for sign-in and verification.", '<AuthPanel title="Sign in to cobalt">…</AuthPanel>', "Renders an <h1> by default (headingLevel to change).", [["title / description / logo / footer", "ReactNode"], ["headingLevel", "1–4, default 1"]], ["login", "auth"]),
  c("AspectRatio", "Layout", "Keeps media at a fixed ratio.", "<AspectRatio ratio={16/9}><img …/></AspectRatio>", "Structural.", [["ratio", "number"]], ["media"], NEW),
  c("ScrollArea", "Layout", "Scroll container with themed thin scrollbars.", "<ScrollArea maxHeight={240}>…</ScrollArea>", "The viewport is focusable for keyboard scrolling.", [["maxHeight", "CSS length"]], ["overflow"], NEW),

  // Launcher
  c("PlayButton", "Launcher", "Primary game action; label and icon follow state.", '<PlayButton state="ready" onAction={launch} />', "Visible label always names the action; download percent is in the text.", [["state", "ready | install | update | downloading | running | queued"], ["progress", "0–100"], ["onAction", "(state) => void"]], ["play", "install", "game"], NEW),
  c("GameCard", "Launcher", "Cover tile for library and store grids.", '<GameCard title="Skyhaven" cover="/covers/skyhaven.webp" subtitle="Played 2h ago" />', "Button or link with the title as its name; cover image is decorative.", [["title / cover", "string"], ["subtitle / badge", "ReactNode"], ["progress", "0–100"], ["orientation", "portrait | landscape"], ["installed", "boolean"]], ["library", "cover"], NEW),
  c("GameHero", "Launcher", "Key art with title, actions and stats.", '<GameHero title="Skyhaven" art="/art.webp" actions={<PlayButton …/>} stats={…} />', "Renders an <h1> (headingLevel to change) unless you pass a logo; art is decorative.", [["title / art", "content"], ["logo / meta / actions", "ReactNode"], ["stats", "{ label, value }[]"], ["headingLevel", "1–4, default 1"]], ["game page", "hero"], NEW),
  c("DownloadItem", "Launcher", "Download queue row with speed, ETA and controls.", '<DownloadItem title="Skyhaven" downloaded={4.2e9} total={12e9} speed={48e6} status="downloading" />', "Controls are named with the game title.", [["downloaded / total / speed", "bytes"], ["status", "downloading | paused | queued | complete | error"], ["onPause / onResume / onCancel", "() => void"]], ["queue", "download"], NEW),
  c("FriendRow", "Launcher", "Friend with presence and current activity.", '<FriendRow name="Nova" status="playing" activity="Skyhaven" />', "Status is written out, not only shown as a dot.", [["name / avatar", "string"], ["status", "presence"], ["activity / actions", "ReactNode"]], ["friends", "social"], NEW),
  c("AchievementCard", "Launcher", "Locked, in-progress or unlocked achievement.", '<AchievementCard title="First flight" unlocked rarity={4.2} />', "Locked/unlocked state is announced in the title.", [["title / description / icon", "ReactNode"], ["unlocked / unlockedAt", "state"], ["progress", "{ value, max }"], ["rarity", "% of players"]], ["trophy"], NEW),
  c("TitleBar", "Launcher", "Frameless desktop window chrome.", '<TitleBar title={<Logo />} platform="windows" onClose={…} />', "Window buttons are labelled; the bar is a drag region in Electron/Tauri.", [["title / center", "ReactNode"], ["platform", "windows | mac"], ["maximized", "boolean"], ["onMinimize / onMaximize / onClose", "() => void"]], ["electron", "window", "desktop"], NEW),
];

export const registryBySlug = Object.fromEntries(registry.map((d) => [d.slug, d]));
