import "./recipes.css";
import { useState } from "react";
import {
  FormField,
  Input,
  PasswordInput,
  FileUpload,
  Button,
  Alert,
  SettingsRow,
  Switch,
  PageHeader,
  Avatar,
  Inline,
} from "@cobalt/ui";
import { Save, Bell } from "lucide-react";
export default function AccountExample() {
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@example.com");
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="recipe-account ui-stack"
      onChange={() => setSaved(false)}
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
      }}
    >
      <PageHeader
        title="Your account"
        description="A reusable profile form with native validation."
      />
      <Inline>
        <Avatar
          alt={name || "Profile"}
          fallback={name
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)}
          size="lg"
        />
        <div>
          <strong>{name}</strong>
          <p className="ui-field-hint">Personal account</p>
        </div>
      </Inline>
      <div className="recipe-grid two">
        <FormField label="Display name" required>
          {(field) => (
            <Input
              {...field}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </FormField>
        <FormField
          label="Email address"
          required
          hint="We’ll use this for account updates."
        >
          {(field) => (
            <Input
              {...field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </FormField>
      </div>
      <FormField
        label="New password"
        hint="Leave blank to keep your existing password."
      >
        {(field) => (
          <PasswordInput
            {...field}
            autoComplete="new-password"
            minLength={12}
            placeholder="At least 12 characters"
          />
        )}
      </FormField>
      <FileUpload
        label="Profile image"
        description="PNG or JPEG. Maximum 2 MB. Files stay in this browser example."
        accept="image/png,image/jpeg"
        maxBytes={2097152}
      />
      <SettingsRow
        title="Email notifications"
        description="Product updates and important account messages."
        icon={<Bell size={18} />}
        control={<Switch label="Email notifications" defaultChecked />}
      />
      {saved && (
        <Alert tone="success" title="Example profile saved">
          The form passed browser validation. No account data was sent.
        </Alert>
      )}
      <Button type="submit">
        <Save size={16} />
        Save example profile
      </Button>
    </form>
  );
}
