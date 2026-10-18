import "./recipes.css";
import { useEffect, useState, type CSSProperties } from "react";
import {
  SettingsRow,
  ColorPicker,
  SegmentedControl,
  Select,
  Switch,
  Slider,
  AppShell,
  NavigationItem,
  Card,
  Button,
  Badge,
  PageHeader,
  StatCard,
} from "@cobalt/ui";
import {
  Library,
  Settings,
  Palette,
  Play,
  ArrowLeft,
  Gamepad2,
} from "lucide-react";
import schema from "./appearance-schema.json";
type Field = {
  id: string;
  type: string;
  label: string;
  description: string;
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  presets?: string[];
  visibleWhen?: { field: string; value: string | boolean };
};
const games = [
  { name: "Celeste", accent: "#705394" },
  { name: "Hades", accent: "#b94137" },
  { name: "Portal 2", accent: "#297ca3" },
];
export default function AppearanceExample() {
  const [values, setValues] = useState<
    Record<string, string | number | boolean>
  >({ ...schema.defaults });
  const [selected, setSelected] = useState<number | null>(null);
  const [systemDark, setSystemDark] = useState(
    () => matchMedia("(prefers-color-scheme:dark)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme:dark)");
    const change = () => setSystemDark(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const get = (key: string) => values["appearance." + key];
  const set = (key: string, value: string | number | boolean) =>
    setValues((v) => ({ ...v, [key]: value }));
  const theme =
    get("colorScheme") === "system"
      ? systemDark
        ? "dark"
        : "light"
      : String(get("colorScheme"));
  const baseAccent =
    theme === "light" && get("lightAccentEnabled")
      ? String(get("lightAccentColor"))
      : String(get("accentColor"));
  const accent =
    get("adaptiveAccent") && selected !== null
      ? games[selected].accent
      : baseAccent;
  const impact = Number(get("colorImpact"));
  const high =
    get("contrast") === "high" ||
    (get("contrast") === "system" &&
      matchMedia("(prefers-contrast:more)").matches);
  const background = theme === "dark" ? "#141413" : "#f5f5f2";
  const surface = theme === "dark" ? "#1a1a18" : "#ffffff";
  const style = {
    "--ui-bg": `color-mix(in srgb, ${accent} ${impact}%, ${background})`,
    "--ui-surface": `color-mix(in srgb, ${accent} ${impact}%, ${surface})`,
    "--ui-accent":
      theme === "dark" ? `color-mix(in srgb, ${accent} 55%, white)` : accent,
    "--ui-accent-hover": accent,
    "--ui-on-accent": theme === "dark" ? "#141413" : "#fff",
    "--recipe-accent": accent,
    "--ui-text-muted": high
      ? theme === "dark"
        ? "#e6e6e2"
        : "#33332f"
      : undefined,
    "--ui-border": high
      ? "#8f8f88"
      : get("accentReach") === "everywhere"
        ? `color-mix(in srgb, ${accent} 55%, ${theme === "dark" ? "#33332f" : "#d0d0ca"})`
        : undefined,
    filter: `saturate(${1 + Number(get("vibrancy")) / 100})`,
  } as CSSProperties;
  return (
    <div className="appearance-recipe">
      <div className="appearance-controls">
        <PageHeader
          title="Appearance"
          description="Every control from the public Cobalt appearance schema."
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setValues({ ...schema.defaults })}
            >
              Reset
            </Button>
          }
        />
        {schema.sections.map((section) => (
          <section key={section.id}>
            <h3>{section.title}</h3>
            {(section.fields as Field[])
              .filter(
                (f) =>
                  !f.visibleWhen ||
                  values[f.visibleWhen.field] === f.visibleWhen.value,
              )
              .map((field) => {
                const current = values[field.id];
                let control: React.ReactNode;
                if (field.type === "toggle")
                  control = (
                    <Switch
                      label={field.label}
                      checked={!!current}
                      onCheckedChange={(v) => set(field.id, v)}
                    />
                  );
                else if (field.type === "color")
                  control = (
                    <ColorPicker
                      label={field.label}
                      value={String(current)}
                      onValueChange={(v) => set(field.id, v)}
                      presets={field.presets}
                    />
                  );
                else if (field.type === "slider")
                  control = (
                    <div className="appearance-range">
                      <Slider
                        aria-label={field.label}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={Number(current)}
                        onChange={(e) => set(field.id, Number(e.target.value))}
                      />
                      <output>{String(current)}</output>
                    </div>
                  );
                else if (field.type === "select")
                  control = (
                    <Select
                      aria-label={field.label}
                      value={String(current)}
                      onChange={(e) => set(field.id, e.target.value)}
                    >
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  );
                else
                  control = (
                    <SegmentedControl
                      aria-label={field.label}
                      value={String(current)}
                      onValueChange={(v) => v && set(field.id, v)}
                      options={field.options ?? []}
                    />
                  );
                return (
                  <SettingsRow
                    key={field.id}
                    title={field.label}
                    description={field.description}
                    control={control}
                  />
                );
              })}
          </section>
        ))}
      </div>
      <div className="appearance-preview">
        <div className="appearance-preview-label">
          <Palette size={14} />
          <strong>Live preview</strong>
          <span>UI state only</span>
        </div>
        <div className="appearance-viewport">
          <div
            className="appearance-canvas"
            style={{ zoom: Number(get("interfaceScale")) / 100 }}
          >
            <div
              data-ui-theme={theme}
              data-ui-motion={get("reduceMotion") ? "reduce" : undefined}
              data-view={String(get("appView"))}
              data-surface={String(get("surfaceStyle"))}
              data-texture={String(get("backgroundTexture"))}
              data-reach={String(get("accentReach"))}
              style={style}
            >
              <AppShell
                sidebar={
                  <>
                    <strong>COBALT</strong>
                    <NavigationItem
                      href="#/examples/appearance"
                      active={selected === null}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelected(null);
                      }}
                    >
                      <Library size={15} /> Library
                    </NavigationItem>
                    <NavigationItem
                      href="#/examples/appearance"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Settings size={15} /> Settings
                    </NavigationItem>
                  </>
                }
                header={
                  <>
                    <strong>
                      {selected === null
                        ? "Your library"
                        : games[selected].name}
                    </strong>
                    <Badge>Preview</Badge>
                  </>
                }
              >
                <div className="ui-stack">
                  {selected !== null ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(null)}
                      >
                        <ArrowLeft size={14} />
                        Library
                      </Button>
                      <PageHeader
                        title={games[selected].name}
                        description="Adaptive accent follows this example game when enabled."
                      />
                      <Button>
                        <Play size={15} />
                        Play
                      </Button>
                      <StatCard
                        label="Playtime"
                        value="12.4 h"
                        detail="This week"
                      />
                    </>
                  ) : (
                    <>
                      <PageHeader
                        title="Your library"
                        description="Choose a game to preview adaptive accents."
                      />
                      <div className="appearance-games">
                        {games.map((game, i) => (
                          <Card key={game.name}>
                            <Gamepad2 size={28} />
                            <strong>{game.name}</strong>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelected(i)}
                            >
                              Open game
                            </Button>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </AppShell>
            </div>
          </div>
        </div>
        <p className="ui-field-hint">
          Schema inspected from app.cobaltlauncher.com. This preview restyles
          shared components; it does not run the launcher.
        </p>
      </div>
    </div>
  );
}
