import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldCheck,
  Monitor,
  LogOut,
} from "lucide-react";
import { Button, IconButton, cx } from "./actions";
import { Input, type InputProps } from "./inputs";

export interface OTPInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "size" | "maxLength"
> {
  label: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  invalid?: boolean;
  separatorAfter?: number;
}
/** One native input preserves autofill, selection, form submission and mobile keyboard behavior. */
export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  function OTPInput(
    {
      label,
      length = 6,
      value,
      defaultValue = "",
      onValueChange,
      onComplete,
      invalid,
      separatorAfter = 3,
      className,
      onPaste,
      onFocus,
      onBlur,
      onSelect,
      ...props
    },
    forwardedRef,
  ) {
    const count = Math.max(1, Math.min(12, Math.floor(length) || 6));
    const clean = (s: string) => s.replace(/\D/g, "").slice(0, count);
    const [internal, setInternal] = useState(() => clean(defaultValue));
    const [focused, setFocused] = useState(false);
    const [caret, setCaret] = useState(0);
    const input = useRef<HTMLInputElement>(null);
    useImperativeHandle(forwardedRef, () => input.current!);
    const current = clean(value ?? internal);
    function update(raw: string) {
      const next = clean(raw);
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
      if (next.length === count && next !== current) onComplete?.(next);
    }
    return (
      <div
        className={cx("ui-otp", className)}
        data-complete={current.length === count || undefined}
        data-invalid={invalid || undefined}
        data-disabled={props.disabled || undefined}
      >
        <input
          {...props}
          ref={input}
          type="text"
          aria-label={label}
          aria-invalid={invalid || undefined}
          autoComplete={props.autoComplete ?? "one-time-code"}
          inputMode="numeric"
          pattern={`[0-9]{${count}}`}
          minLength={count}
          value={current}
          onChange={(e) => {
            update(e.target.value);
            setCaret(e.target.selectionStart ?? 0);
          }}
          onPaste={(e) => {
            onPaste?.(e);
            if (e.defaultPrevented || props.readOnly || props.disabled) return;
            e.preventDefault();
            const digits = e.clipboardData.getData("text").replace(/\D/g, "");
            const start = e.currentTarget.selectionStart ?? current.length;
            const end = e.currentTarget.selectionEnd ?? start;
            const next = clean(
              current.slice(0, start) + digits + current.slice(end),
            );
            update(next);
            const cursor = Math.min(start + digits.length, count);
            setCaret(cursor);
            queueMicrotask(() =>
              input.current?.setSelectionRange(cursor, cursor),
            );
          }}
          onFocus={(e) => {
            setFocused(true);
            setCaret(e.currentTarget.selectionStart ?? current.length);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onSelect={(e) => {
            setCaret(e.currentTarget.selectionStart ?? 0);
            onSelect?.(e);
          }}
        />
        <div className="ui-otp-slots" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className="ui-otp-slot"
              data-active={
                (focused && i === Math.min(caret, count - 1)) || undefined
              }
              data-filled={!!current[i] || undefined}
              data-separated={(i === separatorAfter && i > 0) || undefined}
            >
              {current[i] || <span className="ui-otp-placeholder" />}
            </span>
          ))}
        </div>
      </div>
    );
  },
);
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ className, disabled, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div className={cx("ui-password", className)}>
        <Input
          {...props}
          ref={ref}
          disabled={disabled}
          type={visible ? "text" : "password"}
        />
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
          disabled={disabled}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
      </div>
    );
  },
);
export interface CopyFieldProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  masked?: boolean;
  onCopy?: () => void;
}
export function CopyField({
  value,
  label,
  masked = false,
  onCopy,
  className,
  ...props
}: CopyFieldProps) {
  const [status, setStatus] = useState("");
  return (
    <div className={cx("ui-copy-field", className)} {...props}>
      <span className="ui-copy-label">{label}</span>
      <div className="ui-copy-value">
        <code>{masked ? "•••• •••• ••••" : value}</code>
        <IconButton
          variant="ghost"
          size="sm"
          aria-label={`Copy ${label}`}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setStatus("Copied");
              onCopy?.();
            } catch {
              setStatus("Copy failed. Select the value to copy.");
            }
          }}
        >
          {status === "Copied" ? <Check size={15} /> : <Copy size={15} />}
        </IconButton>
      </div>
      <span role="status" className="ui-field-hint">
        {status}
      </span>
    </div>
  );
}
export interface RecoveryCodesProps extends HTMLAttributes<HTMLDivElement> {
  codes: string[];
  label?: string;
  defaultRevealed?: boolean;
}
export function RecoveryCodes({
  codes,
  label = "Recovery codes",
  defaultRevealed = false,
  className,
  ...props
}: RecoveryCodesProps) {
  const [visible, setVisible] = useState(defaultRevealed);
  const id = useId();
  return (
    <section
      className={cx("ui-recovery", className)}
      aria-label={label}
      {...props}
    >
      <div className="ui-inline">
        <ShieldCheck size={18} aria-hidden="true" />
        <strong>{label}</strong>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={visible}
          aria-controls={id}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide codes" : "Reveal codes"}
        </Button>
      </div>
      <div id={id} className="ui-recovery-grid" data-revealed={visible}>
        {codes.map((code, i) => (
          <code key={i}>{visible ? code : "•••• – ••••"}</code>
        ))}
      </div>
      <p className="ui-field-hint">
        Keep these somewhere safe. Each code should be used only once.
      </p>
    </section>
  );
}
export interface DeviceSessionProps extends HTMLAttributes<HTMLDivElement> {
  device: string;
  details: string;
  current?: boolean;
  icon?: ReactNode;
  onRevoke?: () => void;
  revokeLabel?: string;
  revoking?: boolean;
}
export function DeviceSession({
  device,
  details,
  current = false,
  icon,
  onRevoke,
  revokeLabel = "Sign out",
  revoking = false,
  className,
  ...props
}: DeviceSessionProps) {
  return (
    <div className={cx("ui-device-session", className)} {...props}>
      <span className="ui-session-icon" aria-hidden="true">
        {icon ?? <Monitor size={20} />}
      </span>
      <div className="ui-session-body">
        <strong>{device}</strong>
        <p>{details}</p>
        {current && (
          <span className="ui-session-current">
            <Check size={12} aria-hidden="true" />
            Current session
          </span>
        )}
      </div>
      {!current && onRevoke && (
        <Button
          variant="ghost"
          size="sm"
          disabled={revoking}
          aria-label={`${revokeLabel}: ${device}`}
          onClick={onRevoke}
        >
          <LogOut size={14} aria-hidden="true" />
          {revoking ? "Signing out…" : revokeLabel}
        </Button>
      )}
    </div>
  );
}
