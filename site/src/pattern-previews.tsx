import { useId, useState } from "react";
import * as UI from "@cobalt/ui";
import {
  ShieldCheck,
  LockKeyhole,
  Search,
  Bell,
  Gamepad2,
  Library,
  Settings,
  Play,
  LogIn,
} from "lucide-react";
import type { ComponentName } from "../../src/registry";
export function PatternPreview({
  name,
  disabled = false,
}: {
  name: ComponentName;
  disabled?: boolean;
}) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [color, setColor] = useState("#3b4275");
  const [key, setKey] = useState("Ctrl+F10");
  const id = useId();
  switch (name) {
    case "OTPInput":
      return (
        <UI.Stack>
          <UI.OTPInput
            label="Verification code"
            value={code}
            onValueChange={(v) => {
              setCode(v);
              setStatus("");
            }}
            disabled={disabled}
            onComplete={() => setStatus("Six digits entered. Ready to verify.")}
          />
          <span className="ui-field-hint">From your authenticator app.</span>
          <span role="status" className="ui-field-hint">
            {status}
          </span>
        </UI.Stack>
      );
    case "PasswordInput":
      return (
        <UI.PasswordInput
          aria-label="Account password"
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={disabled}
        />
      );
    case "FormField":
      return (
        <UI.FormField
          label="Email address"
          hint="Use the email linked to your account."
          required
        >
          {(field) => (
            <UI.Input
              {...field}
              type="email"
              placeholder="you@example.com"
              disabled={disabled}
            />
          )}
        </UI.FormField>
      );
    case "InputGroup":
      return (
        <UI.InputGroup leading={<Search size={16} aria-hidden="true" />}>
          <UI.Input
            aria-label="Search your library"
            placeholder="Search your library…"
            disabled={disabled}
          />
        </UI.InputGroup>
      );
    case "CopyField":
      return (
        <UI.CopyField label="Example setup key" value="JBSW Y3DP DEMO ONLY" />
      );
    case "RecoveryCodes":
      return (
        <UI.RecoveryCodes
          codes={["DEMO-1234", "DEMO-5678", "DEMO-9012", "DEMO-3456"]}
        />
      );
    case "DeviceSession":
      return status ? (
        <UI.Stack>
          <UI.Alert tone="success" title="Example session signed out">
            The local row was removed.
          </UI.Alert>
          <UI.Button variant="ghost" size="sm" onClick={() => setStatus("")}>
            Reset session
          </UI.Button>
        </UI.Stack>
      ) : (
        <UI.DeviceSession
          device="Firefox on Linux"
          details="Last active 2 hours ago"
          onRevoke={() => setStatus("signed-out")}
        />
      );
    case "SettingsRow":
      return (
        <UI.SettingsRow
          icon={<Bell size={18} />}
          title="Desktop notifications"
          description="Get updates while you play."
          control={<UI.Switch label="Enabled" defaultChecked />}
        />
      );
    case "Accordion":
      return (
        <UI.Accordion
          items={[
            {
              value: "stores",
              title: "Which stores are supported?",
              content: "Steam, Epic Games, GOG, Xbox, EA, Ubisoft, and more.",
            },
            {
              value: "privacy",
              title: "Where is my library stored?",
              content: "Your library and settings stay on your device.",
            },
          ]}
        />
      );
    case "Stepper":
      return (
        <UI.Stepper
          label="Account setup"
          steps={["Account", "Verify", "Ready"]}
          currentStep={1}
        />
      );
    case "OptionCard":
      return (
        <fieldset className="demo-fieldset">
          <legend>Choose your layout</legend>
          <UI.Inline>
            <UI.OptionCard
              name={id}
              value="workspace"
              title="Workspace"
              description="Compact and focused"
              icon={<Library size={18} />}
              defaultChecked
            />
            <UI.OptionCard
              name={id}
              value="casual"
              title="Casual"
              description="More room for your games"
              icon={<Gamepad2 size={18} />}
            />
          </UI.Inline>
        </fieldset>
      );
    case "FileUpload":
      return (
        <UI.FileUpload
          label="Profile image"
          description="PNG or JPEG, up to 2 MB."
          accept="image/png,image/jpeg"
          maxBytes={2097152}
        />
      );
    case "StatCard":
      return (
        <UI.StatCard
          label="Games in your library"
          value="128"
          detail="Across 4 connected stores"
          icon={<Library size={16} />}
        />
      );
    case "FeatureCard":
      return (
        <UI.FeatureCard
          title="One library"
          description="Steam, Epic and GOG. All your installed games, together."
          icon={<Gamepad2 size={22} />}
        />
      );
    case "AppShell":
      return (
        <UI.AppShell
          sidebar={
            <>
              <UI.NavigationItem href="#/app-shell" active>
                <Library size={14} /> Library
              </UI.NavigationItem>
              <UI.NavigationItem href="#/app-shell">
                <Settings size={14} /> Settings
              </UI.NavigationItem>
            </>
          }
          header={
            <>
              <strong>Your library</strong>
              <UI.Badge>128 games</UI.Badge>
            </>
          }
        >
          <UI.EmptyState
            title="Ready to play"
            description="Choose a game from your library."
          />
        </UI.AppShell>
      );
    case "PageHeader":
      return (
        <UI.PageHeader
          title="Your library"
          description="All your games, in one place."
          actions={
            <UI.Button size="sm">
              <Play size={14} />
              Jump back in
            </UI.Button>
          }
        />
      );
    case "AuthPanel":
      return (
        <UI.AuthPanel
          title="Check your authenticator"
          description="Enter the six-digit code to continue."
          icon={<ShieldCheck size={22} />}
          footer="Local example. Try 123456."
        >
          {status === "verified" ? (
            <>
              <UI.Alert tone="success" title="Verified">
                Your code was accepted by this example.
              </UI.Alert>
              <UI.Button
                variant="ghost"
                onClick={() => {
                  setCode("");
                  setStatus("");
                }}
              >
                Reset
              </UI.Button>
            </>
          ) : (
            <>
              <UI.OTPInput
                label="Authenticator code"
                value={code}
                onValueChange={(v) => {
                  setCode(v);
                  setStatus("");
                }}
                invalid={status === "invalid"}
              />
              {status === "invalid" && (
                <p role="alert" className="ui-field-error">
                  Try the example code 123456.
                </p>
              )}
              <UI.Button
                disabled={code.length !== 6}
                onClick={() =>
                  setStatus(code === "123456" ? "verified" : "invalid")
                }
              >
                <LockKeyhole size={14} />
                Verify code
              </UI.Button>
            </>
          )}
        </UI.AuthPanel>
      );
    case "SiteHeader":
      return (
        <UI.SiteHeader
          brand="Your project"
          links={[
            { label: "Overview", href: "#/site-header", active: true },
            { label: "Features", href: "#/site-header" },
          ]}
          actions={
            <UI.Button size="sm">
              <LogIn size={14} />
              Sign in
            </UI.Button>
          }
        />
      );
    case "SiteFooter":
      return (
        <UI.SiteFooter
          brand="Your project"
          links={[
            { label: "Privacy", href: "#/site-footer" },
            { label: "Support", href: "#/site-footer" },
          ]}
          copyright="© 2026 Your project"
        />
      );
    case "MediaGallery":
      return (
        <UI.MediaGallery
          label="Launcher screenshots"
          items={[
            {
              src: "/examples/library.webp",
              alt: "Cobalt library with games arranged in a grid",
              title: "Library",
            },
            {
              src: "/examples/settings.webp",
              alt: "Cobalt appearance settings",
              title: "Settings",
            },
          ]}
        />
      );
    case "ColorPicker":
      return (
        <UI.ColorPicker
          label="Accent color"
          value={color}
          onValueChange={setColor}
        />
      );
    case "HotkeyInput":
      return (
        <UI.HotkeyInput
          label="Save clip shortcut"
          value={key}
          onValueChange={setKey}
        />
      );
  }
}
