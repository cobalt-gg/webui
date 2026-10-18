import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { Toggle as RToggle, Switch as RSwitch, ToggleGroup } from "radix-ui";
export type Size = "sm" | "md" | "lg";
export type Tone = "neutral" | "success" | "warning" | "danger";
export const cx = (...values: (string | undefined | false)[]) =>
  values.filter(Boolean).join(" ");
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: Size;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, type = "button", ...props },
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
      />
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
  ...props
}: React.ComponentPropsWithoutRef<typeof RToggle.Root>) {
  return <RToggle.Root className={cx("ui-toggle", className)} {...props} />;
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
