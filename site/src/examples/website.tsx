import "./recipes.css";
import { useRef } from "react";
import {
  Button,
  SiteHeader,
  SiteFooter,
  PageHeader,
  FeatureCard,
  MediaGallery,
  Accordion,
  Inline,
  Badge,
} from "@cobalt/ui";
import {
  Gamepad2,
  Video,
  MonitorPlay,
  Clock3,
  Users,
  Monitor,
  ArrowUpRight,
} from "lucide-react";
export default function WebsiteExample() {
  const root = useRef<HTMLDivElement>(null);
  function view(name: string) {
    root.current?.querySelector(`[data-section="${name}"]`)?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "nearest",
    });
  }
  return (
    <div ref={root} className="recipe-website">
      <SiteHeader
        brand="Cobalt"
        navigationLabel="Example website navigation"
        links={[
          { label: "Overview", href: "https://app.cobaltlauncher.com/" },
          {
            label: "Screenshots",
            href: "https://app.cobaltlauncher.com/screenshots",
          },
          {
            label: "Features",
            href: "https://app.cobaltlauncher.com/features",
          },
          {
            label: "Customize",
            href: "https://app.cobaltlauncher.com/customize",
          },
        ]}
        actions={
          <Button size="sm" onClick={() => view("preview")}>
            Explore the preview
            <ArrowUpRight size={14} />
          </Button>
        }
      />
      <div className="recipe-page">
        <PageHeader
          eyebrow="Cobalt Launcher"
          title="Every store. One library."
          description="Your games, captures, and friends in one place. On Windows, macOS, and Linux."
          actions={
            <Button variant="secondary" onClick={() => view("screenshots")}>
              See screenshots
            </Button>
          }
        />
        <div data-section="screenshots">
          <MediaGallery
            label="Cobalt Launcher screenshots"
            items={[
              {
                src: "/examples/library.webp",
                alt: "Cobalt game library on Windows",
                title: "Library",
                description: "All your installed games in one place.",
              },
              {
                src: "/examples/game.webp",
                alt: "A game detail screen in Cobalt",
                title: "Game page",
                description: "Artwork, play controls, and details.",
              },
              {
                src: "/examples/settings.webp",
                alt: "Appearance settings in Cobalt",
                title: "Settings",
                description: "Make the launcher your own.",
              },
            ]}
          />
        </div>
        <div data-section="preview">
          <PageHeader
            title="What’s in the box"
            description="A few of the building blocks behind the launcher."
          />
          <div className="recipe-grid">
            {[
              {
                title: "One library",
                description: "Games from Steam, Epic, GOG, Xbox, and more.",
                Icon: Gamepad2,
              },
              {
                title: "Clips and recordings",
                description:
                  "Save a replay, record a session, or take a screenshot.",
                Icon: Video,
              },
              {
                title: "Couch Mode",
                description: "A controller-first layout for your television.",
                Icon: MonitorPlay,
              },
              {
                title: "Playtime",
                description: "See sessions and activity, day by day.",
                Icon: Clock3,
              },
              {
                title: "Friends",
                description: "See who is online and what they are playing.",
                Icon: Users,
              },
              {
                title: "Every platform",
                description: "Windows, macOS, and Linux.",
                Icon: Monitor,
              },
            ].map(({ Icon, ...feature }) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                icon={<Icon size={20} />}
              />
            ))}
          </div>
        </div>
        <PageHeader title="A few useful answers" />
        <Accordion
          items={[
            {
              value: "stores",
              title: "Does this move my games?",
              content:
                "No. Games launch through the store you already own them on.",
            },
            {
              value: "platforms",
              title: "Which platforms are supported?",
              content: "Windows, macOS, and Linux.",
            },
            {
              value: "preview",
              title: "Can I try the launcher?",
              content:
                "The launcher is in closed preview. The separate waitlist example demonstrates the onboarding UI.",
            },
          ]}
        />
        <Inline>
          <Badge>UI composition example</Badge>
          <span className="ui-field-hint">
            Screenshot assets are from app.cobaltlauncher.com. Navigation links
            open the real public pages.
          </span>
        </Inline>
      </div>
      <SiteFooter
        brand="Cobalt"
        links={[
          { label: "About", href: "https://cobaltlauncher.com/about" },
          { label: "Privacy", href: "https://cobaltlauncher.com/privacy" },
          { label: "Support", href: "mailto:support@cobaltlauncher.com" },
        ]}
        copyright="Cobalt Launcher · Public website composition"
      />
    </div>
  );
}
