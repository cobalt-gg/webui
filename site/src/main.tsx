import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  CodeBlock,
  CountUp,
  EmptyState,
  GradientText,
  ScrambleText,
  ShinyText,
  SplitText,
  Typewriter,
  InputGroup,
  SearchInput,
  Table,
  Toast,
  ToastProvider,
  ToastViewport,
} from "@cobalt/ui";
import { ArrowUpRight, Check, Code2, Copy, Search } from "lucide-react";
import { categories, registry, type ComponentEntry } from "../../src/registry";
import { Preview, Variants } from "./previews";
import "@cobalt/ui/styles.css";
import "./site.css";

const INSTALL = "npm install github:cobalt-gg/webui";
const REPO = "https://github.com/cobalt-gg/webui";

const blurbs: Record<(typeof categories)[number], string> = {
  Text: "Click any of these to play them: waves, decodes, typing and shine.",
  Actions: "Buttons and switches. Labels are short verbs.",
  Inputs: "Native fields first, so keyboards and autofill just work.",
  Navigation: "Ways to move around: tabs, menus, headers and steps.",
  Overlays: "Dialogs, menus and tips that sit above the page.",
  Feedback: "Tell people what happened and what is happening.",
  Data: "Cards, lists and tables for showing things.",
  Layout: "Stacks, shells and panels to hold everything else.",
};

/** Previews that need the full width of the grid. */
const wide = new Set<string>([
  "Tabs",
  "Table",
  "AppShell",
  "PageHeader",
  "AuthPanel",
  "SiteHeader",
  "SiteFooter",
  "MediaGallery",
  "SplitView",
  "Container",
  "FileUpload",
  "Accordion",
  "SettingsRow",
  "DeviceSession",
  "RecoveryCodes",
  "CodeBlock",
  "OptionCard",
]);

/** Previews whose content should stretch instead of sitting centered. */
const fill = new Set<string>([
  "Input",
  "Textarea",
  "SearchInput",
  "Select",
  "Slider",
  "NumberInput",
  "ProgressBar",
  "Skeleton",
  "Divider",
  "Stack",
  "Card",
  "Panel",
  "ListItem",
  "FormField",
  "InputGroup",
  "PasswordInput",
  "CopyField",
  "Alert",
  "StatCard",
  "FeatureCard",
  "ColorPicker",
  "EmptyState",
]);

/** Components whose variant sheet shows more than the main preview. */
const hasVariants = new Set<string>([
  "Button",
  "IconButton",
  "Input",
  "SearchInput",
  "NumberInput",
  "Select",
  "Textarea",
  "Badge",
  "Alert",
  "StatusIndicator",
  "Card",
  "Toggle",
  "Switch",
  "Checkbox",
  "Radio",
  "Slider",
  "SegmentedControl",
  "ProgressBar",
  "Tabs",
  "OTPInput",
  "FormField",
  "PasswordInput",
]);

const title = (name: string) =>
  name.replace(/([a-z])([A-Z])|([A-Z])([A-Z][a-z])/g, "$1$3 $2$4");

function matches(c: ComponentEntry, query: string) {
  return [c.name, title(c.name), c.category, c.description, ...c.tags]
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase());
}

function slugFromHash() {
  return decodeURIComponent(location.hash.replace(/^#\/?/, ""));
}

function App() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(slugFromHash());
  const [toast, setToast] = useState("");
  const shown = useMemo(
    () => registry.filter((c) => matches(c, query)),
    [query],
  );

  // Old detail links (#/button) and plain anchors (#button) both land on the card.
  useEffect(() => {
    const go = () => {
      const slug = slugFromHash();
      const el = slug && document.getElementById(slug);
      if (el) {
        el.scrollIntoView({ block: "start" });
        setActive(slug);
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  // Highlight the card nearest the top of the viewport in the index.
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".component");
    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = [...cards].find((c) => seen.get(c.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-80px 0px -55% 0px" },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [shown]);

  useEffect(() => {
    document
      .querySelector(`.index-link[aria-current]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        (event.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"]',
        )
      )
        return;
      event.preventDefault();
      document
        .querySelector<HTMLInputElement>(
          'input[aria-label="Search components"]',
        )
        ?.focus();
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setToast("Install command copied");
    } catch {
      setToast("Couldn't copy. Select the command instead.");
    }
  }

  return (
    <ToastProvider>
      <a className="skip-link" href="#components">
        Skip to components
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="wordmark" href="#top" aria-label="Cobalt UI home">
            <ScrambleText text="cobalt" duration={500} />
            <span>ui</span>
          </a>
          <nav className="site-nav" aria-label="Site">
            <a href="#components">Components</a>
            <a href="#install">Install</a>
          </nav>
          <span className="spacer" />
          <span className="version">v0.2.0</span>
          <a className="header-button" href={REPO}>
            <Code2 size={14} aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero container">
          <span className="eyebrow">@cobalt/ui</span>
          <h1>
            <SplitText text="Every component," />
            <br />
            <GradientText>
              <Typewriter
                words={[
                  "in one place.",
                  "animated.",
                  "accessible.",
                  "dark first.",
                ]}
              />
            </GradientText>
          </h1>
          <p className="hero__lede">
            The React kit behind Cobalt. {registry.length} components with
            graphite surfaces, one cobalt accent and native controls underneath.
            Everything below is live, so click around. Even the headline.
          </p>
          <div className="hero__actions">
            <a
              className="ui-button"
              data-variant="primary"
              data-size="lg"
              href="#components"
            >
              Browse components
            </a>
            <Button variant="secondary" size="lg" onClick={copyInstall}>
              <Copy size={16} aria-hidden="true" />
              Copy install
            </Button>
            <a
              className="ui-button"
              data-variant="ghost"
              data-size="lg"
              href={REPO}
            >
              Source
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <ul className="facts" aria-label="At a glance">
            <li>
              <strong>
                <CountUp value={registry.length} />
              </strong>{" "}
              components
            </li>
            <li>
              <strong>
                <CountUp value={categories.length} duration={800} />
              </strong>{" "}
              categories
            </li>
            <li>React 18 &amp; 19</li>
            <li>Radix under the hood</li>
            <li>Dark first</li>
          </ul>
        </section>

        <div className="container layout" id="components">
          <aside className="index" aria-label="Component index">
            <InputGroup leading={<Search size={15} aria-hidden="true" />}>
              <SearchInput
                aria-label="Search components"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="kbd" aria-hidden="true">
                /
              </kbd>
            </InputGroup>
            <nav aria-label="Components" className="index__groups">
              {categories.map((cat) => {
                const items = shown.filter((c) => c.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat} className="index__group">
                    <a className="index__label" href={`#${cat.toLowerCase()}`}>
                      {cat}
                      <span>{items.length}</span>
                    </a>
                    {items.map((c) => (
                      <a
                        key={c.slug}
                        className="index-link"
                        href={`#${c.slug}`}
                        aria-current={
                          active === c.slug ? "location" : undefined
                        }
                      >
                        {title(c.name)}
                      </a>
                    ))}
                  </div>
                );
              })}
            </nav>
          </aside>

          <div className="catalog">
            <span className="results" role="status">
              {query ? `${shown.length} of ${registry.length} components` : ""}
            </span>
            {shown.length === 0 && (
              <EmptyState
                title="Nothing matches that"
                description="Try a component name, a category or a word like “keyboard”."
                action={
                  <Button variant="secondary" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                }
              />
            )}
            {categories.map((cat) => {
              const items = shown.filter((c) => c.category === cat);
              if (!items.length) return null;
              return (
                <section
                  key={cat}
                  className="category"
                  id={cat.toLowerCase()}
                  aria-labelledby={`${cat}-title`}
                >
                  <div className="category__head">
                    <h2 id={`${cat}-title`}>
                      <SplitText text={cat} stagger={45} />
                    </h2>
                    <p>
                      <ShinyText>{blurbs[cat]}</ShinyText>
                    </p>
                  </div>
                  <div className="grid">
                    {items.map((c) => (
                      <ComponentCard key={c.slug} component={c} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <section className="container" id="install">
          <div className="install">
            <div className="install__text">
              <h2>
                <GradientText>Use it in your app</GradientText>
              </h2>
              <p>
                Install from GitHub, import the stylesheet once, and you're set.
                No provider needed, except one for toasts.
              </p>
            </div>
            <div className="install__code">
              <CodeBlock language="sh" code={INSTALL} />
              <CodeBlock
                code={`import "@cobalt/ui/styles.css";\nimport { Button } from "@cobalt/ui";\n\nexport function Play() {\n  return <Button>Play</Button>;\n}`}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span className="wordmark">
            cobalt<span>ui</span>
          </span>
          <nav aria-label="Footer">
            <a href="#components">Components</a>
            <a href="#install">Install</a>
            <a href={REPO}>GitHub</a>
            <a href="https://cobaltlauncher.com">Cobalt Launcher</a>
          </nav>
        </div>
        <div className="container site-footer__bottom">
          <span>© 2026 Cobalt</span>
          <span>React + TypeScript component kit</span>
        </div>
      </footer>

      <Toast
        title={toast}
        open={!!toast}
        onOpenChange={(open) => !open && setToast("")}
      />
      <ToastViewport />
    </ToastProvider>
  );
}

function ComponentCard({ component: c }: { component: ComponentEntry }) {
  const [open, setOpen] = useState(false);
  const panel = `${c.slug}-details`;
  return (
    <article
      id={c.slug}
      className="component"
      data-wide={wide.has(c.name) || undefined}
      data-open={open || undefined}
      aria-labelledby={`${c.slug}-title`}
    >
      <header className="component__head">
        <h3 id={`${c.slug}-title`}>
          <a href={`#${c.slug}`}>{title(c.name)}</a>
        </h3>
        <button
          type="button"
          className="code-toggle"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <Code2 size={14} aria-hidden="true" />
          )}
          {open ? "Hide code" : "Code"}
          <span className="ui-sr-only"> for {title(c.name)}</span>
        </button>
      </header>
      <div className="stage" data-fill={fill.has(c.name) || undefined}>
        <Preview name={c.name} />
      </div>
      <p className="component__desc">{c.description}</p>
      {open && (
        <div className="details" id={panel}>
          {hasVariants.has(c.name) && (
            <div className="details__block">
              <h4>Variants</h4>
              <div className="stage stage--variants">
                <Variants name={c.name} />
              </div>
            </div>
          )}
          <div className="details__block">
            <h4>Usage</h4>
            <CodeBlock
              code={`import { ${c.name}${c.name === "Toast" ? ", ToastProvider, ToastViewport" : ""} } from "@cobalt/ui";\n\n${c.example}`}
            />
          </div>
          <div className="details__block">
            <h4>Props</h4>
            <Table>
              <thead>
                <tr>
                  <th scope="col">Prop</th>
                  <th scope="col">Type and notes</th>
                </tr>
              </thead>
              <tbody>
                {c.props.map((p) => (
                  <tr key={p.name}>
                    <td>
                      <code>{p.name}</code>
                    </td>
                    <td>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="details__block">
            <h4>Accessibility</h4>
            <p>{c.accessibility}</p>
          </div>
        </div>
      )}
    </article>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
