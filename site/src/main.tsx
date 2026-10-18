import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  CodeBlock,
  EmptyState,
  SearchInput,
  Select,
  Switch,
  Table,
  ToastProvider,
  ToastViewport,
} from "@cobalt/ui";
import type { Size, ButtonProps } from "@cobalt/ui";
import { categories, registry, type ComponentEntry } from "../../src/registry";
import { Preview, Variants } from "./previews";
import "@cobalt/ui/styles.css";
import "./site.css";
function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M4 12 12 4M4 4h8v8" />
    </svg>
  );
}
function useRoute() {
  const [route, setRoute] = useState(location.hash.slice(2));
  useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(2));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return route;
}
function App() {
  const route = useRoute();
  const selected = registry.find((c) => c.slug === route);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const t = localStorage.getItem("ui-theme");
      if (t === "light" || t === "dark") return t;
    } catch {}
    return matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.uiTheme = theme;
    try {
      localStorage.setItem("ui-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    document.title = selected
      ? `${selected.name} · UI`
      : "UI · Component reference";
    if (route) document.querySelector<HTMLElement>("main")?.focus();
  }, [route, selected]);
  const shown = registry.filter(
    (c) =>
      (category === "All" || c.category === category) &&
      [c.name, c.category, c.description, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  function filter(cat: string) {
    setCategory(cat);
    if (route) location.hash = "/";
  }
  return (
    <ToastProvider>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/" aria-label="UI home">
          <span className="brand-mark">ui</span>
          <span>
            UI <span className="wordmark-secondary">/ reference</span>
          </span>
        </a>
        <div className="header-tools">
          <Badge>v0.1.0</Badge>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "☾" : "☀"}{" "}
            <span className="theme-text">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </Button>
          <a className="github-link" href="https://github.com/cobalt-gg/webui">
            GitHub <ExternalIcon />
          </a>
        </div>
      </header>
      <div className="site-shell">
        <aside className="sidebar">
          <div className="sidebar-title">LIBRARY</div>
          <nav aria-label="Component categories">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                className={`category-link ${category === cat && !selected ? "is-active" : ""}`}
                onClick={() => filter(cat)}
                aria-pressed={category === cat && !selected}
              >
                <span>{cat === "All" ? "All components" : cat}</span>
                <span className="nav-count">
                  {cat === "All"
                    ? registry.length
                    : registry.filter((c) => c.category === cat).length}
                </span>
              </button>
            ))}
          </nav>
          <div className="sidebar-title components-label">COMPONENTS</div>
          <nav aria-label="Components">
            {registry.map((c) => (
              <a
                key={c.slug}
                className={`component-link ${selected?.slug === c.slug ? "is-active" : ""}`}
                href={`#/${c.slug}`}
                aria-current={selected?.slug === c.slug ? "page" : undefined}
              >
                {c.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <span className="small-dot" /> Built to be shared.
            <br />
            <span>React + TypeScript</span>
          </div>
        </aside>
        <main id="main" tabIndex={-1}>
          {selected ? (
            <Detail key={selected.slug} component={selected} theme={theme} />
          ) : route && route !== "main" ? (
            <EmptyState
              title="Component not found"
              description="This component is not in the library."
              action={<a href="#/">Browse components</a>}
            />
          ) : (
            <>
              <div className="page-eyebrow">THE COMPONENT LIBRARY</div>
              <div className="page-heading">
                <div>
                  <h1>Small pieces. Shared foundations.</h1>
                  <p>Reusable components for the things you build.</p>
                </div>
                <span className="component-total">
                  {registry.length} components
                </span>
              </div>
              <div className="catalog-toolbar">
                <SearchInput
                  aria-label="Search components"
                  placeholder="Search components, tags, or keywords…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="toolbar-hint">React + TypeScript</span>
              </div>
              <nav className="category-tabs" aria-label="Filter components">
                {["All", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    aria-pressed={category === cat}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
              <div className="results-heading">
                <h2>{category === "All" ? "All components" : category}</h2>
                <span role="status">{shown.length} components</span>
              </div>
              {shown.length ? (
                <div className="component-grid">
                  {shown.map((c) => (
                    <article
                      key={c.slug}
                      className="gallery-card"
                      onClick={(e) => {
                        if (
                          !(e.target as HTMLElement).closest(
                            "a,button,input,select,textarea,label,[role=button],[role=tab],[tabindex]",
                          )
                        )
                          location.hash = `/${c.slug}`;
                      }}
                    >
                      <div className="gallery-preview">
                        <Preview name={c.name} />
                      </div>
                      <div className="gallery-card-info">
                        <div className="card-heading">
                          <a href={`#/${c.slug}`}>
                            {c.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                            <ExternalIcon />
                          </a>
                          <span className="card-category">{c.category}</span>
                        </div>
                        <p>{c.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No components found"
                  description="Try another term or category."
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                      }}
                    >
                      Clear filters
                    </Button>
                  }
                />
              )}
              <footer className="site-footer">
                <span>Cobalt UI · Open foundations for the web.</span>
                <span>Accessible by design. Yours to customize.</span>
              </footer>
            </>
          )}
        </main>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}
function Detail({
  component: c,
  theme,
}: {
  component: ComponentEntry;
  theme: "light" | "dark";
}) {
  const [previewTheme, setPreviewTheme] = useState(theme);
  const [size, setSize] = useState<Size>("md");
  const [variant, setVariant] = useState<ButtonProps["variant"]>("primary");
  const [disabled, setDisabled] = useState(false);
  const sizeable = [
    "Button",
    "IconButton",
    "Input",
    "SearchInput",
    "NumberInput",
    "Select",
    "Badge",
  ].includes(c.name);
  const disableable = [
    "Button",
    "IconButton",
    "Input",
    "SearchInput",
    "NumberInput",
    "Select",
    "Textarea",
    "Toggle",
    "Switch",
    "Checkbox",
    "Radio",
    "Slider",
    "SegmentedControl",
  ].includes(c.name);
  return (
    <>
      <a className="back-link" href="#/">
        ← All components
      </a>
      <div className="detail-title">
        <div className="page-eyebrow">{c.category}</div>
        <h1>{c.name.replace(/([a-z])([A-Z])/g, "$1 $2")}</h1>
        <p>{c.description}</p>
        <div className="tag-list">
          {c.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </div>
      <section aria-labelledby="preview-title">
        <div className="section-heading">
          <h2 id="preview-title">Preview</h2>
          <span>Interactive example</span>
        </div>
        <div className="preview-controls">
          <label>
            Theme{" "}
            <Select
              aria-label="Preview theme"
              size="sm"
              value={previewTheme}
              onChange={(e) =>
                setPreviewTheme(e.target.value as "light" | "dark")
              }
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </label>
          {sizeable && (
            <label>
              Size{" "}
              <Select
                aria-label="Preview size"
                size="sm"
                value={size}
                onChange={(e) => setSize(e.target.value as Size)}
              >
                {["sm", "md", "lg"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </label>
          )}
          {["Button", "IconButton"].includes(c.name) && (
            <label>
              Variant{" "}
              <Select
                aria-label="Preview variant"
                size="sm"
                value={variant}
                onChange={(e) =>
                  setVariant(e.target.value as ButtonProps["variant"])
                }
              >
                {["primary", "secondary", "ghost", "destructive"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </Select>
            </label>
          )}
          {disableable && (
            <Switch
              label="Disabled"
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          )}
        </div>
        <div className="detail-preview" data-ui-theme={previewTheme}>
          <Preview
            key={`${size}-${variant}-${disabled}`}
            name={c.name}
            size={size}
            variant={variant}
            disabled={disabled}
          />
        </div>
      </section>
      <section>
        <h2>Import</h2>
        <CodeBlock
          code={`import { ${c.name}${c.name === "Toast" ? ", ToastProvider, ToastViewport" : ""} } from "@cobalt/ui";\nimport "@cobalt/ui/styles.css";`}
        />
      </section>
      <section>
        <h2>Usage</h2>
        <CodeBlock code={c.example} />
      </section>
      <section>
        <h2>Variants & states</h2>
        <div className="variants-preview" data-ui-theme={previewTheme}>
          <Variants name={c.name} />
        </div>
      </section>
      <section>
        <h2>Props</h2>
        <p className="section-description">
          Relevant native HTML or Radix root props are forwarded. Components
          accept className; native form fields and buttons also forward refs.
        </p>
        <Table>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {c.props.map((p, i) => (
              <tr key={i}>
                <td>
                  <code>{p.name}</code>
                </td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
      <section className="a11y-note">
        <h2>Accessibility</h2>
        <p>{c.accessibility}</p>
      </section>
      <a href="#/" className="back-link">
        ← Back to the library
      </a>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
