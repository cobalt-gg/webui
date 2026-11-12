import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { Checkbox as RCheckbox, Popover as RPopover, RadioGroup as RRadio, Select as RSelect, Slider as RSlider } from "radix-ui";
import { usePortalContainer } from "../lib/portal";
import { Check, Eye, EyeOff, Minus, Plus, Search, Upload, X, ChevronDown, ChevronUp, FileIcon } from "lucide-react";
import { clamp, cx, formatBytes, mergeRefs, ripple, useControllable, useFieldId } from "../lib/utils";

/* ---------- FormField ---------- */

interface FieldInfo {
  id: string;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
}
const FieldContext = createContext<FieldInfo | null>(null);

/** Reads id / aria wiring from an enclosing FormField. */
function useField(props: { id?: string; "aria-describedby"?: string; "aria-invalid"?: unknown; required?: boolean }) {
  const field = useContext(FieldContext);
  const invalid = props["aria-invalid"];
  return {
    id: props.id ?? field?.id,
    "aria-describedby": cx(props["aria-describedby"], field?.describedBy) || undefined,
    "aria-invalid": (invalid === true || invalid === "true" || (invalid === undefined && field?.invalid)) || undefined,
    required: props.required ?? field?.required,
  };
}

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  id?: string;
  /** Optional label-row extra, e.g. a "Forgot?" link */
  aside?: ReactNode;
  children: ReactNode | ((field: { id: string; required?: boolean; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode);
}

/** Label, hint and error wired to the control inside it. */
export function FormField({ label, hint, error, required, id, aside, className, children, ...props }: FormFieldProps) {
  const fieldId = useFieldId(id);
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = cx(hintId, errorId) || undefined;
  const info = { id: fieldId, describedBy, invalid: !!error, required };
  return (
    <div className={cx("ui-field", error && "is-invalid", className)} {...props}>
      <div className="ui-field-head">
        <label className="ui-label" htmlFor={fieldId}>
          {label}
          {required && <span className="ui-required" aria-hidden="true"> *</span>}
        </label>
        {aside}
      </div>
      <FieldContext.Provider value={info}>
        {typeof children === "function"
          ? children({ id: fieldId, required, "aria-describedby": describedBy, "aria-invalid": !!error || undefined })
          : children}
      </FieldContext.Provider>
      {hint && <p id={hintId} className="ui-hint">{hint}</p>}
      {error && <p id={errorId} className="ui-error">{error}</p>}
    </div>
  );
}

/* ---------- Text inputs ---------- */

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", leading, trailing, invalid, className, ...props },
  ref,
) {
  const wired = useField({ ...props, "aria-invalid": invalid || props["aria-invalid"] });
  const input = <input ref={ref} className={cx("ui-input", `is-${size}`, !leading && !trailing && className)} {...props} {...wired} />;
  if (!leading && !trailing) return input;
  return (
    <div className={cx("ui-input-wrap", `is-${size}`, className)}>
      {leading && <span className="ui-input-adorn">{leading}</span>}
      {input}
      {trailing && <span className="ui-input-adorn">{trailing}</span>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Show "n / maxLength" */
  showCount?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, showCount, autoResize, className, onChange, maxLength, ...props },
  ref,
) {
  const wired = useField({ ...props, "aria-invalid": invalid || props["aria-invalid"] });
  const [count, setCount] = useState(String(props.value ?? props.defaultValue ?? "").length);
  const area = (
    <textarea
      ref={ref}
      maxLength={maxLength}
      className={cx("ui-input ui-textarea", autoResize && "is-auto", className)}
      onChange={(e) => {
        setCount(e.target.value.length);
        if (autoResize) {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }
        onChange?.(e);
      }}
      {...props}
      {...wired}
    />
  );
  if (!showCount) return area;
  return (
    <div className="ui-textarea-wrap">
      {area}
      <span className="ui-count" aria-live="polite">
        {count}
        {maxLength ? ` / ${maxLength}` : ""}
      </span>
    </div>
  );
});

export interface SearchInputProps extends Omit<InputProps, "type" | "leading"> {
  onClear?: () => void;
  /** Shortcut hint shown at the end, e.g. "/" */
  shortcut?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { onClear, shortcut, value, placeholder = "Search", ...props },
  ref,
) {
  const hasValue = value !== undefined && value !== "";
  return (
    <Input
      ref={ref}
      type="search"
      value={value}
      placeholder={placeholder}
      aria-label={props["aria-label"] ?? placeholder}
      leading={<Search size={15} />}
      trailing={
        hasValue && onClear ? (
          <button type="button" className="ui-close" aria-label="Clear search" onClick={onClear}>
            <X size={14} />
          </button>
        ) : shortcut ? (
          <kbd className="ui-kbd">{shortcut}</kbd>
        ) : undefined
      }
      {...props}
    />
  );
});

export interface PasswordInputProps extends Omit<InputProps, "type" | "trailing"> {
  /** Show a strength bar under the field */
  showStrength?: boolean;
}

function strength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showStrength, onChange, autoComplete = "current-password", ...props },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(String(props.value ?? props.defaultValue ?? ""));
  const score = strength(String(props.value ?? value));
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  return (
    <div className="ui-password">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
        trailing={
          <button
            type="button"
            className="ui-close"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
        {...props}
      />
      {showStrength && (
        <div className="ui-strength" data-score={score}>
          <div className="ui-strength-bars" aria-hidden="true">
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className={cx(n <= score && "is-on")} />
            ))}
          </div>
          <span className="ui-hint" aria-live="polite">{labels[score]}</span>
        </div>
      )}
    </div>
  );
});

export interface NumberInputProps extends Omit<InputProps, "type" | "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, className, size = "md", ...props },
  ref,
) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const set = (n: number) => setCurrent(clamp(Number.isFinite(n) ? n : 0, min, max));
  const wired = useField(props);
  return (
    <div className={cx("ui-number", `is-${size}`, className)}>
      <button type="button" className="ui-number-btn" aria-label="Decrease" disabled={current <= min} onClick={() => set(current - step)}>
        <Minus size={14} />
      </button>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={current}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        className="ui-number-input"
        value={current}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) set(n);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") (e.preventDefault(), set(current + step));
          if (e.key === "ArrowDown") (e.preventDefault(), set(current - step));
        }}
        {...props}
        {...wired}
      />
      <button type="button" className="ui-number-btn" aria-label="Increase" disabled={current >= max} onClick={() => set(current + step)}>
        <Plus size={14} />
      </button>
    </div>
  );
});

export interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  /** Text or element before the control, e.g. "https://" */
  prefix?: ReactNode;
  suffix?: ReactNode;
}

/** Joins an input with addons or buttons on either side. */
export function InputGroup({ prefix, suffix, className, children, ...props }: InputGroupProps) {
  return (
    <div className={cx("ui-input-group", className)} {...props}>
      {prefix && <span className="ui-input-addon">{prefix}</span>}
      {children}
      {suffix && <span className="ui-input-addon">{suffix}</span>}
    </div>
  );
}

/* ---------- OTP ---------- */

export interface OTPInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "maxLength"> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Visual gap after this many digits */
  separatorAfter?: number;
  label?: string;
  invalid?: boolean;
}

/** One native input (autofill, paste, form submit) drawn as separate cells. */
export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(function OTPInput(
  { length = 6, value, defaultValue = "", onValueChange, onComplete, separatorAfter, label = "Verification code", invalid, className, disabled, ...props },
  ref,
) {
  const n = clamp(length, 1, 12);
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const [focused, setFocused] = useState(false);
  const inner = useRef<HTMLInputElement>(null);
  const wired = useField({ ...props, "aria-invalid": invalid });
  const gap = separatorAfter ?? (n === 6 ? 3 : undefined);
  return (
    <div className={cx("ui-otp", invalid && "is-invalid", disabled && "is-disabled", className)} onClick={() => inner.current?.focus()}>
      <input
        ref={mergeRefs(ref, inner)}
        className="ui-otp-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`\\d{${n}}`}
        maxLength={n}
        aria-label={label}
        value={code}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const next = e.target.value.replace(/\D/g, "").slice(0, n);
          setCode(next);
          if (next.length === n) onComplete?.(next);
        }}
        {...props}
        {...wired}
      />
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="ui-otp-group" aria-hidden="true">
          <span className={cx("ui-otp-cell", code[i] && "is-filled", focused && i === Math.min(code.length, n - 1) && "is-active")}>
            {code[i] ?? ""}
          </span>
          {gap && i === gap - 1 && i < n - 1 && <span className="ui-otp-sep" />}
        </span>
      ))}
    </div>
  );
});

/* ---------- Choice controls ---------- */

export interface SelectOption {
  value: string;
  label: string;
  /** Secondary text on the right, e.g. a size or region */
  hint?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Submitted with forms via a hidden native select */
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Custom dropdown: keyboard, typeahead and form submission, styled to match. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, placeholder = "Select…", size = "md", invalid, className, value, defaultValue, onValueChange, disabled, required, name, ...props },
  ref,
) {
  const wired = useField({ ...props, required, "aria-invalid": invalid });
  const container = usePortalContainer();
  return (
    <RSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} required={wired.required} name={name}>
      <RSelect.Trigger
        ref={ref}
        className={cx("ui-input ui-select-trigger", `is-${size}`, className)}
        aria-label={props["aria-label"]}
        id={wired.id}
        aria-describedby={wired["aria-describedby"]}
        aria-invalid={wired["aria-invalid"]}
      >
        <RSelect.Value placeholder={<span className="ui-placeholder">{placeholder}</span>} />
        <RSelect.Icon className="ui-select-icon"><ChevronDown size={15} /></RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal container={container}>
        <RSelect.Content className="ui-menu ui-select-content" position="popper" sideOffset={6} align="start">
          <RSelect.ScrollUpButton className="ui-select-scroll"><ChevronUp size={14} /></RSelect.ScrollUpButton>
          <RSelect.Viewport className="ui-select-viewport">
            {options.map((o) => (
              <RSelect.Item key={o.value} value={o.value} disabled={o.disabled} className="ui-menu-item ui-select-item">
                {o.icon && <span className="ui-menu-check-slot">{o.icon}</span>}
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
                {o.hint && <span className="ui-menu-hint">{o.hint}</span>}
                <RSelect.ItemIndicator className="ui-select-check"><Check size={14} /></RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
          <RSelect.ScrollDownButton className="ui-select-scroll"><ChevronDown size={14} /></RSelect.ScrollDownButton>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
});

export interface CheckboxProps {
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, className, onCheckedChange, id, ...props },
  ref,
) {
  const fid = useFieldId(id);
  const box = (
    <RCheckbox.Root ref={ref} id={fid} className="ui-checkbox" onCheckedChange={(c) => onCheckedChange?.(c === true)} {...props}>
      <RCheckbox.Indicator className="ui-checkbox-mark">
        {props.checked === "indeterminate" ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </RCheckbox.Indicator>
    </RCheckbox.Root>
  );
  if (!label) return <span className={className}>{box}</span>;
  return (
    <div className={cx("ui-choice", props.disabled && "is-disabled", className)}>
      {box}
      <label htmlFor={fid} className="ui-choice-text">
        <span className="ui-choice-label">{label}</span>
        {description && <span className="ui-hint">{description}</span>}
      </label>
    </div>
  );
});

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  className?: string;
}

/** Radio buttons with arrow-key roving focus. */
export function RadioGroup({ options, label, orientation = "vertical", className, ...props }: RadioGroupProps) {
  const base = useFieldId();
  return (
    <fieldset className={cx("ui-fieldset", className)}>
      {label && <legend className="ui-label">{label}</legend>}
      <RRadio.Root className={cx("ui-radio-group", `is-${orientation}`)} orientation={orientation} {...props}>
        {options.map((o) => (
          <div key={o.value} className={cx("ui-choice", o.disabled && "is-disabled")}>
            <RRadio.Item id={`${base}-${o.value}`} value={o.value} disabled={o.disabled} className="ui-radio">
              <RRadio.Indicator className="ui-radio-dot" />
            </RRadio.Item>
            <label htmlFor={`${base}-${o.value}`} className="ui-choice-text">
              <span className="ui-choice-label">{o.label}</span>
              {o.description && <span className="ui-hint">{o.description}</span>}
            </label>
          </div>
        ))}
      </RRadio.Root>
    </fieldset>
  );
}

/** Alias kept for parity with the previous kit. */
export const Radio = RadioGroup;

export interface OptionCardProps extends RadioGroupProps {
  options: (RadioOption & { icon?: ReactNode; meta?: ReactNode })[];
  columns?: number;
}

/** Large selectable cards behaving as a radio group. */
export function OptionCard({ options, label, columns = 2, className, orientation, ...props }: OptionCardProps) {
  return (
    <fieldset className={cx("ui-fieldset", className)}>
      {label && <legend className="ui-label">{label}</legend>}
      <RRadio.Root className="ui-option-cards" style={{ "--ui-cols": columns } as React.CSSProperties} {...props}>
        {options.map((o) => (
          <RRadio.Item key={o.value} value={o.value} disabled={o.disabled} className="ui-option-card ui-rippled" onClick={ripple}>
            {o.icon && <span className="ui-option-icon">{o.icon}</span>}
            <span className="ui-option-text">
              <span className="ui-choice-label">{o.label}</span>
              {o.description && <span className="ui-hint">{o.description}</span>}
            </span>
            {o.meta && <span className="ui-option-meta">{o.meta}</span>}
            <span className="ui-option-check" aria-hidden="true"><Check size={12} strokeWidth={3} /></span>
          </RRadio.Item>
        ))}
      </RRadio.Root>
    </fieldset>
  );
}

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
  showValue?: boolean;
  formatValue?: (n: number) => string;
  disabled?: boolean;
  name?: string;
  className?: string;
  "aria-label"?: string;
}

export function Slider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, label, showValue, formatValue = String, className, ...props }: SliderProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  return (
    <div className={cx("ui-slider-field", className)}>
      {(label || showValue) && (
        <div className="ui-progress-head">
          {label && <span className="ui-label">{label}</span>}
          {showValue && <span className="ui-progress-value">{formatValue(current)}</span>}
        </div>
      )}
      <RSlider.Root className="ui-slider" value={[current]} onValueChange={([v]) => setCurrent(v)} min={min} max={max} step={step} {...props}>
        <RSlider.Track className="ui-slider-track"><RSlider.Range className="ui-slider-range" /></RSlider.Track>
        <RSlider.Thumb className="ui-slider-thumb" aria-label={props["aria-label"] ?? (typeof label === "string" ? label : "Value")} />
      </RSlider.Root>
    </div>
  );
}

/* ---------- File, colour, hotkey ---------- */

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  /** bytes */
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  label?: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** Drop zone with local type and size checks. Validate on the server too. */
export function FileUpload({ accept, multiple, maxSize, onFilesChange, label = "Drop files here or browse", hint, disabled, name, className }: FileUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>();
  const [over, setOver] = useState(false);
  const accepts = (f: File) => {
    if (!accept) return true;
    return accept.split(",").map((s) => s.trim()).some((rule) =>
      rule.startsWith(".") ? f.name.toLowerCase().endsWith(rule.toLowerCase()) : rule.endsWith("/*") ? f.type.startsWith(rule.slice(0, -1)) : f.type === rule,
    );
  };
  const take = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).slice(0, multiple ? undefined : 1);
    const bad = picked.find((f) => !accepts(f) || (maxSize && f.size > maxSize));
    if (bad) {
      setError(!accepts(bad) ? `${bad.name} isn't an accepted file type.` : `${bad.name} is larger than ${formatBytes(maxSize!)}.`);
      return;
    }
    setError(undefined);
    const next = multiple ? [...files, ...picked] : picked;
    setFiles(next);
    onFilesChange?.(next);
  };
  return (
    <div className={cx("ui-upload", className)}>
      <button
        type="button"
        disabled={disabled}
        className={cx("ui-dropzone", over && "is-over")}
        onClick={() => input.current?.click()}
        onDragOver={(e) => (e.preventDefault(), setOver(true))}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files);
        }}
      >
        <Upload size={20} aria-hidden="true" />
        <span className="ui-choice-label">{label}</span>
        {hint && <span className="ui-hint">{hint}</span>}
      </button>
      <input ref={input} type="file" hidden accept={accept} multiple={multiple} name={name} onChange={(e) => take(e.target.files)} />
      {error && <p className="ui-error" role="alert">{error}</p>}
      {files.length > 0 && (
        <ul className="ui-file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="ui-file">
              <FileIcon size={15} aria-hidden="true" />
              <span className="ui-file-name">{f.name}</span>
              <span className="ui-hint">{formatBytes(f.size)}</span>
              <button
                type="button"
                className="ui-close"
                aria-label={`Remove ${f.name}`}
                onClick={() => {
                  const next = files.filter((_, j) => j !== i);
                  setFiles(next);
                  onFilesChange?.(next);
                }}
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  presets?: string[];
  label?: string;
  /** Render the picker panel directly instead of behind a swatch button */
  inline?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = ["#3b4275", "#5a63a0", "#8b93c9", "#5cdba1", "#f7c463", "#f2544b", "#d0d0ca", "#141413"];

type HSV = { h: number; s: number; v: number };

function hexToHsv(hex: string): HSV {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }: HSV) {
  const f = (k: number) => {
    const n = (k + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(n, 4 - n, 1))) * 255);
  };
  return "#" + [f(5), f(3), f(1)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

const isHex = (s: string) => /^#[0-9a-f]{6}$/i.test(s);

function ColorPanel({ color, onChange, presets, label }: { color: string; onChange: (hex: string) => void; presets: string[]; label: string }) {
  // Keep hue when saturation or brightness hits 0 (hex alone would lose it).
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(color));
  const [draft, setDraft] = useState(color);
  const area = useRef<HTMLDivElement>(null);
  // Follow outside changes to `color` (controlled value, presets elsewhere).
  useEffect(() => {
    if (isHex(color) && color !== hsvToHex(hsv) && hsvToHex(hexToHsv(color)) !== hsvToHex(hsv)) {
      setHsv(hexToHsv(color));
      setDraft(color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);
  const apply = (next: HSV) => {
    setHsv(next);
    const hex = hsvToHex(next);
    setDraft(hex);
    onChange(hex);
  };
  // Exact hex in (typed or preset) stays exact; HSV round-trips can drift by 1.
  const applyHex = (hex: string) => {
    setHsv(hexToHsv(hex));
    setDraft(hex);
    onChange(hex);
  };
  const fromPointer = (e: React.PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    apply({ ...hsv, s: clamp((e.clientX - r.left) / r.width, 0, 1), v: 1 - clamp((e.clientY - r.top) / r.height, 0, 1) });
  };
  const onAreaKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.02;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    apply({ ...hsv, s: clamp(hsv.s + m[0], 0, 1), v: clamp(hsv.v + m[1], 0, 1) });
  };
  return (
    <div className="ui-color-panel" role="group" aria-label={label}>
      <div
        ref={area}
        className="ui-color-area"
        role="slider"
        tabIndex={0}
        aria-label={`${label} saturation and brightness`}
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        aria-valuenow={Math.round(hsv.s * 100)}
        style={{ backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 }) }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => e.buttons === 1 && fromPointer(e)}
        onKeyDown={onAreaKey}
      >
        <span className="ui-color-thumb" style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: color }} />
      </div>
      <RSlider.Root className="ui-hue" value={[hsv.h]} min={0} max={359} step={1} onValueChange={([h]) => apply({ ...hsv, h })}>
        <RSlider.Track className="ui-hue-track" />
        <RSlider.Thumb className="ui-hue-thumb" aria-label={`${label} hue`} style={{ background: hsvToHex({ h: hsv.h, s: 1, v: 1 }) }} />
      </RSlider.Root>
      <div className="ui-color-row">
        <span className="ui-color-preview" style={{ background: color }} aria-hidden="true" />
        <input
          className="ui-input is-sm ui-mono"
          aria-label={`${label} hex value`}
          value={draft}
          spellCheck={false}
          onChange={(e) => {
            const v = `#${e.target.value.trim().replace(/^#+/, "").slice(0, 6)}`;
            setDraft(v);
            if (isHex(v)) applyHex(v.toLowerCase());
          }}
          onBlur={() => setDraft(color)}
        />
      </div>
      {presets.length > 0 && (
        <div className="ui-swatches">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              className={cx("ui-swatch", p.toLowerCase() === color && "is-selected")}
              style={{ background: p }}
              aria-label={p}
              aria-pressed={p.toLowerCase() === color}
              onClick={() => applyHex(p.toLowerCase())}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Saturation/brightness area, hue slider, hex field and presets. Behind a swatch button unless inline. */
export function ColorPicker({ value, defaultValue = "#3b4275", onValueChange, presets = DEFAULT_PRESETS, label = "Color", inline, className }: ColorPickerProps) {
  const [color, setColor] = useControllable(value, defaultValue, onValueChange);
  const container = usePortalContainer();
  const panel = <ColorPanel color={color} onChange={setColor} presets={presets} label={label} />;
  if (inline) return <div className={cx("ui-color", className)}>{panel}</div>;
  return (
    <RPopover.Root>
      <RPopover.Trigger asChild>
        <button type="button" className={cx("ui-input ui-color-trigger", className)} aria-label={`${label}: ${color}`}>
          <span className="ui-color-preview" style={{ background: color }} aria-hidden="true" />
          <span className="ui-mono">{color}</span>
          <ChevronDown size={15} className="ui-select-icon" aria-hidden="true" />
        </button>
      </RPopover.Trigger>
      <RPopover.Portal container={container}>
        <RPopover.Content className="ui-popover ui-color-pop" align="start" sideOffset={6}>
          {panel}
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

export interface HotkeyInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (keys: string[]) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

const KEY_NAMES: Record<string, string> = { Meta: "⌘", Control: "Ctrl", Alt: "Alt", Shift: "Shift", " ": "Space", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", Escape: "Esc" };

/** Focus and press a combination to record a shortcut. Backspace clears. */
export function HotkeyInput({ value, defaultValue = [], onValueChange, placeholder = "Press a shortcut", className, ...props }: HotkeyInputProps) {
  const [keys, setKeys] = useControllable(value, defaultValue, onValueChange);
  const [recording, setRecording] = useState(false);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Tab") return;
    e.preventDefault();
    if ((e.key === "Backspace" || e.key === "Delete") && !e.metaKey && !e.ctrlKey) return setKeys([]);
    if (["Meta", "Control", "Alt", "Shift"].includes(e.key)) return;
    const combo = [e.metaKey && "Meta", e.ctrlKey && "Control", e.altKey && "Alt", e.shiftKey && "Shift"].filter(Boolean) as string[];
    combo.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
    setKeys(combo.map((k) => KEY_NAMES[k] ?? k));
  };
  return (
    <button
      type="button"
      className={cx("ui-input ui-hotkey", recording && "is-recording", className)}
      onFocus={() => setRecording(true)}
      onBlur={() => setRecording(false)}
      onKeyDown={onKey}
      aria-label={props["aria-label"] ?? "Shortcut"}
      aria-description="Press a key combination. Backspace clears."
    >
      {keys.length ? (
        <span className="ui-kbd-group">{keys.map((k) => <kbd key={k} className="ui-kbd">{k}</kbd>)}</span>
      ) : (
        <span className="ui-placeholder">{recording ? "Listening…" : placeholder}</span>
      )}
    </button>
  );
}
