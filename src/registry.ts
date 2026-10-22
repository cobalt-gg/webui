export const categories = [
  "Text",
  "Actions",
  "Inputs",
  "Navigation",
  "Overlays",
  "Feedback",
  "Data",
  "Layout",
] as const;
export const registry = [
  {
    name: "SplitText",
    slug: "split-text",
    category: "Text",
    description:
      "Reveals text letter by letter or word by word as it scrolls into view.",
    tags: ["text", "animation", "reveal", "stagger", "headline"],
    props: [
      { name: "text", description: "string" },
      { name: "by", description: "char | word" },
      { name: "stagger / delay", description: "milliseconds" },
      {
        name: "whenVisible",
        description: "boolean; wait until on screen (default true)",
      },
    ],
    example: '<SplitText text="All your games in one place." />',
    accessibility:
      "The full string is exposed once to assistive technology; the animated pieces are hidden from it.",
  },
  {
    name: "ScrambleText",
    slug: "scramble-text",
    category: "Text",
    description:
      "Decodes from random glyphs into the real text, and again on hover.",
    tags: ["text", "animation", "decode", "glitch", "hacker"],
    props: [
      { name: "text", description: "string" },
      { name: "duration", description: "milliseconds for the whole decode" },
      { name: "replayOnHover", description: "boolean (default true)" },
    ],
    example: '<ScrambleText text="Ready to play" />',
    accessibility:
      "Screen readers get the final text only. With reduced motion the text appears without scrambling.",
  },
  {
    name: "Typewriter",
    slug: "typewriter",
    category: "Text",
    description:
      "Types, pauses and deletes a rotating list of words with a blinking caret.",
    tags: ["text", "animation", "typing", "rotate", "caret"],
    props: [
      { name: "words", description: "string[]" },
      { name: "speed", description: "milliseconds per character" },
      { name: "pause", description: "milliseconds a finished word stays" },
    ],
    example: '<Typewriter words={["Steam", "Epic", "GOG"]} />',
    accessibility:
      "All words are announced once as a list; the typing itself is hidden. Reduced motion shows the first word.",
  },
  {
    name: "GradientText",
    slug: "gradient-text",
    category: "Text",
    description: "Fills text with a slowly panning cobalt gradient.",
    tags: ["text", "gradient", "headline", "color"],
    props: [{ name: "animate", description: "boolean (default true)" }],
    example: "<GradientText>One app instead of six</GradientText>",
    accessibility:
      "Plain text with a background clip, so it reads and selects normally. Check contrast on light themes.",
  },
  {
    name: "ShinyText",
    slug: "shiny-text",
    category: "Text",
    description: "Sweeps a soft highlight across muted text.",
    tags: ["text", "shimmer", "shine", "loading"],
    props: [{ name: "speed", description: "seconds per sweep (default 3)" }],
    example: "<ShinyText>Now in closed preview</ShinyText>",
    accessibility: "Plain text. The sweep stops with reduced motion.",
  },
  {
    name: "CountUp",
    slug: "count-up",
    category: "Text",
    description: "Counts a number up from zero when it scrolls into view.",
    tags: ["text", "number", "counter", "stat", "animation"],
    props: [
      { name: "value", description: "number" },
      { name: "duration", description: "milliseconds" },
      { name: "decimals / prefix / suffix", description: "formatting" },
    ],
    example: '<CountUp value={128} suffix=" games" />',
    accessibility:
      "The final value is exposed to assistive technology straight away; only the visual digits count.",
  },
  {
    name: "Button",
    slug: "button",
    category: "Actions",
    description: "Triggers an action with a clear visual hierarchy.",
    tags: ["button", "action", "click"],
    props: [
      {
        name: "loading / loadingLabel",
        description:
          "boolean / string; disables activation and exposes busy state",
      },
      {
        name: "variant",
        description: "primary | secondary | ghost | destructive",
      },
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "disabled",
        description: "boolean",
      },
    ],
    example: '<Button variant="primary">Continue</Button>',
    accessibility:
      "Use a descriptive action label. Native Enter and Space activate the button.",
  },
  {
    name: "IconButton",
    slug: "icon-button",
    category: "Actions",
    description: "A compact action with an accessible text label.",
    tags: ["button", "icon", "action"],
    props: [
      {
        name: "aria-label",
        description: "string (required)",
      },
      {
        name: "variant",
        description: "Button variant",
      },
      {
        name: "size",
        description: "sm | md | lg",
      },
    ],
    example: '<IconButton aria-label="Add item">+</IconButton>',
    accessibility:
      "Always provide an aria-label; the icon alone is not a label.",
  },
  {
    name: "ButtonGroup",
    slug: "button-group",
    category: "Actions",
    description: "Groups related actions together.",
    tags: ["button", "group"],
    props: [
      {
        name: "children",
        description: "ReactNode",
      },
      {
        name: "aria-label",
        description: "string",
      },
    ],
    example:
      '<ButtonGroup aria-label="Actions"><Button>Save</Button><Button variant="secondary">Cancel</Button></ButtonGroup>',
    accessibility:
      "Give the group an accessible label. Each button remains a separate tab stop.",
  },
  {
    name: "Toggle",
    slug: "toggle",
    category: "Actions",
    description: "A button with an on or off state.",
    tags: ["pressed", "button", "switch"],
    props: [
      {
        name: "pressed / defaultPressed",
        description: "boolean",
      },
      {
        name: "onPressedChange",
        description: "(pressed) => void",
      },
    ],
    example: '<Toggle aria-label="Bold">Bold</Toggle>',
    accessibility: "Radix exposes aria-pressed and native keyboard activation.",
  },
  {
    name: "Switch",
    slug: "switch",
    category: "Actions",
    description: "Turns a setting on or off.",
    tags: ["boolean", "checked", "setting"],
    props: [
      {
        name: "label",
        description: "string (required)",
      },
      {
        name: "checked / defaultChecked",
        description: "boolean",
      },
      {
        name: "onCheckedChange",
        description: "(checked) => void",
      },
    ],
    example: '<Switch label="Notifications" defaultChecked />',
    accessibility:
      "The visible label names the switch. Space toggles the checked state.",
  },
  {
    name: "SegmentedControl",
    slug: "segmented-control",
    category: "Actions",
    description: "Selects one option from a compact group.",
    tags: ["toggle", "options", "keyboard"],
    props: [
      {
        name: "options",
        description: "{value, label, disabled?}[]",
      },
      {
        name: "value / defaultValue",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(value) => void",
      },
      {
        name: "aria-label",
        description: "string",
      },
    ],
    example:
      '<SegmentedControl aria-label="View" defaultValue="list" options={[{value:"list",label:"List"},{value:"grid",label:"Grid"}]} />',
    accessibility:
      "Arrow keys move through options. An active option can be deselected; ignore empty values if selection is required.",
  },
  {
    name: "Input",
    slug: "input",
    category: "Inputs",
    description: "A single-line text field.",
    tags: ["text", "field", "form"],
    props: [
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "invalid",
        description: "boolean",
      },
      {
        name: "native input props and ref",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<Input aria-label="Project name" placeholder="Project name" />',
    accessibility:
      "Provide a label. Use aria-describedby for hints and errors; invalid sets aria-invalid.",
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "Inputs",
    description: "A resizable field for longer text.",
    tags: ["multiline", "form", "text"],
    props: [
      {
        name: "native textarea props and ref",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<Textarea aria-label="Description" placeholder="Add a description" />',
    accessibility:
      "Provide a visible label in forms. Native textarea keyboard behavior is preserved.",
  },
  {
    name: "SearchInput",
    slug: "search-input",
    category: "Inputs",
    description: "A native search field.",
    tags: ["search", "filter", "text"],
    props: [
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "native input props and ref",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<SearchInput aria-label="Search items" placeholder="Search\u2026" />',
    accessibility:
      "Always label the search field; placeholders are supplementary.",
  },
  {
    name: "Select",
    slug: "select",
    category: "Inputs",
    description: "A native single-choice select field.",
    tags: ["options", "form", "dropdown"],
    props: [
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "native select props and ref",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<Select aria-label="Region"><option>Europe</option><option>Americas</option></Select>',
    accessibility:
      "Uses platform select behavior, including keyboard selection and type-ahead.",
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "Inputs",
    description: "Selects an independent boolean option.",
    tags: ["checked", "boolean", "form"],
    props: [
      {
        name: "label",
        description: "ReactNode",
      },
      {
        name: "native input props except type",
        description: "See native element or primitive documentation",
      },
      {
        name: "ref",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<Checkbox label="Include archived" />',
    accessibility:
      "The visible label activates the native checkbox. Space toggles selection.",
  },
  {
    name: "Radio",
    slug: "radio",
    category: "Inputs",
    description: "Selects one option in a named group.",
    tags: ["choice", "group", "form"],
    props: [
      {
        name: "label",
        description: "ReactNode",
      },
      {
        name: "name",
        description: "string",
      },
      {
        name: "native input props except type",
        description: "See native element or primitive documentation",
      },
      {
        name: "ref",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<Radio name="plan" value="basic" label="Basic" />',
    accessibility:
      "Use a shared name for mutually exclusive choices and fieldset/legend to label the group.",
  },
  {
    name: "Slider",
    slug: "slider",
    category: "Inputs",
    description: "Adjusts a numeric value within a range.",
    tags: ["range", "value", "form"],
    props: [
      {
        name: "min / max / step",
        description: "number",
      },
      {
        name: "native input props except type",
        description: "See native element or primitive documentation",
      },
      {
        name: "ref",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<Slider aria-label="Volume" min={0} max={100} defaultValue={50} />',
    accessibility:
      "Arrow keys adjust the value. Provide aria-valuetext when the number needs context.",
  },
  {
    name: "NumberInput",
    slug: "number-input",
    category: "Inputs",
    description: "A numeric field with native stepping.",
    tags: ["number", "step", "form"],
    props: [
      {
        name: "min / max / step",
        description: "number",
      },
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "native input props and ref",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<NumberInput aria-label="Quantity" min={1} defaultValue={3} />',
    accessibility:
      "Native numeric input behavior is retained. Validate values in the consuming application.",
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "Switches between related panels.",
    tags: ["navigation", "panel", "keyboard"],
    props: [
      {
        name: "items",
        description: "{value,label,content,disabled?}[]",
      },
      {
        name: "label",
        description: "string",
      },
      {
        name: "value / defaultValue",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(value) => void",
      },
    ],
    example:
      '<Tabs label="Project" defaultValue="overview" items={[{value:"overview",label:"Overview",content:"Project overview"},{value:"activity",label:"Activity",content:"Recent activity"}]} />',
    accessibility:
      "Radix manages tab/panel relationships and arrow, Home and End keyboard navigation.",
  },
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "Navigation",
    description: "Shows the current location in a hierarchy.",
    tags: ["navigation", "path", "links"],
    props: [
      {
        name: "children",
        description: "list items",
      },
      {
        name: "native nav props",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<Breadcrumbs><li><a href="/">Home</a></li><li aria-current="page">Library</li></Breadcrumbs>',
    accessibility:
      'Supply list items and mark the current page with aria-current="page".',
  },
  {
    name: "SidebarItem",
    slug: "sidebar-item",
    category: "Navigation",
    description: "A link for vertical navigation.",
    tags: ["navigation", "sidebar", "link"],
    props: [
      {
        name: "active",
        description: "boolean",
      },
      {
        name: "native anchor props",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<SidebarItem href="#overview" active>Overview</SidebarItem>',
    accessibility: 'active adds aria-current="page". Provide a real href.',
  },
  {
    name: "NavigationItem",
    slug: "navigation-item",
    category: "Navigation",
    description: "A reusable navigation link.",
    tags: ["navigation", "link", "active"],
    props: [
      {
        name: "active",
        description: "boolean",
      },
      {
        name: "native anchor props",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<NavigationItem href="#overview" active>Overview</NavigationItem>',
    accessibility:
      "Use inside a labelled nav landmark; active marks the current page.",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    description: "Moves between pages of content.",
    tags: ["navigation", "page", "next"],
    props: [
      {
        name: "page",
        description: "number (1-based)",
      },
      {
        name: "pageCount",
        description: "number",
      },
      {
        name: "onPageChange",
        description: "(page) => void",
      },
    ],
    example: "<Pagination page={1} pageCount={5} onPageChange={setPage} />",
    accessibility:
      "Boundary controls are disabled. The current page is announced politely.",
  },
  {
    name: "CommandMenuTrigger",
    slug: "command-menu-trigger",
    category: "Navigation",
    description: "A trigger for an application command menu.",
    tags: ["search", "keyboard", "command"],
    props: [
      {
        name: "Button props",
        description: "See native element or primitive documentation",
      },
      {
        name: "onClick",
        description: "handler",
      },
    ],
    example: "<CommandMenuTrigger onClick={openCommands} />",
    accessibility:
      "This is a trigger only. The application supplies the command menu and shortcut handler.",
  },
  {
    name: "Dialog",
    slug: "dialog",
    category: "Overlays",
    description: "A modal dialog for a focused task.",
    tags: ["modal", "overlay", "keyboard", "focus"],
    props: [
      {
        name: "trigger",
        description: "ReactNode",
      },
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "open / defaultOpen",
        description: "boolean",
      },
      {
        name: "onOpenChange",
        description: "(open) => void",
      },
      {
        name: "contentProps",
        description: "Radix content props",
      },
    ],
    example:
      '<Dialog trigger={<Button>Open dialog</Button>} title="Details" description="Review the details."><p>Dialog content</p></Dialog>',
    accessibility:
      "Radix traps focus, handles Escape, and restores focus to the trigger. Trigger must accept a ref.",
  },
  {
    name: "AlertDialog",
    slug: "alert-dialog",
    category: "Overlays",
    description: "Asks for confirmation before an important action.",
    tags: ["confirm", "destructive", "modal"],
    props: [
      {
        name: "trigger",
        description: "ReactNode",
      },
      {
        name: "title / description / actionLabel",
        description: "string",
      },
      {
        name: "onAction",
        description: "() => void",
      },
      {
        name: "cancelLabel",
        description: "string",
      },
    ],
    example:
      '<AlertDialog trigger={<Button>Remove</Button>} title="Remove item?" description="This cannot be undone." actionLabel="Remove" onAction={removeItem} />',
    accessibility:
      "Focus starts on Cancel. The alert requires an explicit choice; Escape cancels.",
  },
  {
    name: "Popover",
    slug: "popover",
    category: "Overlays",
    description: "Shows contextual content next to a trigger.",
    tags: ["overlay", "context", "keyboard"],
    props: [
      {
        name: "trigger",
        description: "ReactNode",
      },
      {
        name: "label",
        description: "string",
      },
      {
        name: "children",
        description: "ReactNode",
      },
      {
        name: "contentProps",
        description: "Radix positioning/content props",
      },
    ],
    example:
      '<Popover trigger={<Button>Details</Button>} label="Details"><p>Additional information.</p></Popover>',
    accessibility:
      "Radix handles focus and dismissal. Use a ref-capable trigger with a meaningful label.",
  },
  {
    name: "DropdownMenu",
    slug: "dropdown-menu",
    category: "Overlays",
    description: "A compact action menu opened by a button.",
    tags: ["menu", "overlay", "keyboard"],
    props: [
      {
        name: "trigger",
        description: "ReactNode",
      },
      {
        name: "label",
        description: "string",
      },
      {
        name: "items",
        description: "{label,onSelect?,disabled?,destructive?}[]",
      },
    ],
    example:
      '<DropdownMenu label="Actions" trigger={<Button>Actions \u25be</Button>} items={[{label:"Duplicate",onSelect:duplicate}]} />',
    accessibility:
      "Arrow keys navigate, typing finds items, and Escape restores trigger focus.",
  },
  {
    name: "ContextMenu",
    slug: "context-menu",
    category: "Overlays",
    description: "A contextual action menu for a target.",
    tags: ["menu", "right", "click", "keyboard"],
    props: [
      {
        name: "label",
        description: "string",
      },
      {
        name: "children",
        description: "ReactNode",
      },
      {
        name: "items",
        description: "MenuItem[]",
      },
    ],
    example:
      '<ContextMenu label="Item actions" items={[{label:"Copy",onSelect:copyItem}]}>Right-click here</ContextMenu>',
    accessibility:
      "Right-click or Shift+F10 opens the menu. The target is keyboard focusable.",
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "Overlays",
    description: "Brief supplementary information on hover or focus.",
    tags: ["hint", "overlay", "keyboard"],
    props: [
      {
        name: "content",
        description: "ReactNode",
      },
      {
        name: "children",
        description: "ref-capable trigger",
      },
      {
        name: "open / defaultOpen",
        description: "boolean",
      },
    ],
    example:
      '<Tooltip content="Add an item"><IconButton aria-label="Add item">+</IconButton></Tooltip>',
    accessibility:
      "Do not put essential instructions or interactive controls in tooltips. Escape dismisses.",
  },
  {
    name: "Sheet",
    slug: "sheet",
    category: "Overlays",
    description: "A modal panel attached to the viewport edge.",
    tags: ["drawer", "modal", "overlay", "focus"],
    props: [
      {
        name: "Dialog props",
        description: "See native element or primitive documentation",
      },
      {
        name: "className",
        description: "string",
      },
    ],
    example:
      '<Sheet trigger={<Button>Open sheet</Button>} title="Details" description="Additional information."><p>Sheet content</p></Sheet>',
    accessibility:
      "Uses the same focus trap, Escape dismissal, and focus restoration as Dialog.",
  },
  {
    name: "Toast",
    slug: "toast",
    category: "Feedback",
    description: "A temporary notification with dismiss control.",
    tags: ["notification", "message", "status"],
    props: [
      {
        name: "title",
        description: "string",
      },
      {
        name: "description",
        description: "string",
      },
      {
        name: "open",
        description: "boolean",
      },
      {
        name: "onOpenChange",
        description: "(open) => void",
      },
      {
        name: "duration",
        description: "number",
      },
    ],
    example:
      '<ToastProvider><Toast title="Saved" open={open} onOpenChange={setOpen} /><ToastViewport /></ToastProvider>',
    accessibility:
      "Mount one ToastProvider and ToastViewport per application. Radix manages announcements and pauses on focus/hover.",
  },
  {
    name: "Alert",
    slug: "alert",
    category: "Feedback",
    description: "Displays an inline contextual message.",
    tags: ["message", "error", "warning", "status"],
    props: [
      {
        name: "tone",
        description: "neutral | success | warning | danger",
      },
      {
        name: "title",
        description: "string",
      },
      {
        name: "children",
        description: "ReactNode",
      },
    ],
    example:
      '<Alert tone="success" title="Changes saved">Your settings are up to date.</Alert>',
    accessibility:
      'Danger uses role="alert". Other tones use role="status"; avoid rendering many live messages at once.',
  },
  {
    name: "ProgressBar",
    slug: "progress-bar",
    category: "Feedback",
    description: "Shows progress towards a known total.",
    tags: ["loading", "percent", "status"],
    props: [
      {
        name: "value",
        description: "number",
      },
      {
        name: "max",
        description: "number (default 100)",
      },
      {
        name: "label",
        description: "string",
      },
    ],
    example: '<ProgressBar label="Upload progress" value={64} />',
    accessibility:
      "Exposes progressbar semantics and clamps values to the valid range.",
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    description: "Indicates an ongoing operation.",
    tags: ["loading", "busy", "status"],
    props: [
      {
        name: "aria-label",
        description: "string (default Loading)",
      },
      {
        name: "native span props",
        description: "See native element or primitive documentation",
      },
    ],
    example: '<Spinner aria-label="Loading results" />',
    accessibility:
      "Has a status role and accessible label. Reduced motion removes the rotation.",
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "Feedback",
    description: "A placeholder for content that is loading.",
    tags: ["loading", "placeholder"],
    props: [
      {
        name: "native div props",
        description: "See native element or primitive documentation",
      },
      {
        name: "style",
        description: "CSSProperties",
      },
    ],
    example: "<Skeleton style={{width:180}} />",
    accessibility:
      "Decorative and hidden from assistive technology. Mark the containing region aria-busy when needed.",
  },
  {
    name: "Badge",
    slug: "badge",
    category: "Feedback",
    description: "A compact label for metadata or state.",
    tags: ["label", "status", "tag"],
    props: [
      {
        name: "tone",
        description: "neutral | success | warning | danger",
      },
      {
        name: "size",
        description: "sm | md | lg",
      },
    ],
    example: '<Badge tone="success">Ready</Badge>',
    accessibility:
      "Use text as well as color to communicate status. Badges are noninteractive.",
  },
  {
    name: "StatusIndicator",
    slug: "status-indicator",
    category: "Feedback",
    description: "A labelled status with a colored indicator.",
    tags: ["status", "dot", "online"],
    props: [
      {
        name: "tone",
        description: "neutral | success | warning | danger",
      },
      {
        name: "children",
        description: "ReactNode",
      },
    ],
    example: '<StatusIndicator tone="success">Operational</StatusIndicator>',
    accessibility: "The dot is decorative; always provide a textual status.",
  },
  {
    name: "Card",
    slug: "card",
    category: "Data",
    description: "Groups related content on a surface.",
    tags: ["surface", "content", "container"],
    props: [
      {
        name: "variant",
        description: "outlined | elevated | filled",
      },
      {
        name: "native div props",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      '<Card variant="outlined"><strong>Project</strong><p>Project details.</p></Card>',
    accessibility:
      "A neutral div container. Add an appropriate heading for your content.",
  },
  {
    name: "ListItem",
    slug: "list-item",
    category: "Data",
    description: "A row in a semantic list.",
    tags: ["list", "row", "content"],
    props: [
      {
        name: "native li props",
        description: "See native element or primitive documentation",
      },
    ],
    example:
      "<ul><ListItem>First item</ListItem><ListItem>Second item</ListItem></ul>",
    accessibility:
      "Place inside ul or ol. Do not use a list item as an unlabelled button.",
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "Data",
    description: "An image with an initials fallback.",
    tags: ["image", "profile", "fallback"],
    props: [
      {
        name: "src",
        description: "string",
      },
      {
        name: "alt / fallback",
        description: "string",
      },
      {
        name: "size",
        description: "sm | md | lg",
      },
      {
        name: "imageProps",
        description: "image attributes",
      },
    ],
    example: '<Avatar alt="Alex Morgan" fallback="AM" />',
    accessibility:
      "Provide meaningful alt text. The fallback is accessible when the image is absent or fails.",
  },
  {
    name: "Table",
    slug: "table",
    category: "Data",
    description: "A horizontally scrollable semantic table.",
    tags: ["data", "rows", "columns"],
    props: [
      {
        name: "native table props",
        description: "See native element or primitive documentation",
      },
      {
        name: "children",
        description: "semantic table sections",
      },
    ],
    example:
      '<Table><caption>Projects</caption><thead><tr><th scope="col">Name</th></tr></thead><tbody><tr><td>Example</td></tr></tbody></Table>',
    accessibility:
      "Use caption and scoped header cells. Retains native table semantics.",
  },
  {
    name: "EmptyState",
    slug: "empty-state",
    category: "Data",
    description: "Explains when a collection has no content.",
    tags: ["empty", "placeholder", "content"],
    props: [
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "action",
        description: "ReactNode",
      },
    ],
    example:
      '<EmptyState title="No results" description="Try a different search." />',
    accessibility: "Use a clear description and an optional labelled action.",
  },
  {
    name: "Divider",
    slug: "divider",
    category: "Data",
    description: "Separates related content regions.",
    tags: ["separator", "horizontal"],
    props: [
      {
        name: "native hr props",
        description: "See native element or primitive documentation",
      },
    ],
    example: "<Divider />",
    accessibility: "Uses a semantic horizontal rule.",
  },
  {
    name: "CodeBlock",
    slug: "code-block",
    category: "Data",
    description: "Displays code with a copy action.",
    tags: ["code", "snippet", "copy"],
    props: [
      {
        name: "code",
        description: "string",
      },
      {
        name: "language",
        description: "string",
      },
      {
        name: "copyable",
        description: "boolean",
      },
    ],
    example: "<CodeBlock code={'import { Button } from \"@cobalt/ui\";'} />",
    accessibility:
      "The code region is keyboard scrollable. Copy failure keeps the text available for manual selection.",
  },
  {
    name: "Stack",
    slug: "stack",
    category: "Layout",
    description: "Arranges children vertically with token spacing.",
    tags: ["layout", "vertical", "gap"],
    props: [
      {
        name: "gap",
        description: "1 | 2 | 3 | 4 | 5 | 6",
      },
      {
        name: "align",
        description: "start | center | end | stretch",
      },
    ],
    example: "<Stack gap={3}><div>First</div><div>Second</div></Stack>",
    accessibility:
      "Preserves DOM order; does not change the semantics of its children.",
  },
  {
    name: "Inline",
    slug: "inline",
    category: "Layout",
    description: "Arranges children in a wrapping horizontal row.",
    tags: ["layout", "horizontal", "wrap", "gap"],
    props: [
      {
        name: "gap",
        description: "1 | 2 | 3 | 4 | 5 | 6",
      },
      {
        name: "align",
        description: "start | center | end | stretch",
      },
    ],
    example: "<Inline gap={2}><Badge>One</Badge><Badge>Two</Badge></Inline>",
    accessibility: "Preserves reading order and wraps at narrow widths.",
  },
  {
    name: "Container",
    slug: "container",
    category: "Layout",
    description: "Centers content with a shared maximum width.",
    tags: ["layout", "width", "responsive"],
    props: [
      {
        name: "native div props",
        description: "See native element or primitive documentation",
      },
      {
        name: "--ui-container-width",
        description: "CSS token",
      },
    ],
    example: "<Container><p>Page content</p></Container>",
    accessibility:
      "A neutral layout container; add landmarks in the consuming application.",
  },
  {
    name: "Panel",
    slug: "panel",
    category: "Layout",
    description: "An inset surface for grouped content.",
    tags: ["layout", "surface", "section"],
    props: [
      {
        name: "native div props",
        description: "See native element or primitive documentation",
      },
    ],
    example: "<Panel><p>Panel content</p></Panel>",
    accessibility: "Use headings to describe the grouped content.",
  },
  {
    name: "SplitView",
    slug: "split-view",
    category: "Layout",
    description: "A responsive two-column layout.",
    tags: ["layout", "columns", "responsive"],
    props: [
      {
        name: "native div props",
        description: "See native element or primitive documentation",
      },
      {
        name: "children",
        description: "two layout regions",
      },
    ],
    example:
      "<SplitView><Panel>Sidebar</Panel><Panel>Content</Panel></SplitView>",
    accessibility:
      "Collapses to one column below 640px; DOM order remains the reading order.",
  },
  {
    name: "OTPInput",
    slug: "otp-input",
    category: "Inputs",
    description: "A native one-time-code input with animated digit slots.",
    tags: ["otp", "2fa", "verification", "security", "code", "autofill"],
    props: [
      {
        name: "label",
        description: "string",
      },
      {
        name: "length",
        description: "number (1\u201312)",
      },
      {
        name: "value / defaultValue",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(code) => void",
      },
      {
        name: "onComplete",
        description: "(code) => void",
      },
      {
        name: "invalid",
        description: "boolean",
      },
      {
        name: "separatorAfter",
        description: "number",
      },
    ],
    example:
      '<OTPInput label="Verification code" value={code} onValueChange={setCode} onComplete={verifyCode} />',
    accessibility:
      "One native input supports autofill, paste, selection, arrows and form submission. Labels and errors should explain where to find the code. This component does not verify codes.",
  },
  {
    name: "PasswordInput",
    slug: "password-input",
    category: "Inputs",
    description: "A password field with an accessible visibility toggle.",
    tags: ["password", "login", "security", "show", "hide"],
    props: [
      {
        name: "Input props",
        description: "Relevant native props",
      },
      {
        name: "autoComplete",
        description: "current-password | new-password",
      },
    ],
    example:
      '<PasswordInput aria-label="Password" autoComplete="current-password" />',
    accessibility:
      "Visibility toggle exposes aria-pressed. Password-manager autocomplete is preserved.",
  },
  {
    name: "FormField",
    slug: "form-field",
    category: "Inputs",
    description: "Connects a label, hint, error and native form control.",
    tags: ["form", "validation", "label", "error"],
    props: [
      {
        name: "label",
        description: "string",
      },
      {
        name: "hint / error",
        description: "string",
      },
      {
        name: "required",
        description: "boolean",
      },
      {
        name: "children",
        description: "(binding) => ReactNode",
      },
    ],
    example:
      '<FormField label="Email" hint="Use your account email." required>{field => <Input {...field} type="email" />}</FormField>',
    accessibility:
      "The binding supplies id, required, aria-describedby and aria-invalid. Errors have an alert role.",
  },
  {
    name: "InputGroup",
    slug: "input-group",
    category: "Inputs",
    description: "Adds leading icons or trailing actions to a field.",
    tags: ["input", "adornment", "icon", "search"],
    props: [
      {
        name: "leading / trailing",
        description: "ReactNode",
      },
      {
        name: "children",
        description: "input element",
      },
    ],
    example:
      '<InputGroup leading={<Search size={16} aria-hidden="true" />}><Input aria-label="Search games" /></InputGroup>',
    accessibility:
      "Label the nested input. Label any interactive trailing controls separately.",
  },
  {
    name: "CopyField",
    slug: "copy-field",
    category: "Data",
    description: "Displays a value with an announced copy action.",
    tags: ["copy", "clipboard", "token", "key"],
    props: [
      {
        name: "value / label",
        description: "string",
      },
      {
        name: "masked",
        description: "boolean",
      },
      {
        name: "onCopy",
        description: "() => void",
      },
    ],
    example: '<CopyField label="Example setup key" value="DEMO-KEY-ONLY" />',
    accessibility:
      "Copy success and failure are announced. Masking only hides presentation; do not pass secrets to untrusted clients.",
  },
  {
    name: "RecoveryCodes",
    slug: "recovery-codes",
    category: "Data",
    description: "An explicit reveal for a set of backup codes.",
    tags: ["2fa", "recovery", "backup", "security", "codes"],
    props: [
      {
        name: "codes",
        description: "string[]",
      },
      {
        name: "label",
        description: "string",
      },
      {
        name: "defaultRevealed",
        description: "boolean",
      },
    ],
    example: '<RecoveryCodes codes={["DEMO-1234", "DEMO-5678"]} />',
    accessibility:
      "Reveal exposes expanded state and controls relationship. Generate, store and invalidate real codes in your authentication system.",
  },
  {
    name: "DeviceSession",
    slug: "device-session",
    category: "Data",
    description: "A device session row with an optional sign-out action.",
    tags: ["device", "session", "security", "account", "logout"],
    props: [
      {
        name: "device / details",
        description: "string",
      },
      {
        name: "current",
        description: "boolean",
      },
      {
        name: "onRevoke",
        description: "() => void",
      },
      {
        name: "revoking",
        description: "boolean",
      },
    ],
    example:
      '<DeviceSession device="Firefox on Linux" details="Last active today" onRevoke={revokeSession} />',
    accessibility:
      "The revoke button includes the device name in its label. Current sessions omit the revoke action.",
  },
  {
    name: "SettingsRow",
    slug: "settings-row",
    category: "Layout",
    description: "A setting description paired with a control.",
    tags: ["settings", "appearance", "toggle", "preferences"],
    props: [
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "icon / control",
        description: "ReactNode",
      },
    ],
    example:
      '<SettingsRow title="Notifications" description="Show desktop alerts." control={<Switch label="Enable notifications" />} />',
    accessibility:
      "Controls need their own accessible name. The row uses a responsive layout without changing reading order.",
  },
  {
    name: "Accordion",
    slug: "accordion",
    category: "Data",
    description: "Keyboard-accessible expanding content sections.",
    tags: ["faq", "disclosure", "expand", "keyboard"],
    props: [
      {
        name: "items",
        description: "{value,title,content,disabled?}[]",
      },
      {
        name: "value / defaultValue",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(value) => void",
      },
    ],
    example:
      '<Accordion items={[{value:"privacy",title:"Where is my library stored?",content:"On your device."}]} />',
    accessibility:
      "Radix manages expanded state, content relationships and arrow/Home/End navigation. Height animation respects reduced motion.",
  },
  {
    name: "Stepper",
    slug: "stepper",
    category: "Navigation",
    description: "Shows current and completed steps in a flow.",
    tags: ["steps", "onboarding", "progress", "waitlist"],
    props: [
      {
        name: "steps",
        description: "string[]",
      },
      {
        name: "currentStep",
        description: "zero-based number",
      },
      {
        name: "label",
        description: "string",
      },
    ],
    example:
      '<Stepper label="Setup progress" steps={["Account", "Verify", "Done"]} currentStep={1} />',
    accessibility:
      'Current step uses aria-current="step" and completed steps include accessible text. This is a status indicator, not navigation.',
  },
  {
    name: "OptionCard",
    slug: "option-card",
    category: "Inputs",
    description: "A native radio option with a selectable card surface.",
    tags: ["radio", "option", "appearance", "layout", "selection"],
    props: [
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "icon",
        description: "ReactNode",
      },
      {
        name: "native input props except type",
        description: "Relevant native props",
      },
    ],
    example:
      '<OptionCard name="layout" value="workspace" title="Workspace" description="A compact, focused layout." />',
    accessibility:
      "Use a shared name inside a labelled fieldset. Native radio arrow navigation and form submission are preserved.",
  },
  {
    name: "FileUpload",
    slug: "file-upload",
    category: "Inputs",
    description: "A keyboard-accessible upload chooser and drop target.",
    tags: ["upload", "file", "avatar", "image", "drag", "drop"],
    props: [
      {
        name: "label / description",
        description: "string",
      },
      {
        name: "accept",
        description: "string",
      },
      {
        name: "maxBytes",
        description: "number",
      },
      {
        name: "onFilesChange",
        description: "(files) => void",
      },
      {
        name: "disabled",
        description: "boolean",
      },
    ],
    example:
      '<FileUpload label="Profile image" accept="image/*" maxBytes={2097152} onFilesChange={setFiles} />',
    accessibility:
      "The native input and Browse button both work by keyboard. Errors are announced. File validation here is client-side only; validate uploads on your server.",
  },
  {
    name: "StatCard",
    slug: "stat-card",
    category: "Data",
    description: "A numeric summary with contextual detail.",
    tags: ["statistics", "playtime", "library", "metric"],
    props: [
      {
        name: "label / value",
        description: "string",
      },
      {
        name: "detail",
        description: "string",
      },
      {
        name: "icon",
        description: "ReactNode",
      },
    ],
    example:
      '<StatCard label="Games in your library" value="128" detail="Across 4 stores" />',
    accessibility:
      "Labels and values are rendered as text. Use a meaningful parent heading for groups of statistics.",
  },
  {
    name: "FeatureCard",
    slug: "feature-card",
    category: "Data",
    description: "An icon, heading and description for a feature.",
    tags: ["feature", "marketing", "card", "overview"],
    props: [
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "icon / action",
        description: "ReactNode",
      },
    ],
    example:
      '<FeatureCard icon={<Library size={20} />} title="One library" description="All your games, together." />',
    accessibility:
      "Icons are decorative. Use a descriptive action when making a card actionable.",
  },
  {
    name: "AppShell",
    slug: "app-shell",
    category: "Layout",
    description: "A responsive application frame with navigation and header.",
    tags: ["shell", "sidebar", "dashboard", "layout", "app"],
    props: [
      {
        name: "sidebar / header",
        description: "ReactNode",
      },
      {
        name: "sidebarLabel",
        description: "string",
      },
      {
        name: "children",
        description: "ReactNode",
      },
    ],
    example:
      '<AppShell sidebar={<NavigationItem href="/library">Library</NavigationItem>} header="Your library"><p>Page content</p></AppShell>',
    accessibility:
      "Sidebar is a labelled navigation landmark. Add your main landmark at the application level; this component can also be safely embedded in a preview.",
  },
  {
    name: "PageHeader",
    slug: "page-header",
    category: "Layout",
    description: "A page title and supporting actions.",
    tags: ["heading", "title", "toolbar", "page"],
    props: [
      {
        name: "title / description / eyebrow",
        description: "string",
      },
      {
        name: "actions",
        description: "ReactNode",
      },
    ],
    example:
      '<PageHeader title="Library" description="All your games, in one place." actions={<Button>Add game</Button>} />',
    accessibility:
      "Uses an h2 so it can be composed under an application heading. Actions remain semantic buttons or links.",
  },
  {
    name: "AuthPanel",
    slug: "auth-panel",
    category: "Layout",
    description: "A content frame for account and verification flows.",
    tags: ["auth", "login", "2fa", "waitlist", "panel"],
    props: [
      {
        name: "title / description",
        description: "string",
      },
      {
        name: "icon / footer",
        description: "ReactNode",
      },
      {
        name: "children",
        description: "ReactNode",
      },
    ],
    example:
      '<AuthPanel title="Check your authenticator" description="Enter the six-digit code."><OTPInput label="Verification code" /></AuthPanel>',
    accessibility:
      "Presentation only. Wrap fields in a real form and implement authentication and submission in the consuming application.",
  },
  {
    name: "SiteHeader",
    slug: "site-header",
    category: "Navigation",
    description: "A responsive website header with navigation and actions.",
    tags: ["header", "marketing", "website", "navigation"],
    props: [
      {
        name: "brand",
        description: "ReactNode",
      },
      {
        name: "links",
        description: "{label,href,active?}[]",
      },
      {
        name: "actions",
        description: "ReactNode",
      },
      {
        name: "navigationLabel",
        description: "string",
      },
    ],
    example:
      '<SiteHeader brand="Your project" links={[{label:"Features",href:"/features"}]} actions={<Button>Get started</Button>} />',
    accessibility:
      "Navigation has an accessible label and current links use aria-current. Links remain visible and wrap on small screens.",
  },
  {
    name: "SiteFooter",
    slug: "site-footer",
    category: "Navigation",
    description: "A compact footer with links and copyright.",
    tags: ["footer", "website", "marketing", "links"],
    props: [
      {
        name: "brand",
        description: "ReactNode",
      },
      {
        name: "links",
        description: "SiteLink[]",
      },
      {
        name: "copyright",
        description: "string",
      },
    ],
    example:
      '<SiteFooter brand="Your project" links={[{label:"Privacy",href:"/privacy"}]} copyright="\u00a9 2026 Your project" />',
    accessibility:
      "Uses a footer landmark and a labelled link navigation region.",
  },
  {
    name: "MediaGallery",
    slug: "media-gallery",
    category: "Data",
    description: "Screenshot thumbnails with a keyboard-controlled lightbox.",
    tags: ["screenshot", "image", "gallery", "lightbox", "dialog"],
    props: [
      {
        name: "items",
        description: "{src,alt,title,description?}[]",
      },
      {
        name: "label",
        description: "string",
      },
    ],
    example:
      '<MediaGallery label="Product screenshots" items={[{src:"/library.webp",alt:"Game library grid",title:"Library"}]} />',
    accessibility:
      "Thumbnail buttons open a Radix dialog. Escape closes, arrows change images, focus returns to the original thumbnail. Supply meaningful image alt text.",
  },
  {
    name: "ColorPicker",
    slug: "color-picker",
    category: "Inputs",
    description: "A native color input with selectable palette presets.",
    tags: ["color", "accent", "appearance", "palette", "theme"],
    props: [
      {
        name: "label / value",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(color) => void",
      },
      {
        name: "presets",
        description: "string[]",
      },
    ],
    example:
      '<ColorPicker label="Accent color" value={accent} onValueChange={setAccent} />',
    accessibility:
      "Native color input is labelled. Preset buttons expose their selected state and color value.",
  },
  {
    name: "HotkeyInput",
    slug: "hotkey-input",
    category: "Inputs",
    description: "Records a keyboard shortcut without trapping focus.",
    tags: ["shortcut", "hotkey", "keyboard", "capture"],
    props: [
      {
        name: "label / value",
        description: "string",
      },
      {
        name: "onValueChange",
        description: "(shortcut) => void",
      },
      {
        name: "disabled",
        description: "boolean",
      },
    ],
    example:
      '<HotkeyInput label="Save clip shortcut" value={hotkey} onValueChange={setHotkey} />',
    accessibility:
      "Activate to record. Escape cancels and Tab exits. Application-level shortcut conflict detection and registration are the consumer\u2019s responsibility.",
  },
] as const;
export type ComponentEntry = (typeof registry)[number];
export type ComponentName = ComponentEntry["name"];
