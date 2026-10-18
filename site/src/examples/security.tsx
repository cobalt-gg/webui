import "./recipes.css";
import { useState } from "react";
import {
  AuthPanel,
  OTPInput,
  Button,
  Alert,
  RecoveryCodes,
  CopyField,
  DeviceSession,
  Dialog,
  Stack,
  PageHeader,
  SettingsRow,
  Switch,
  Input,
} from "@cobalt/ui";
import { ShieldCheck, LockKeyhole, Smartphone, KeyRound } from "lucide-react";
export default function SecurityExample() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "error" | "verified">("idle");
  const [recovery, setRecovery] = useState(false);
  const [backup, setBackup] = useState("");
  const [session, setSession] = useState(true);
  return (
    <Stack gap={5}>
      <PageHeader
        title="Account security"
        description="Verification, recovery, and active sessions."
      />
      <AuthPanel
        title={
          state === "verified"
            ? "You’re verified"
            : recovery
              ? "Use a recovery code"
              : "Check your authenticator"
        }
        description={
          state === "verified"
            ? "The local example accepted your code."
            : recovery
              ? "Use a backup code if you cannot access your authenticator."
              : "Enter the six-digit code from your authenticator app."
        }
        icon={<ShieldCheck size={22} />}
        footer="Demo only: use 123456 or DEMO-1234. No real codes are generated, checked, or sent."
      >
        {state === "verified" ? (
          <Alert tone="success" title="Verification complete">
            The next step belongs to your application.
          </Alert>
        ) : (
          <form
            className="ui-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setState(
                (recovery ? backup === "DEMO-1234" : code === "123456")
                  ? "verified"
                  : "error",
              );
            }}
          >
            {recovery ? (
              <Input
                aria-label="Recovery code"
                value={backup}
                onChange={(e) => {
                  setBackup(e.target.value);
                  setState("idle");
                }}
                placeholder="DEMO-1234"
                autoComplete="off"
                required
              />
            ) : (
              <OTPInput
                label="Authenticator code"
                value={code}
                onValueChange={(v) => {
                  setCode(v);
                  setState("idle");
                }}
                invalid={state === "error"}
                aria-describedby="security-demo-error"
                required
              />
            )}
            <p
              id="security-demo-error"
              className={state === "error" ? "ui-field-error" : "ui-field-hint"}
              role={state === "error" ? "alert" : undefined}
            >
              {state === "error"
                ? "That code wasn’t accepted. Try the demo code."
                : "Use the sample code shown below."}
            </p>
            <Button
              type="submit"
              disabled={recovery ? !backup : code.length !== 6}
            >
              <LockKeyhole size={15} />
              Verify code
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRecovery(!recovery);
                setState("idle");
              }}
            >
              {recovery ? "Use authenticator instead" : "Use a recovery code"}
            </Button>
          </form>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCode("");
            setState("idle");
            setRecovery(false);
            setBackup("");
          }}
        >
          Reset verification
        </Button>
      </AuthPanel>
      <SettingsRow
        title="Two-factor authentication"
        description="Require a second step when signing in."
        icon={<Smartphone size={20} />}
        control={<Switch label="Two-factor enabled" defaultChecked />}
      />
      <Dialog
        trigger={
          <Button variant="secondary">
            <KeyRound size={16} />
            View setup and recovery
          </Button>
        }
        title="Your recovery options"
        description="These are deliberately fake example values."
      >
        <CopyField label="Example setup key" value="DEMO-SETUP-KEY-ONLY" />
        <RecoveryCodes
          codes={["DEMO-1234", "DEMO-5678", "DEMO-9012", "DEMO-3456"]}
        />
      </Dialog>
      <div>
        <h3>Active sessions</h3>
        <DeviceSession
          device="Chrome on Windows"
          details="Last active just now"
          current
        />
        {session ? (
          <DeviceSession
            device="Firefox on Linux"
            details="Last active 2 hours ago"
            onRevoke={() => setSession(false)}
          />
        ) : (
          <Alert tone="success" title="Example session signed out">
            This only removed the local example row.
          </Alert>
        )}
      </div>
    </Stack>
  );
}
