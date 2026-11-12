import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { Badge, CodeBlock, IconButton, Kbd, SearchInput, Toaster, Tooltip } from "@cobalt/ui";
import { categories, registry, type ComponentDoc } from "@cobalt/ui/registry";
import "@cobalt/ui/styles.css";
import "./site.css";
import { previews, Logo } from "./previews";

/** Previews that need the full content width. */
const WIDE = new Set([
  "Button", "Table", "AppShell", "SiteHeader", "SiteFooter", "GameHero", "GameCard", "Alert", "Banner", "Panel",
  "StatCard", "FeatureCard", "Carousel", "MediaGallery", "AchievementCard", "DownloadItem", "TitleBar", "Tabs",
  "Stepper", "OptionCard", "Accordion", "PageHeader", "SettingsRow", "SplitView", "Container", "Marquee",
]);

const total = registry.length;
const newCount = registry.filter((d) => d.isNew).length;

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const saved = localStorage.getItem("cobalt-ui-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* storage blocked */
    }
    return "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.uiTheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0e0e0d" : "#f5f5f2");
    try {
      localStorage.setItem("cobalt-ui-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  return [theme, setTheme] as const;
}

function matches(doc: ComponentDoc, q: string) {
  if (!q) return true;
  const hay = [doc.name, doc.category, doc.description, ...doc.tags].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function ComponentCard({ doc, highlighted }: { doc: ComponentDoc; highlighted: boolean }) {
  const [open, setOpen] = useState(false);
  const Preview = previews[doc.name];
  return (
    <article id={doc.slug} className={`g-card${WIDE.has(doc.name) ? " is-wide" : ""}${highlighted ? " is-highlighted" : ""}`} aria-labelledby={`${doc.slug}-title`}>
      <header className="g-card-head">
        <div>
          <h3 id={`${doc.slug}-title`} className="g-card-title">
            <a href={`#/${doc.slug}`}>{doc.name}</a>
            {doc.isNew && <Badge tone="accent">New</Badge>}
          </h3>
          <p className="g-card-desc">{doc.description}</p>
        </div>
      </header>
      <div className="g-preview">{Preview ? <Preview /> : <span className="ui-hint">No preview</span>}</div>
      <button type="button" className="g-code-toggle" aria-expanded={open} aria-controls={`${doc.slug}-code`} onClick={() => setOpen((o) => !o)}>
        <span>Code, props &amp; accessibility</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div id={`${doc.slug}-code`} className="g-code">
          <CodeBlock code={doc.example} language="tsx" title="Usage" />
          {doc.props.length > 0 && (
            <dl className="g-props">
              {doc.props.map((p) => (
                <div key={p.name}>
                  <dt className="ui-mono">{p.name}</dt>
                  <dd>{p.description}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="g-a11y"><strong>Accessibility.</strong> {doc.accessibility}</p>
        </div>
      )}
    </article>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState("");
  const [hash, setHash] = useState(() => location.hash.replace(/^#\/?/, ""));
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHash = () => setHash(location.hash.replace(/^#\/?/, ""));
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    addEventListener("hashchange", onHash);
    addEventListener("keydown", onKey);
    return () => (removeEventListener("hashchange", onHash), removeEventListener("keydown", onKey));
  }, []);

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
  }, [hash]);

  const filtered = useMemo(() => registry.filter((d) => matches(d, query)), [query]);
  const grouped = categories.map((cat) => ({ cat, docs: filtered.filter((d) => d.category === cat) })).filter((g) => g.docs.length);

  return (
    <Toaster>
      <a className="g-skip" href="#main">Skip to components</a>
      <header className="g-header">
        <a className="g-brand" href="#" aria-label="cobalt UI, back to top" onClick={() => setQuery("")}>
          <Logo />
          <span className="g-brand-tag">UI</span>
        </a>
        <div className="g-search">
          <SearchInput
            ref={search}
            size="sm"
            placeholder={`Search ${total} components`}
            aria-label="Search components"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            shortcut="/"
          />
        </div>
        <Tooltip content={theme === "dark" ? "Light theme" : "Dark theme"}>
          <IconButton aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </Tooltip>
      </header>

      <div className="g-layout">
        <nav className="g-index" aria-label="Component index">
          {grouped.map(({ cat, docs }) => (
            <div key={cat} className="g-index-group">
              <a className="g-index-cat" href={`#/${cat.toLowerCase()}`}>{cat}<span>{docs.length}</span></a>
              <ul>
                {docs.map((d) => (
                  <li key={d.slug}>
                    <a href={`#/${d.slug}`} aria-current={hash === d.slug ? "location" : undefined}>
                      {d.name}
                      {d.isNew && <span className="g-dot" aria-label="new" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <main id="main" className="g-main">
          {!query && (
            <section className="g-hero">
              <p className="ui-eyebrow">@cobalt/ui · v1.0</p>
              <h1>Every cobalt component, live.</h1>
              <p className="g-lead">
                {total} React components for cobalt apps: {newCount} of them new in 1.0, including a launcher set for game
                libraries, downloads and friends. Everything below is interactive. Press <Kbd>/</Kbd> to search.
              </p>
              <CodeBlock code="npm install github:cobalt-gg/webui" language="bash" title="Install" />
            </section>
          )}
          {query && (
            <p className="g-results" role="status">
              {filtered.length} {filtered.length === 1 ? "result" : "results"} for “{query}”
            </p>
          )}
          {grouped.map(({ cat, docs }) => (
            <section key={cat} id={cat.toLowerCase()} className="g-section" aria-labelledby={`${cat}-h`}>
              <h2 id={`${cat}-h`} className="g-section-title">
                {cat}
                <span>{docs.length}</span>
              </h2>
              <div className="g-grid">
                {docs.map((d) => <ComponentCard key={d.slug} doc={d} highlighted={hash === d.slug} />)}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <div className="g-empty">
              <p>No components match “{query}”.</p>
              <p className="ui-hint">Try a shorter word, like “menu” or “date”.</p>
            </div>
          )}
          <footer className="g-footer">
            <Logo small />
            <span>cobalt UI 1.0 · Geist &amp; JetBrains Mono (SIL OFL) · Lucide icons (ISC)</span>
          </footer>
        </main>
      </div>
    </Toaster>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
