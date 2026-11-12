import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Toast as RToast } from "radix-ui";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cx } from "../lib/utils";

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

const toneIcon: Record<Tone, ReactNode> = {
  neutral: <Info size={16} />,
  accent: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <XCircle size={16} />,
};

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  /** Announced to assistive technology */
  label?: string;
}

export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cx("ui-spinner", `is-${size}`, className)} {...props}>
      <span className="ui-spinner-ring" aria-hidden="true" />
      <span className="ui-sr-only">{label}</span>
    </span>
  );
}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–max; omit for indeterminate */
  value?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  tone?: Tone;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue,
  tone = "accent",
  size = "md",
  className,
  ...props
}: ProgressBarProps) {
  const pct = value === undefined ? undefined : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cx("ui-progress", `is-${tone}`, `is-${size}`, className)} {...props}>
      {(label || showValue) && (
        <div className="ui-progress-head">
          {label && <span className="ui-progress-label">{label}</span>}
          {showValue && pct !== undefined && (
            <span className="ui-progress-value">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div
        className={cx("ui-progress-track", pct === undefined && "is-indeterminate")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={typeof label === "string" ? label : "Progress"}
      >
        <div className="ui-progress-fill" style={pct === undefined ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  label?: string;
  tone?: Tone;
  /** Content in the middle; defaults to the percentage */
  children?: ReactNode;
}

/** Circular progress, e.g. download or achievement completion. */
export function ProgressRing({
  value,
  max = 100,
  size = 64,
  thickness = 6,
  label = "Progress",
  tone = "accent",
  className,
  children,
  ...props
}: ProgressRingProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cx("ui-ring", `is-${tone}`, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle className="ui-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} />
        <circle
          className="ui-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </svg>
      <span className="ui-ring-center">{children ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}

export interface MeterProps extends HTMLAttributes<HTMLDivElement> {
  segments: { value: number; label: string; tone?: Tone }[];
  max: number;
  label?: ReactNode;
}

/** Stacked usage bar (e.g. disk space by category) with a legend. */
export function Meter({ segments, max, label, className, ...props }: MeterProps) {
  return (
    <div className={cx("ui-meter", className)} {...props}>
      {label && <div className="ui-progress-label">{label}</div>}
      <div className="ui-meter-track" role="img" aria-label={segments.map((s) => `${s.label} ${s.value}`).join(", ")}>
        {segments.map((s) => (
          <span key={s.label} className={cx("ui-meter-seg", `is-${s.tone ?? "accent"}`)} style={{ width: `${(s.value / max) * 100}%` }} />
        ))}
      </div>
      <ul className="ui-meter-legend">
        {segments.map((s) => (
          <li key={s.label}>
            <span className={cx("ui-dot", `is-${s.tone ?? "accent"}`)} aria-hidden="true" />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  shape?: "line" | "rect" | "circle";
  lines?: number;
}

export function Skeleton({ width, height, shape = "line", lines, className, style, ...props }: SkeletonProps) {
  if (lines && lines > 1)
    return (
      <span className={cx("ui-skeleton-lines", className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="ui-skeleton is-line" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
        ))}
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={cx("ui-skeleton", `is-${shape}`, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: "soft" | "solid" | "outline";
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", variant = "soft", icon, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cx("ui-badge", `is-${tone}`, `is-${variant}`, className)} {...props}>
      {icon}
      {children}
    </span>
  );
});

export type Status = "online" | "away" | "busy" | "offline" | "playing";

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  status: Status;
  label?: ReactNode;
  pulse?: boolean;
}

export function StatusIndicator({ status, label, pulse, className, ...props }: StatusIndicatorProps) {
  const text = label ?? status[0].toUpperCase() + status.slice(1);
  return (
    <span className={cx("ui-status", `is-${status}`, pulse && "is-pulse", className)} {...props}>
      <span className="ui-status-dot" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: Tone;
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  onDismiss?: () => void;
}

export function Alert({ tone = "neutral", title, icon, action, onDismiss, className, children, ...props }: AlertProps) {
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cx("ui-alert", `is-${tone}`, className)} {...props}>
      {icon !== false && <span className="ui-alert-icon">{icon ?? toneIcon[tone]}</span>}
      <div className="ui-alert-body">
        {title && <p className="ui-alert-title">{title}</p>}
        {children && <div className="ui-alert-text">{children}</div>}
      </div>
      {action && <div className="ui-alert-action">{action}</div>}
      {onDismiss && (
        <button type="button" className="ui-close" aria-label="Dismiss" onClick={onDismiss}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  action?: ReactNode;
  onDismiss?: () => void;
}

/** Full-width strip for app-level notices (maintenance, update ready). */
export function Banner({ tone = "accent", action, onDismiss, className, children, ...props }: BannerProps) {
  return (
    <div role="status" className={cx("ui-banner", `is-${tone}`, className)} {...props}>
      <span className="ui-banner-text">{children}</span>
      {action}
      {onDismiss && (
        <button type="button" className="ui-close" aria-label="Dismiss" onClick={onDismiss}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* ---------- Toasts ---------- */

export interface ToastProps {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  action?: { label: string; onClick: () => void };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** ms; Infinity keeps it open */
  duration?: number;
}

/** A single toast. Needs a ToastProvider and ToastViewport (or use Toaster). */
export function Toast({ title, description, tone = "neutral", action, open, onOpenChange, duration }: ToastProps) {
  return (
    <RToast.Root className={cx("ui-toast", `is-${tone}`)} open={open} onOpenChange={onOpenChange} duration={duration}>
      <span className="ui-alert-icon">{toneIcon[tone]}</span>
      <div className="ui-alert-body">
        <RToast.Title className="ui-alert-title">{title}</RToast.Title>
        {description && <RToast.Description className="ui-alert-text">{description}</RToast.Description>}
      </div>
      {action && (
        <RToast.Action asChild altText={action.label}>
          <button type="button" className="ui-btn is-ghost is-sm" onClick={action.onClick}>
            {action.label}
          </button>
        </RToast.Action>
      )}
      <RToast.Close className="ui-close" aria-label="Close">
        <X size={14} />
      </RToast.Close>
    </RToast.Root>
  );
}

export const ToastProvider = RToast.Provider;

export function ToastViewport({ className, ...props }: React.ComponentProps<typeof RToast.Viewport>) {
  return <RToast.Viewport className={cx("ui-toast-viewport", className)} {...props} />;
}

type QueuedToast = Omit<ToastProps, "open" | "onOpenChange"> & { id: number };
const ToasterContext = createContext<((t: Omit<QueuedToast, "id">) => void) | null>(null);

/** Provider + viewport + queue. Call useToast() anywhere inside. */
export function Toaster({ children, duration = 5000 }: { children: ReactNode; duration?: number }) {
  const [items, setItems] = useState<QueuedToast[]>([]);
  const push = useCallback((t: Omit<QueuedToast, "id">) => {
    setItems((list) => [...list, { ...t, id: Date.now() + Math.random() }]);
  }, []);
  return (
    <ToasterContext.Provider value={push}>
      <RToast.Provider duration={duration}>
        {children}
        {items.map(({ id, ...t }) => (
          <Toast key={id} {...t} onOpenChange={(o) => !o && setItems((l) => l.filter((x) => x.id !== id))} />
        ))}
        <ToastViewport />
      </RToast.Provider>
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const push = useContext(ToasterContext);
  if (!push) throw new Error("useToast must be used inside <Toaster>");
  return push;
}
