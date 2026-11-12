# cobalt UI

`@cobalt/ui` is the React component library for cobalt apps, plus a gallery site that shows every component live.

- **114 components** in 10 categories: Text, Actions, Inputs, Pickers, Navigation, Overlays, Feedback, Data, Layout, and Launcher. This covers everything in the previous kit plus 40 new ones, including a launcher set: PlayButton, GameCard, GameHero, DownloadItem, FriendRow, AchievementCard, and TitleBar.
- **Look:** cobalt brand colors (warm graphite surfaces, a single cobalt accent `#3b4275`), Geist and JetBrains Mono, hairline borders, and short, flat motion. Dark theme first, with a light variant.
- **No native pickers:** Select, ColorPicker, DatePicker and Combobox are all custom. They still support keyboard use, typeahead and form submission.
- **Accessibility:** complex interactions use Radix UI primitives (focus traps, roving focus, menus, sliders). Each component's accessibility notes are in the gallery and in `@cobalt/ui/registry`.

## Develop

Requires Node 22 or newer and npm.

```sh
npm install
npm run dev          # gallery at http://localhost:5173, press / to search
npm run typecheck
npm test             # unit and interaction tests (vitest + jsdom)
npm run build        # library to dist/, gallery to site/dist/
npm run test:e2e     # Playwright against the built gallery
```

To run the Playwright tests with an existing Chrome instead of downloading one, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. For example, on macOS:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e
```

## Use it

```sh
npm install github:cobalt-gg/webui
```

```tsx
import { Button, Dialog, Toaster } from "@cobalt/ui";
import "@cobalt/ui/styles.css";

export function App() {
  return (
    <Toaster>
      <Dialog trigger={<Button variant="primary">Details</Button>} title="Skyhaven" description="12.4 GB">
        …
      </Dialog>
    </Toaster>
  );
}
```

- Import `styles.css` once. It includes the tokens; `@cobalt/ui/tokens.css` contains the tokens alone.
- Ordinary components need no provider. For toasts, wrap the app in `<Toaster>` and call `useToast()`.
- React 18 or 19 is a peer dependency. Radix UI and Lucide are runtime dependencies.
- `prepare` builds the library when you install from Git. Pin a tag or commit for reproducible installs.

### Themes and tokens

Dark is the default. Set `data-ui-theme="light"` on `<html>` (or any element, for a themed region) to use the light variant. To customize, override tokens after importing the styles:

```css
:root { --ui-accent: #3b4275; --ui-radius-md: 8px; }
```

Token groups: surfaces (`--ui-bg`, `--ui-surface*`, `--ui-control*`), borders, text, cobalt accent (`--ui-accent`, `--ui-accent-hover`, `--ui-accent-text`, `--ui-accent-soft`, `--ui-accent-border`, `--ui-focus`), status colors and their soft fills, spacing (`--ui-space-1` to `--ui-space-8`), radius, control heights, shadows, type, motion, and z-index layers. The values match the brand palette in `brand.cobalt`.

Overlays render into `document.body`. To keep them inside a themed region, wrap that region in `PortalContainerProvider value={element}`. All motion respects `prefers-reduced-motion`.

## Structure

| Path | What |
| --- | --- |
| `src/components/*.tsx` | Components, one file per category (`pickers.tsx` and `launcher.tsx` are new) |
| `src/tokens/tokens.css` | Design tokens, dark and light |
| `src/styles/*.css` | Component styles; `index.css` imports them in order, and `scripts/build-css.mjs` inlines them into `dist/styles.css` |
| `src/registry.ts` | Metadata for each component (description, props, example, accessibility notes), also exported as `@cobalt/ui/registry` |
| `site/src/previews.tsx` | One live preview per registry entry |
| `site/public/brand`, `favicon.*` | Logo and favicon, copied from `brand.cobalt` |
| `site/public/covers` | Placeholder game covers for fictional games, generated for the gallery |
| `tests/` | `gallery.test.tsx` checks that every registry entry has an export and a preview and renders without warnings; `components.test.tsx` tests behavior; `browser/` holds the Playwright specs |

### Adding a component

1. Write it in the matching `src/components/*.tsx` file and add its styles under `src/styles/`.
2. Add an entry to `src/registry.ts` and a preview in `site/src/previews.tsx`. The gallery test fails if either one is missing.
3. Add interaction tests for its behavior, then run `npm run typecheck && npm test && npm run build`.

## Deploy the gallery

The gallery is static HTML, CSS and JS in `site/dist`, built with `npm run build:site`. It uses hash routes (`/#/play-button`), so it works on any static host without rewrite rules.

- **Cloudflare Workers Static Assets** (current setup): `wrangler.jsonc` points at `site/dist`. Build with `npm run build:site` and deploy with `npx wrangler deploy` (Node 24).
- **Cloudflare Pages:** build command `npm run build:site`, output directory `site/dist`.

`site/public/_headers` caches hashed assets as immutable. Building doesn't deploy anything; deploying, tagging releases and DNS are separate manual steps.

## Credits

Geist and JetBrains Mono are under the SIL Open Font License 1.1 (`site/public/fonts`). Lucide icons are under ISC (`site/public/LUCIDE-LICENSE.txt`). The screenshots in `site/public/examples` come from the cobalt Launcher website; the game names and artwork in them belong to their owners.
