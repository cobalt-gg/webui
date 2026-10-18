import "./recipes.css";
import { useState } from "react";
import {
  AppShell,
  NavigationItem,
  PageHeader,
  InputGroup,
  Input,
  Select,
  Card,
  Badge,
  Button,
  HotkeyInput,
  SettingsRow,
  Switch,
  Alert,
  Inline,
  Stack,
} from "@cobalt/ui";
import {
  Library,
  Search,
  Settings,
  Gamepad2,
  Play,
  Heart,
  Video,
  Download,
} from "lucide-react";
const games = [
  { name: "Celeste", store: "Steam", installed: true, hours: "12.4 h" },
  { name: "Hades", store: "Epic Games", installed: true, hours: "38.2 h" },
  { name: "Portal 2", store: "Steam", installed: false, hours: "6.8 h" },
  { name: "Hollow Knight", store: "GOG", installed: true, hours: "24.1 h" },
];
export default function LibraryExample() {
  const [section, setSection] = useState("library");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [hotkey, setHotkey] = useState("Ctrl+F10");
  const [favorites, setFavorites] = useState<string[]>(["Celeste"]);
  const shown = games.filter(
    (game) =>
      game.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "installed" && game.installed) ||
        (filter === "favorites" && favorites.includes(game.name))),
  );
  return (
    <AppShell
      sidebar={
        <>
          <strong>COBALT</strong>
          {[
            { id: "library", label: "Library", Icon: Library },
            { id: "capture", label: "Capture", Icon: Video },
            { id: "settings", label: "Settings", Icon: Settings },
          ].map(({ id, label, Icon }) => (
            <NavigationItem
              key={id}
              href="#/examples/library"
              active={section === id}
              onClick={(e) => {
                e.preventDefault();
                setSection(id);
              }}
            >
              <Icon size={16} />
              {label}
            </NavigationItem>
          ))}
        </>
      }
      header={
        <>
          <span>Workspace</span>
          <Badge>Local example</Badge>
        </>
      }
    >
      <Stack gap={5}>
        <PageHeader
          title={
            section === "library"
              ? "Your library"
              : section === "capture"
                ? "Capture settings"
                : "Store connections"
          }
          description={
            section === "library"
              ? "Games from every store, shown once."
              : "Change local preview settings without touching your launcher."
          }
        />
        {section === "library" ? (
          <>
            <Inline>
              <InputGroup leading={<Search size={15} aria-hidden="true" />}>
                <Input
                  aria-label="Search games"
                  placeholder="Search games…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
              <Select
                aria-label="Filter games"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All games</option>
                <option value="installed">Installed</option>
                <option value="favorites">Favorites</option>
              </Select>
            </Inline>
            <div className="recipe-grid two">
              {shown.map((game) => (
                <Card key={game.name} className="game-example-card">
                  <div className="game-example-art">
                    <Gamepad2 size={40} />
                  </div>
                  <Inline>
                    <strong>{game.name}</strong>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`${favorites.includes(game.name) ? "Unfavorite" : "Favorite"} ${game.name}`}
                      aria-pressed={favorites.includes(game.name)}
                      onClick={() =>
                        setFavorites((v) =>
                          v.includes(game.name)
                            ? v.filter((x) => x !== game.name)
                            : [...v, game.name],
                        )
                      }
                    >
                      <Heart
                        size={15}
                        fill={
                          favorites.includes(game.name)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </Button>
                  </Inline>
                  <p className="ui-field-hint">
                    {game.store} · {game.hours}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      setMessage(
                        `${game.installed ? "Launch" : "Install"} ${game.name} selected. No game or store was opened.`,
                      )
                    }
                  >
                    {game.installed ? (
                      <Play size={14} />
                    ) : (
                      <Download size={14} />
                    )}{" "}
                    {game.installed ? "Play" : "Install"}
                  </Button>
                </Card>
              ))}
            </div>
            {!shown.length && (
              <Alert title="No games match">
                Try a different search or filter.
              </Alert>
            )}
          </>
        ) : section === "capture" ? (
          <>
            <SettingsRow
              title="Save clip"
              description="Click to record a shortcut. Escape cancels."
              control={
                <HotkeyInput
                  label="Save clip hotkey"
                  value={hotkey}
                  onValueChange={setHotkey}
                />
              }
            />
            <SettingsRow
              title="Replay buffer"
              description="Keep the last 30 seconds ready to save."
              control={<Switch label="Replay buffer" defaultChecked />}
            />
            <SettingsRow
              title="Resolution"
              description="Quality for new recordings."
              control={
                <Select aria-label="Capture resolution" defaultValue="1080">
                  <option value="720">720p</option>
                  <option value="1080">1080p</option>
                  <option value="1440">1440p</option>
                  <option value="2160">4K</option>
                </Select>
              }
            />
          </>
        ) : (
          <>
            {["Steam", "Epic Games", "GOG", "Xbox"].map((store) => (
              <SettingsRow
                key={store}
                title={store}
                description={`Find installed games from ${store}.`}
                icon={<Gamepad2 size={18} />}
                control={<Switch label={`Enable ${store}`} defaultChecked />}
              />
            ))}
          </>
        )}
        {message && (
          <Alert tone="success" title="Example action">
            {message}
          </Alert>
        )}
      </Stack>
    </AppShell>
  );
}
