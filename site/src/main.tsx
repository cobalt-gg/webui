import { lazy, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  CodeBlock,
  EmptyState,
  InputGroup,
  SearchInput,
  Select,
  Switch,
  Table,
  ToastProvider,
  ToastViewport,
  Spinner,
} from "@cobalt/ui";
import type { Size, ButtonProps } from "@cobalt/ui";
import {
  Boxes,
  ArrowUpRight,
  ArrowLeft,
  Sun,
  Moon,
  Search,
  Code2,
  ArrowRight,
} from "lucide-react";
import { categories, registry, type ComponentEntry } from "../../src/registry";
import { examples } from "./example-registry";
import { Preview, Variants } from "./previews";
import "@cobalt/ui/styles.css";
import "./site.css";
import "./identity.css";
const Examples = lazy(() => import("./examples"));
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
  const isExamples = route === "examples" || route.startsWith("examples/");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const saved = localStorage.getItem("ui-theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.uiTheme = theme;
    try {
      localStorage.setItem("ui-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    document.title = selected
      ? `${selected.name} · Cobalt UI`
      : isExamples
        ? "Examples · Cobalt UI"
        : "Components · Cobalt UI";
    if (route) document.querySelector<HTMLElement>("main")?.focus();
  }, [route, selected, isExamples]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !(event.target as HTMLElement).closest(
          'input,textarea,select,[contenteditable="true"]',
        )
      ) {
        const input = document.querySelector<HTMLInputElement>(
          'input[aria-label="Search components"]',
        );
        if (input) {
          event.preventDefault();
          input.focus();
        }
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const shown = registry.filter(
    (c) =>
      (category === "All" || c.category === category) &&
      [c.name, c.category, c.description, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
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
          <Boxes size={25} aria-hidden="true" />
          <strong>
            Cobalt <span>UI</span>
          </strong>
        </a>
        <nav className="primary-nav" aria-label="Documentation">
          <a href="#/" aria-current={!isExamples ? "page" : undefined}>
            Components
          </a>
          <a href="#/examples" aria-current={isExamples ? "page" : undefined}>
            Examples<Badge>{examples.length}</Badge>
          </a>
        </nav>
        <div className="header-tools">
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </Button>
          <a
            className="github-link"
            href="https://github.com/cobalt-gg/webui"
            aria-label="View source on GitHub"
          >
            <Code2 size={17} />
            <span>GitHub</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>
      <div className="site-shell">
        <main id="main" tabIndex={-1}>
          {isExamples ? (
            <Suspense fallback={<Spinner aria-label="Loading examples" />}>
              <Examples key={route} slug={route.split("/")[1]} />
            </Suspense>
          ) : selected ? (
            <Detail key={selected.slug} component={selected} theme={theme} />
          ) : route && route !== "main" ? (
            <EmptyState
              title="Component not found"
              description="This component is not in the library."
              action={<a href="#/">Browse components</a>}
            />
          ) : (
            <>
              <div className="catalog-intro">
                <div>
                  <h1>Components</h1>
                  <p>
                    Primitives and patterns for real interfaces. Try them, then
                    make them yours.
                  </p>
                </div>
                <Badge>{registry.length} components</Badge>
              </div>
              <div className="example-strip">
                <div>
                  <strong>Build a complete screen</strong>
                  <p>From a product website to two-factor authentication.</p>
                </div>
                <a href="#/examples">
                  Explore examples <ArrowRight size={15} />
                </a>
              </div>
              <div className="catalog-toolbar">
                <InputGroup leading={<Search size={16} aria-hidden="true" />}>
                  <SearchInput
                    aria-label="Search components"
                    placeholder="Search components, tags, or keywords…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
                <span className="toolbar-hint">
                  <kbd>/</kbd> to search
                </span>
              </div>
              <nav className="category-tabs" aria-label="Filter components">
                {["All", ...categories].map((cat) => (
                  <button
                    key={cat}
                    aria-pressed={category === cat}
                    onClick={() => setCategory(cat)}
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
                      data-category={c.category}
                    >
                      <div className="gallery-preview">
                        <Preview name={c.name} />
                      </div>
                      <div className="gallery-card-info">
                        <div className="card-heading">
                          <a href={`#/${c.slug}`}>
                            {c.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                            <ArrowUpRight size={14} />
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
                <span>Cobalt UI · React + TypeScript</span>
                <a href="#/examples">
                  See what you can build
                  <ArrowRight size={12} />
                </a>
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
        <ArrowLeft size={14} /> All components
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
        <ArrowLeft size={14} /> Back to the library
      </a>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
