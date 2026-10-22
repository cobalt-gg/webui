import {
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
import { Accordion as RAccordion } from "radix-ui";
import {
  Check,
  ChevronDown,
  Upload,
  X,
  File as FileIcon,
  CheckCircle2,
} from "lucide-react";
import { cx, Button, IconButton, ripple } from "./actions";

export interface FieldBinding {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
}
export interface FormFieldProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: FieldBinding) => ReactNode;
  controlId?: string;
}
export function FormField({
  label,
  hint,
  error,
  required,
  children,
  controlId,
  className,
  ...props
}: FormFieldProps) {
  const generated = useId();
  const id = controlId ?? generated;
  const description =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={cx("ui-form-field", className)} {...props}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children({
        id,
        "aria-describedby": description,
        "aria-invalid": !!error || undefined,
        required,
      })}
      {hint && (
        <p id={`${id}-hint`} className="ui-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="ui-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  leading?: ReactNode;
  trailing?: ReactNode;
}
export function InputGroup({
  leading,
  trailing,
  children,
  className,
  ...props
}: InputGroupProps) {
  return (
    <div className={cx("ui-input-group", className)} {...props}>
      {leading && <span className="ui-input-adornment">{leading}</span>}
      {children}
      {trailing && <span className="ui-input-adornment">{trailing}</span>}
    </div>
  );
}
export interface SettingsRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: ReactNode;
  control: ReactNode;
}
export function SettingsRow({
  title,
  description,
  icon,
  control,
  className,
  ...props
}: SettingsRowProps) {
  return (
    <div className={cx("ui-settings-row", className)} {...props}>
      {icon && (
        <span className="ui-setting-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="ui-setting-body">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div className="ui-setting-control">{control}</div>
    </div>
  );
}
export interface AccordionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RAccordion.Root>,
  "type" | "value" | "defaultValue" | "onValueChange"
> {
  items: {
    value: string;
    title: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export function Accordion({ items, className, ...props }: AccordionProps) {
  return (
    <RAccordion.Root
      type="single"
      collapsible
      className={cx("ui-accordion", className)}
      {...props}
    >
      {items.map((item) => (
        <RAccordion.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className="ui-accordion-item"
        >
          <RAccordion.Header>
            <RAccordion.Trigger
              className="ui-accordion-trigger"
              onPointerDown={ripple}
            >
              {item.title}
              <ChevronDown size={16} aria-hidden="true" />
            </RAccordion.Trigger>
          </RAccordion.Header>
          <RAccordion.Content className="ui-accordion-content">
            <div>{item.content}</div>
          </RAccordion.Content>
        </RAccordion.Item>
      ))}
    </RAccordion.Root>
  );
}
export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: string[];
  currentStep: number;
  label: string;
}
export function Stepper({
  steps,
  currentStep,
  label,
  className,
  ...props
}: StepperProps) {
  return (
    <ol aria-label={label} className={cx("ui-stepper", className)} {...props}>
      {steps.map((step, i) => (
        <li
          key={i}
          aria-current={i === currentStep ? "step" : undefined}
          data-complete={i < currentStep || undefined}
        >
          <span className="ui-step-number" aria-hidden="true">
            {i < currentStep ? <Check size={13} /> : i + 1}
          </span>
          <span>{step}</span>
          {i < currentStep && <span className="ui-sr-only">completed</span>}
        </li>
      ))}
    </ol>
  );
}
export interface OptionCardProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "title"
> {
  title: string;
  description: string;
  icon?: ReactNode;
}
export function OptionCard({
  title,
  description,
  icon,
  className,
  ...props
}: OptionCardProps) {
  return (
    <label className={cx("ui-option-card", className)} onPointerDown={ripple}>
      <input {...props} type="radio" />
      <span className="ui-option-mark" aria-hidden="true">
        <CheckCircle2 size={18} />
      </span>
      {icon && <span aria-hidden="true">{icon}</span>}
      <strong>{title}</strong>
      <span>{description}</span>
    </label>
  );
}
export interface FileUploadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label: string;
  description?: string;
  accept?: string;
  maxBytes?: number;
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
}
export function FileUpload({
  label,
  description = "Choose a file or drop it here.",
  accept,
  maxBytes = 5 * 1024 * 1024,
  onFilesChange,
  disabled,
  className,
  ...props
}: FileUploadProps) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const id = useId();
  function choose(list: FileList | null) {
    if (disabled || !list) return;
    const next = Array.from(list);
    if (next.some((f) => f.size > maxBytes)) {
      setError(
        `Choose files smaller than ${maxBytes >= 1048576 ? `${Math.round(maxBytes / 1048576)} MB` : maxBytes >= 1024 ? `${Math.round(maxBytes / 1024)} KB` : `${maxBytes} bytes`}.`,
      );
      return;
    }
    if (
      accept &&
      next.some(
        (f) =>
          !accept.split(",").some((rule) => {
            const r = rule.trim().toLowerCase();
            return r.startsWith(".")
              ? f.name.toLowerCase().endsWith(r)
              : r.endsWith("/*")
                ? f.type.startsWith(r.slice(0, -1))
                : f.type === r;
          }),
      )
    ) {
      setError("Choose a supported file type.");
      return;
    }
    setError("");
    setFiles(next);
    onFilesChange?.(next);
  }
  return (
    <div className={cx("ui-file-upload", className)} {...props}>
      <div
        className="ui-dropzone"
        data-dragging={drag || undefined}
        data-disabled={disabled || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          choose(e.dataTransfer.files);
        }}
      >
        <Upload size={22} aria-hidden="true" />
        <label htmlFor={id}>{label}</label>
        <p>{description}</p>
        <input
          id={id}
          ref={input}
          type="file"
          accept={accept}
          multiple
          disabled={disabled}
          onChange={(e) => choose(e.target.files)}
        />
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          Browse files
        </Button>
      </div>
      {error && (
        <p role="alert" className="ui-field-error">
          {error}
        </p>
      )}
      <ul className="ui-upload-files">
        {files.map((f, i) => (
          <li key={f.name + i}>
            <FileIcon size={15} aria-hidden="true" />
            <span>{f.name}</span>
            <span>{Math.ceil(f.size / 1024)} KB</span>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={`Remove ${f.name}`}
              disabled={disabled}
              onClick={() => {
                const next = files.filter((_, n) => n !== i);
                setFiles(next);
                if (input.current) input.current.value = "";
                onFilesChange?.(next);
              }}
            >
              <X size={14} />
            </IconButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
}
export function StatCard({
  label,
  value,
  detail,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <div className={cx("ui-stat-card", className)} {...props}>
      <div>
        <span>{label}</span>
        {icon && <span aria-hidden="true">{icon}</span>}
      </div>
      <strong>{value}</strong>
      {detail && <p>{detail}</p>}
    </div>
  );
}
export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}
export function FeatureCard({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div className={cx("ui-feature-card", className)} {...props}>
      {icon && (
        <span className="ui-feature-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar: ReactNode;
  header?: ReactNode;
  sidebarLabel?: string;
}
export function AppShell({
  sidebar,
  header,
  children,
  sidebarLabel = "Application navigation",
  className,
  ...props
}: AppShellProps) {
  return (
    <div className={cx("ui-app-shell", className)} {...props}>
      <nav aria-label={sidebarLabel} className="ui-app-sidebar">
        {sidebar}
      </nav>
      <div className="ui-app-body">
        {header && <div className="ui-app-header">{header}</div>}
        <div className="ui-app-content">{children}</div>
      </div>
    </div>
  );
}
export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cx("ui-page-header", className)} {...props}>
      <div>
        {eyebrow && <span className="ui-page-eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="ui-inline">{actions}</div>}
    </div>
  );
}
export interface AuthPanelProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: ReactNode;
  footer?: ReactNode;
}
export function AuthPanel({
  title,
  description,
  icon,
  footer,
  children,
  className,
  ...props
}: AuthPanelProps) {
  return (
    <div className={cx("ui-auth-panel", className)} {...props}>
      {icon && (
        <span className="ui-auth-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="ui-stack">{children}</div>
      {footer && <div className="ui-auth-footer">{footer}</div>}
    </div>
  );
}
