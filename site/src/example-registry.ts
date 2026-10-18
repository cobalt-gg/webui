export const examples = [
  {
    slug: "website",
    name: "Product website",
    description: "Header, feature cards, screenshots, FAQ, and footer.",
    components: [
      "SiteHeader",
      "FeatureCard",
      "MediaGallery",
      "Accordion",
      "SiteFooter",
    ],
  },
  {
    slug: "waitlist",
    name: "Waitlist & onboarding",
    description: "Sign-in handoff, waiting, and approved states.",
    components: ["AuthPanel", "Stepper", "Badge", "Button", "Alert"],
  },
  {
    slug: "security",
    name: "Two-factor authentication",
    description: "Authenticator codes, recovery keys, and device sessions.",
    components: [
      "OTPInput",
      "RecoveryCodes",
      "CopyField",
      "DeviceSession",
      "Dialog",
    ],
  },
  {
    slug: "appearance",
    name: "Appearance settings",
    description: "Layout, theme, accent, surfaces, contrast, and motion.",
    components: [
      "SettingsRow",
      "ColorPicker",
      "SegmentedControl",
      "Slider",
      "OptionCard",
    ],
  },
  {
    slug: "library",
    name: "Launcher workspace",
    description: "Searchable games, filters, a sidebar, and capture settings.",
    components: ["AppShell", "InputGroup", "Tabs", "Card", "HotkeyInput"],
  },
  {
    slug: "account",
    name: "Account & profile",
    description: "Profile fields, password, image upload, and save states.",
    components: [
      "FormField",
      "PasswordInput",
      "FileUpload",
      "SettingsRow",
      "Alert",
    ],
  },
] as const;
