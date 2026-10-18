import { lazy, Suspense } from "react";
import { Badge, CodeBlock, Spinner } from "@cobalt/ui";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { examples } from "../example-registry";
const components = {
  website: lazy(() => import("./website")),
  waitlist: lazy(() => import("./waitlist")),
  security: lazy(() => import("./security")),
  appearance: lazy(() => import("./appearance")),
  library: lazy(() => import("./library")),
  account: lazy(() => import("./account")),
};
const sources = import.meta.glob(["./*.tsx", "!./index.tsx"], {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;
import { useEffect, useState } from "react";
import recipeStyles from "./recipes.css?raw";
import appearanceSchema from "./appearance-schema.json?raw";
import { Tabs } from "@cobalt/ui";
function Source({ slug }: { slug: string }) {
  const [source, setSource] = useState("");
  useEffect(() => {
    let active = true;
    sources[`./${slug}.tsx`]?.().then((s) => {
      if (active) setSource(s);
    });
    return () => {
      active = false;
    };
  }, [slug]);
  return (
    <Tabs
      label="Example source files"
      defaultValue="react"
      items={[
        {
          value: "react",
          label: "React",
          content: source ? (
            <CodeBlock code={source} />
          ) : (
            <p>Loading source…</p>
          ),
        },
        {
          value: "styles",
          label: "Styles",
          content: <CodeBlock language="css" code={recipeStyles} />,
        },
        ...(slug === "appearance"
          ? [
              {
                value: "schema",
                label: "Schema",
                content: <CodeBlock language="json" code={appearanceSchema} />,
              },
            ]
          : []),
      ]}
    />
  );
}
export default function Examples({ slug }: { slug?: string }) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const example = examples.find((e) => e.slug === slug);
  if (!example)
    return (
      <>
        <div className="catalog-intro">
          <div>
            <h1>Examples</h1>
            <p>Complete screens, built from the same components you install.</p>
          </div>
          <Badge>{examples.length} compositions</Badge>
        </div>
        <div className="example-grid">
          {examples.map((e, i) => (
            <a
              href={`#/examples/${e.slug}`}
              key={e.slug}
              className="example-card"
            >
              <span className="example-number">0{i + 1}</span>
              <h2>
                {e.name}
                <ArrowUpRight size={16} />
              </h2>
              <p>{e.description}</p>
              <div>
                {e.components.slice(0, 3).map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </a>
          ))}
        </div>
        <p className="examples-note">
          Public app patterns were inspected on app.cobaltlauncher.com. Security
          and profile flows are additional local UI compositions. None of these
          examples connects to authentication, sends data, or launches games.
        </p>
      </>
    );
  const Component = components[example.slug];
  return (
    <>
      <a className="back-link" href="#/examples">
        <ArrowLeft size={14} />
        All examples
      </a>
      <div className="catalog-intro">
        <div>
          <h1>{example.name}</h1>
          <p>{example.description}</p>
        </div>
        <Badge>Interactive example</Badge>
      </div>
      <div className="example-stage">
        <Suspense fallback={<Spinner aria-label="Loading example" />}>
          <Component />
        </Suspense>
      </div>
      <section className="example-composition">
        <h2>Built with</h2>
        <div className="tag-list">
          {example.components.map((c) => (
            <a
              key={c}
              href={`#/${c === "OTPInput" ? "otp-input" : c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`}
            >
              <Badge>{c}</Badge>
            </a>
          ))}
        </div>
      </section>
      <section>
        <h2>Use this composition</h2>
        <p className="section-description">
          Copy the React source and adapt the handlers, links, images, and data.
          Import @cobalt/ui/styles.css once in your application. The source tabs
          include the React component, shared recipe stylesheet, and appearance
          schema where needed. Install lucide-react for the example icons.
        </p>
        <details
          className="example-source"
          onToggle={(event) => setSourceOpen(event.currentTarget.open)}
        >
          <summary>View and copy the full React source</summary>
          {sourceOpen && <Source key={example.slug} slug={example.slug} />}
        </details>
        <a
          className="github-link"
          href={`https://github.com/cobalt-gg/webui/tree/main/site/src/examples`}
        >
          Recipe source and shared CSS <ArrowUpRight size={13} />
        </a>
      </section>
    </>
  );
}
