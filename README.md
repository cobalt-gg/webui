# Cobalt UI

A reusable React + TypeScript library (`@cobalt/ui`) and its static component reference site. The 68 generic components and patterns cover actions, inputs, navigation, overlays, feedback, display, and layout. Components contain no product branding. The gallery consumes the same source and metadata as the package; it has no backend, authentication, editing, publishing, analytics, or runtime API calls.

## Develop

Use Node.js 22+ and npm. Node 24 is used in the cloud environment.

```sh
npm install
npm run dev
```

`dev` / `dev:site` starts Vite. The site includes search by name, category, description, and tags; live previews; component detail routes; theme, size, variant, and disabled controls where applicable; copyable examples; and API/accessibility notes. All interactions change local example state only.

```sh
npm run typecheck
npm test
npm run build:site
npx playwright install chromium
npm run test:e2e
```

Browser tests run against the production build. To use an existing Chromium binary, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its path. The repository's `.npmrc` keeps npm's cache in ignored `.cache/npm`, which also works in restricted cloud workspaces.

## Structure and adding components

- `src/components/`: typed primitives organized by category. Native buttons and form fields forward refs and native props. Complex interactions use Radix UI, rather than custom focus management.
- `src/tokens/index.css`: semantic colors, spacing, radius, typography, shadows, motion, and layering, with light/dark defaults.
- `src/styles/`: opt-in component styles. No global body reset is applied to consuming applications.
- `src/registry.ts`: shared metadata, props summaries, usage, and accessibility notes. Available separately through `@cobalt/ui/registry` without importing React components.
- `site/src/previews.tsx`: exhaustive, typed preview mapping and variant examples.
- `site/src/main.tsx`: registry-driven navigation, gallery, search, and details.
- `tests/`: component interaction tests and production-site browser tests.

To add a component:

1. Add a typed component in `src/components/`, using native HTML semantics and token-based styles in `src/styles/components.css`. Forward relevant native attributes, support className, and use Radix for complicated keyboard/focus behavior.
2. Export it from `src/index.ts`.
3. Add metadata, an example, prop notes, and accessibility notes in `src/registry.ts`.
4. Add its live preview in `site/src/previews.tsx`. The exhaustive switch causes typechecking to catch missing previews; the gallery, search, and detail page pick up metadata automatically.
5. Add meaningful interaction tests for behavior, then run typecheck, tests, builds, and browser checks.

The public entry point remains intentionally small; future component subpath exports can be added to the package export map without reorganizing the implementation.

## Build

```sh
npm run build         # library and static site
npm run build:ui      # ESM JavaScript, declarations, source maps, CSS → dist/
npm run build:site    # static HTML and hashed assets → site/dist/
npm run preview      # locally serve the built site
```

`prepare` builds the UI during npm/Git installation. React and React DOM are peer dependencies, and are excluded from the library bundle. Radix and Lucide React are runtime dependencies. Only `dist/` is included in the installed package; the gallery is hosted separately. `styles.css` includes tokens and component CSS; `tokens.css` exposes the token defaults alone. Consumers need an ESM-compatible React toolchain.

## Install from GitHub

After these changes have been committed and pushed to this repository:

```sh
npm install github:cobalt-gg/webui
# Current UI kit release:
npm install github:cobalt-gg/webui#v0.2.0
# Once a release tag exists:
npm install github:cobalt-gg/webui#v1.0.0
```

No npm or GitHub Packages publication is required. Git installs need npm lifecycle scripts enabled, Git, registry access, and the Node toolchain to run `prepare`. A tag such as `v1.0.0` must actually be created before that installation form can work; it is not created by this implementation. Private repositories require the consumer's own GitHub access. Pin tags or commit SHAs for reproducibility.

```tsx
import { Button, Dialog } from "@cobalt/ui";
import "@cobalt/ui/styles.css";

export default function Example() {
  return (
    <Dialog
      trigger={<Button variant="primary">Open details</Button>}
      title="Project details"
      description="Review your project information."
    >
      <p>Your content goes here.</p>
    </Dialog>
  );
}
```

Import styles once in the application entry. No provider is required for ordinary components. Toasts require one `ToastProvider` wrapping the application and one `ToastViewport` within it:

```tsx
<ToastProvider>
  <Toast title="Saved" open={open} onOpenChange={setOpen} />
  <ToastViewport />
</ToastProvider>
```

Keep `open` in application state. `CommandMenuTrigger` is a button only: the consumer supplies the command menu and keyboard shortcut logic. Menus accept action items, including disabled and destructive states. Native Select, Checkbox, Radio, and Slider retain platform form and keyboard behavior. Radio groups should use a shared `name` and a labelled fieldset.

## Themes and tokens

Import styles before project overrides:

```css
:root {
  --ui-accent: #4877ff;
  --ui-accent-hover: #315edb;
  --ui-radius-md: 8px;
}
```

The default follows the OS preference. Set `data-ui-theme="light"` or `data-ui-theme="dark"` on `html` to explicitly select a theme. A nested element with that attribute creates a locally themed region. Override semantic tokens at the appropriate scope, including `--ui-on-accent` when changing accent contrast.

Available tokens include `--ui-bg`, `--ui-surface`, `--ui-surface-elevated`, `--ui-border`, `--ui-text`, `--ui-text-secondary`, `--ui-text-muted`, `--ui-accent`, `--ui-accent-hover`, `--ui-on-accent`, `--ui-danger`, `--ui-warning`, `--ui-success`, `--ui-space-1` through `--ui-space-6`, `--ui-radius-*`, `--ui-font-*`, `--ui-weight-*`, `--ui-shadow-*`, `--ui-motion-*`, `--ui-ease`, `--ui-z-overlay`, `--ui-z-popover`, `--ui-z-toast`, and `--ui-container-width`.

Overlays portal to `document.body` by default, inheriting the root theme. For a locally themed embedded region, wrap components with `PortalContainerProvider value={element}` and place the target element within that region. Avoid a target inside an ancestor with clipping, transforms, or restrictive stacking contexts. The gallery uses this to keep overlay preview themes independent of the documentation theme.

SplitView stacks below 640px. CSS variables cannot drive native media query conditions, so that breakpoint is declared directly in CSS. All animation/transition styles respect `prefers-reduced-motion`; loading indicators retain their text/status semantics with motion disabled. Consuming projects remain responsible for accessible labels, good contrast after token overrides, and meaningful page structure.

## Cloudflare Pages

Connect this GitHub repository to a **Cloudflare Pages** project:

| Setting                | Value                                       |
| ---------------------- | ------------------------------------------- |
| Framework preset       | Vite                                        |
| Root directory         | repository root (leave blank)               |
| Production branch      | `main`                                      |
| Build command          | `npm run build:site`                        |
| Build output directory | `site/dist`                                 |
| Node version           | `24` (set `NODE_VERSION` in Pages settings) |

Cloudflare installs dependencies with npm. The lockfile is committed for reproducibility. No Pages Functions, server runtime, or database are required. For an existing Workers project, use the static-assets configuration below instead.

The output is static HTML, CSS, JS, and `_headers`. Vite emits content-hashed assets; `_headers` grants those assets immutable caching. HTML retains Cloudflare's default update behavior. The site uses hash routes (`/#/button`), so component links and reloads work without rewrites or server routing on Pages or another static host. Assets use root-relative URLs, with no hardcoded development origin, externally hosted fonts, or runtime image services. Any Pages domain or custom domain such as `ui.cobaltlauncher.com` works at the domain root. Add the custom domain through Pages settings and follow Cloudflare's DNS instructions.

Publishing the repository changes, creating release tags, connecting Pages, and configuring DNS are separate manual deployment steps. No live deployment is performed by the build scripts.

## Existing Cloudflare Workers project

The same static site can also be hosted with **Workers Static Assets**. Keep your existing Workers project and custom domain; no Pages project or Worker application code is needed. `wrangler.jsonc` points Wrangler at the generated `site/dist` assets.

In the existing Workers project's build settings, use:

| Setting        | Value                 |
| -------------- | --------------------- |
| Root directory | repository root       |
| Build command  | `npm run build:site`  |
| Deploy command | `npx wrangler deploy` |
| Node version   | `24`                  |

The configured Worker name is `webui`. If your existing Worker has a different name, use `npx wrangler deploy --name YOUR_EXISTING_WORKER_NAME` as the deploy command, or update `name` in `wrangler.jsonc` to match. Redeploy the latest `main` commit after saving the settings. Manage `webui.cobaltlauncher.com` on the existing Worker's Domains & Routes page; the configuration intentionally does not replace account or domain settings.

The deployment uploads static assets only. Hash routes and the generated `_headers` work with Workers Static Assets as well. For local deployment validation after building, run `npx wrangler deploy --dry-run`; actual deployment needs Cloudflare authentication, provided automatically by Workers Builds in the connected project.

## Gallery visual identity

The documentation site has its own Cobalt theme in `site/src/identity.css`, separate from the generic package defaults. Its warm charcoal (`#0e0e0d`, `#141413`), indigo (`#3b4275`, `#5a63a0`, `#8b93c9`), and text colors follow the tokens served by cobaltlauncher.com. Geist and JetBrains Mono are self-hosted in `site/public/fonts` with their SIL Open Font License files. The gallery defaults to dark mode and remembers the visitor's theme choice.

The catalog stays compact: Components and Examples navigation, search, category filters, and live previews. Icons use Lucide React. Motion lives in the reusable components: button presses/loading indicators, switch thumb movement, OTP digit entry and errors, accordion expansion, tab panels, menus, sheets, and toast entrances. All respect `prefers-reduced-motion`. Set `data-ui-motion="reduce"` on a container to disable motion for its descendants as well. Press `/` outside a form field to focus component search.

## Recreate the app with compositions

Open **Examples** in the gallery. Each composition has working local interactions and copyable **React** and **Styles** source tabs. Appearance also includes its **Schema** JSON. Copy the example, `recipes.css`, and (for appearance) `appearance-schema.json` from `site/src/examples/`, install `lucide-react`, and import `@cobalt/ui/styles.css` once. The six examples are code-split so their implementation and source do not load with the initial catalog.

| App pattern inspected                                          | Reusable components                                                          | Example route            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------ |
| Public overview, feature cards, screenshot lightbox, footer    | SiteHeader, PageHeader, FeatureCard, MediaGallery, Accordion, SiteFooter     | `/#/examples/website`    |
| Signed-out, waitlisted, and approved screens                   | AuthPanel, Stepper, Badge, Alert, Button                                     | `/#/examples/waitlist`   |
| Appearance schema and 14 settings                              | SettingsRow, SegmentedControl, ColorPicker, Slider, Select, Switch, AppShell | `/#/examples/appearance` |
| Library filters, favorites, capture hotkeys, store connections | AppShell, NavigationItem, InputGroup, Card, HotkeyInput, SettingsRow         | `/#/examples/library`    |
| Additional account security composition                        | OTPInput, PasswordInput, CopyField, RecoveryCodes, DeviceSession, Dialog     | `/#/examples/security`   |
| Additional profile composition                                 | FormField, Input, PasswordInput, FileUpload, SettingsRow                     | `/#/examples/account`    |

The public reference was inspected at app.cobaltlauncher.com: overview, screenshots, features, customization, and waitlist. The appearance JSON comes from its public `preview/preview.json`; all 14 fields are represented. The preview applies view, theme, accent/adaptive accent, color impact/reach, surfaces, scale, motion, contrast, vibrancy, light accent, and texture to shared components. Game auto-launch, recording engines, networking, and authentication are application services, not UI-library responsibilities.

The security/profile examples are additional compositions, rather than claims about private account screens. They use intentionally fake local values (`123456` and `DEMO-1234`) to demonstrate accepted and rejected input. Bind authentication, uploads, and session revocation to your application's APIs when using these components. The documentation site sends no form data and uploads no selected files.

### Verification codes

```tsx
import { useState } from "react";
import { OTPInput, Button, AuthPanel } from "@cobalt/ui";
import "@cobalt/ui/styles.css";

export function VerifyExample() {
  const [code, setCode] = useState("");
  return (
    <AuthPanel
      title="Verify your account"
      description="Use your authenticator app."
    >
      <OTPInput
        label="Verification code"
        name="code"
        value={code}
        onValueChange={setCode}
      />
      <Button disabled={code.length !== 6}>Continue</Button>
    </AuthPanel>
  );
}
```

OTPInput uses a single native input for autofill (`one-time-code`), formatted paste, caret movement, selection, deletion, refs, and form submission. `length` defaults to six digits and supports 1–12; `separatorAfter` controls visual grouping. `onComplete` signals entry completion, not verified identity. Controlled and uncontrolled values, invalid, read-only, and disabled states are supported.

FormField's render prop supplies `id`, `required`, `aria-describedby`, and `aria-invalid`, keeping hints and errors tied to the actual control. Button supports `loading` and `loadingLabel`, sets `aria-busy`, and prevents duplicate activation while loading. FileUpload checks configured types and size locally; production applications must also validate files server-side.
