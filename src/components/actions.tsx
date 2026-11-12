import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Slot, Switch as RSwitch, Toggle as RToggle, ToggleGroup as RToggleGroup, DropdownMenu as RMenu } from "radix-ui";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cx, ripple, useControllable } from "../lib/utils";
import { usePortalContainer } from "../lib/portal";
import { Spinner } from "./feedback";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  loading?: boolean;
  /** Announced while loading; defaults to the label */
  loadingLabel?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
  /** Render the child element (e.g. an <a>) with button styles */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "secondary",
    size = "md",
    loading,
    loadingLabel,
    leading,
    trailing,
    fullWidth,
    asChild,
    className,
    children,
    disabled,
    onClick,
    type,
    ...props
  },
  ref,
) {
  const classes = cx(
    "ui-btn ui-rippled",
    `is-${variant}`,
    `is-${size}`,
    fullWidth && "is-full",
    loading && "is-loading",
    className,
  );
  if (asChild)
    return (
      <Slot.Root ref={ref} className={classes} onClick={onClick as never} {...props}>
        {children}
      </Slot.Root>
    );
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (loading) return e.preventDefault();
        ripple(e);
        onClick?.(e);
      }}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" label={loadingLabel ?? "Loading"} />
      ) : (
        leading && <span className="ui-btn-icon">{leading}</span>
      )}
      {children && <span className="ui-btn-label">{children}</span>}
      {trailing && !loading && <span className="ui-btn-icon">{trailing}</span>}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "leading" | "trailing" | "children"> {
  /** Required accessible name */
  "aria-label": string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, variant = "ghost", className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cx("ui-icon-btn", className)}
        {...props}
      >
        <span className="ui-btn-icon">{icon}</span>
      </Button>
    );
  },
);

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Join the buttons into one segmented bar */
  attached?: boolean;
}

export function ButtonGroup({ attached, className, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cx("ui-btn-group", attached && "is-attached", className)}
      {...props}
    />
  );
}

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: Size;
}

/** A button that stays pressed (aria-pressed). */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { size = "md", className, onClick, ...props },
  ref,
) {
  return (
    <RToggle.Root
      ref={ref}
      className={cx("ui-toggle ui-rippled", `is-${size}`, className)}
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
      {...props}
    />
  );
});

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  name?: string;
  value?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, description, className, id, ...props },
  ref,
) {
  const control = (
    <RSwitch.Root ref={ref} id={id} className="ui-switch" {...props}>
      <RSwitch.Thumb className="ui-switch-thumb" />
    </RSwitch.Root>
  );
  if (!label) return <span className={className}>{control}</span>;
  return (
    <label className={cx("ui-switch-field", className)}>
      <span className="ui-switch-text">
        <span className="ui-switch-label">{label}</span>
        {description && <span className="ui-hint">{description}</span>}
      </span>
      {control}
    </label>
  );
});

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: Size;
  "aria-label": string;
  className?: string;
  fullWidth?: boolean;
}

/** Single choice from 2–5 options, with a sliding indicator. */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  className,
  fullWidth,
  ...props
}: SegmentedControlProps) {
  const [current, setCurrent] = useControllable(
    value,
    defaultValue ?? options[0]?.value ?? "",
    onValueChange,
  );
  const index = Math.max(0, options.findIndex((o) => o.value === current));
  return (
    <RToggleGroup.Root
      type="single"
      value={current}
      onValueChange={(v) => v && setCurrent(v)}
      className={cx("ui-segmented", `is-${size}`, fullWidth && "is-full", className)}
      style={{ "--ui-seg-count": options.length, "--ui-seg-index": index } as React.CSSProperties}
      {...props}
    >
      <span className="ui-segmented-indicator" aria-hidden="true" />
      {options.map((o) => (
        <RToggleGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className="ui-segment ui-rippled"
          onClick={ripple}
        >
          {o.icon}
          {o.label}
        </RToggleGroup.Item>
      ))}
    </RToggleGroup.Root>
  );
}

export interface ToggleGroupProps {
  options: SegmentOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  "aria-label": string;
  size?: Size;
  className?: string;
}

/** Several independent toggles in one bar (e.g. bold/italic, filters). */
export function ToggleGroup({
  options,
  value,
  defaultValue = [],
  onValueChange,
  size = "md",
  className,
  ...props
}: ToggleGroupProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  return (
    <RToggleGroup.Root
      type="multiple"
      value={current}
      onValueChange={setCurrent}
      className={cx("ui-toggle-group", className)}
      {...props}
    >
      {options.map((o) => (
        <RToggleGroup.Item
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={cx("ui-toggle ui-rippled", `is-${size}`)}
          onClick={ripple}
          aria-label={typeof o.label === "string" ? o.label : undefined}
        >
          {o.icon ?? o.label}
        </RToggleGroup.Item>
      ))}
    </RToggleGroup.Root>
  );
}

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children" | "onCopy"> {
  value: string;
  label?: string;
  copiedLabel?: string;
  onCopy?: (value: string) => void;
}

/** Copies a string to the clipboard and confirms for two seconds. */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  onCopy,
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size={size}
      leading={copied ? <Check size={14} /> : <Copy size={14} />}
      onClick={async () => {
        try {
          await navigator.clipboard?.writeText(value);
        } catch {
          /* clipboard can be blocked; still report the intent */
        }
        onCopy?.(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      {...props}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </Button>
  );
}

export interface SplitButtonAction {
  label: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps extends Omit<ButtonProps, "children"> {
  label: ReactNode;
  actions: SplitButtonAction[];
  menuLabel?: string;
}

/** Primary action with a menu of alternatives (e.g. Play / Play offline). */
export function SplitButton({
  label,
  actions,
  menuLabel = "More options",
  variant = "primary",
  size = "md",
  className,
  ...props
}: SplitButtonProps) {
  const container = usePortalContainer();
  return (
    <div role="group" className={cx("ui-btn-group is-attached ui-split-btn", className)}>
      <Button variant={variant} size={size} {...props}>
        {label}
      </Button>
      <RMenu.Root>
        <RMenu.Trigger asChild>
          <Button variant={variant} size={size} aria-label={menuLabel} className="ui-icon-btn">
            <ChevronDown size={14} />
          </Button>
        </RMenu.Trigger>
        <RMenu.Portal container={container}>
          <RMenu.Content className="ui-menu" align="end" sideOffset={6}>
            {actions.map((a, i) => (
              <RMenu.Item
                key={i}
                className="ui-menu-item"
                disabled={a.disabled}
                onSelect={a.onSelect}
              >
                {a.label}
              </RMenu.Item>
            ))}
          </RMenu.Content>
        </RMenu.Portal>
      </RMenu.Root>
    </div>
  );
}
