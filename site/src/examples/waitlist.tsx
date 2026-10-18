import "./recipes.css";
import { useState } from "react";
import {
  AuthPanel,
  Button,
  Stepper,
  Badge,
  Alert,
  SegmentedControl,
  Stack,
  Inline,
} from "@cobalt/ui";
import { LogIn, MailCheck, CheckCircle2, ArrowRight } from "lucide-react";
export default function WaitlistExample() {
  const [state, setState] = useState("signed-out");
  return (
    <Stack gap={5}>
      <SegmentedControl
        aria-label="Waitlist preview state"
        value={state}
        onValueChange={(v) => v && setState(v)}
        options={[
          { value: "signed-out", label: "Signed out" },
          { value: "waiting", label: "Waitlisted" },
          { value: "approved", label: "Approved" },
        ]}
      />
      <AuthPanel
        key={state}
        title={
          state === "signed-out"
            ? "Cobalt is in closed preview"
            : state === "waiting"
              ? "You’re on the waitlist"
              : "Your spot is ready"
        }
        description={
          state === "signed-out"
            ? "Sign in with your account to join the list."
            : state === "waiting"
              ? "We’ll email you when there’s room. Until then, take a look around."
              : "You can now download the launcher and sign in."
        }
        icon={
          state === "signed-out" ? (
            <LogIn size={22} />
          ) : state === "waiting" ? (
            <MailCheck size={22} />
          ) : (
            <CheckCircle2 size={22} />
          )
        }
        footer="Interactive UI example. This does not sign in, join a real waitlist, or grant preview access."
      >
        <Stepper
          label="Waitlist progress"
          steps={["Account", "Waitlisted", "Approved"]}
          currentStep={state === "signed-out" ? 0 : state === "waiting" ? 1 : 2}
        />
        {state === "signed-out" ? (
          <Button onClick={() => setState("waiting")}>
            Preview sign-in handoff
            <ArrowRight size={16} />
          </Button>
        ) : state === "waiting" ? (
          <Inline>
            <Badge tone="warning">Waitlisted</Badge>
            <span className="ui-field-hint">demo@example.com</span>
          </Inline>
        ) : (
          <Alert title="Preview access enabled" tone="success">
            Your application can show its download action here.
          </Alert>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setState("signed-out")}
        >
          Reset example
        </Button>
      </AuthPanel>
    </Stack>
  );
}
