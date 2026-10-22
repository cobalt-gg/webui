import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { LoaderCircle } from "lucide-react";
import { Toggle as RToggle, Switch as RSwitch, ToggleGroup } from "radix-ui";
export type Size = "sm" | "md" | "lg";
export type Tone = "neutral" | "success" | "warning" | "danger";
export const cx = (...values: (string | undefined | false)[]) =>
  values.filter(Boolean).join(" ");
function isDisabled(el: HTMLElement) {
  const own = ":disabled, [data-disabled], [aria-disabled='true']";
  try {
    return el.matches(`${own}, :has(> input:disabled)`);
  } catch {
    return el.matches(own);
  }
}
/**
 * Starts a click ripple from the pointer position. Pair it with an element
 * that has the ui-ripple styles (any interactive ui- control).
 */
export function ripple(event: React.PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  if (event.button > 0 || isDisabled(el)) return;
  const box = el.getBoundingClientRect();
  el.style.setProperty("--ui-ripple-x", `${event.clientX - box.left}px`);
  el.style.setProperty("--ui-ripple-y", `${event.clientY - box.top}px`);
  el.style.setProperty(
    "--ui-ripple-size",
    `${Math.hypot(box.width, box.height) * 2}px`,
  );
  el.removeAttribute("data-ripple");
  void el.offsetWidth; // restart the animation on repeated clicks
  el.setAttribute("data-ripple", "");
}
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      className,
      type = "button",
      loading = false,
      loadingLabel,
      disabled,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cx("ui-button", className)}
        data-variant={variant}
        data-size={size}
        {...props}
        onPointerDown={(e) => {
          ripple(e);
          props.onPointerDown?.(e);
        }}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {loading && (
          <LoaderCircle
            size={15}
            className="ui-button-spinner"
            aria-hidden="true"
          />
        )}
        {loading && loadingLabel ? loadingLabel : children}
      </button>
    );
  },
);
export interface IconButtonProps extends ButtonProps {
  "aria-label": string;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        className={cx("ui-icon-button", className)}
        {...props}
      />
    );
  },
);
export function ButtonGroup({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="group" className={cx("ui-button-group", className)} {...props} />
  );
}
export function Toggle({
  className,
  onPointerDown,
  ...props
}: React.ComponentPropsWithoutRef<typeof RToggle.Root>) {
  return (
    <RToggle.Root
      className={cx("ui-toggle", className)}
      onPointerDown={(e) => {
        ripple(e);
        onPointerDown?.(e);
      }}
      {...props}
    />
  );
}
export interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof RSwitch.Root
> {
  label: string;
}
export function Switch({ label, className, ...props }: SwitchProps) {
  return (
    <label className={cx("ui-choice", className)}>
      <RSwitch.Root className="ui-switch" {...props}>
        <RSwitch.Thumb className="ui-switch-thumb" />
      </RSwitch.Root>
      {label}
    </label>
  );
}
export interface SegmentedControlProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ToggleGroup.Root>,
  "type" | "onValueChange" | "defaultValue" | "value"
> {
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  "aria-label": string;
}
export function SegmentedControl({
  options,
  className,
  ...props
}: SegmentedControlProps) {
  return (
    <ToggleGroup.Root
      type="single"
      className={cx("ui-segmented", className)}
      {...props}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          className="ui-segment"
          onPointerDown={ripple}
          key={o.value}
          value={o.value}
          disabled={o.disabled}
        >
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
