import type { HTMLAttributes } from "react";
import { Toast as RToast } from "radix-ui";
import { Button, cx, type Tone, type Size } from "./actions";
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}
export function Alert({
  tone = "neutral",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cx("ui-alert", className)}
      data-tone={tone}
      {...props}
    >
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
}
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  size?: Size;
}
export function Badge({
  tone = "neutral",
  size = "md",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cx("ui-badge", className)}
      data-tone={tone}
      data-size={size}
      {...props}
    />
  );
}
export function StatusIndicator({
  tone = "success",
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span className={cx("ui-status", className)} data-tone={tone} {...props}>
      <span aria-hidden="true" className="ui-status-dot" />
      {children}
    </span>
  );
}
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label: string;
}
export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.max(0, Math.min(safeMax, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      className={cx("ui-progress", className)}
      {...props}
    >
      <span style={{ width: `${(safeValue / safeMax) * 100}%` }} />
    </div>
  );
}
export function Spinner({
  className,
  "aria-label": label = "Loading",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cx("ui-spinner", className)}
      {...props}
    />
  );
}
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cx("ui-skeleton", className)}
      {...props}
    />
  );
}
export interface ToastProps extends React.ComponentPropsWithoutRef<
  typeof RToast.Root
> {
  title: string;
  description?: string;
  className?: string;
}
/** Mount one provider per application and one viewport inside it. */
export const ToastProvider = RToast.Provider;
export function ToastViewport(
  props: React.ComponentPropsWithoutRef<typeof RToast.Viewport>,
) {
  return (
    <RToast.Viewport
      {...props}
      className={cx("ui-toast-viewport", props.className)}
    />
  );
}
export function Toast({ title, description, className, ...props }: ToastProps) {
  return (
    <RToast.Root className={cx("ui-toast", className)} {...props}>
      <RToast.Title>
        <strong>{title}</strong>
      </RToast.Title>
      {description && <RToast.Description>{description}</RToast.Description>}
      <RToast.Close asChild>
        <Button variant="ghost" size="sm" aria-label="Dismiss notification">
          Dismiss
        </Button>
      </RToast.Close>
    </RToast.Root>
  );
}
