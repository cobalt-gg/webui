import type { CSSProperties, HTMLAttributes } from "react";
import { cx } from "./actions";
export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "start" | "center" | "end" | "stretch";
}
function layoutStyle(
  gap: LayoutProps["gap"],
  align: LayoutProps["align"],
  style?: CSSProperties,
): CSSProperties {
  return {
    gap: gap ? `var(--ui-space-${gap})` : undefined,
    alignItems: align,
    ...style,
  };
}
export function Stack({ gap, align, className, style, ...props }: LayoutProps) {
  return (
    <div
      className={cx("ui-stack", className)}
      style={layoutStyle(gap, align, style)}
      {...props}
    />
  );
}
export function Inline({
  gap,
  align,
  className,
  style,
  ...props
}: LayoutProps) {
  return (
    <div
      className={cx("ui-inline", className)}
      style={layoutStyle(gap, align, style)}
      {...props}
    />
  );
}
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-container", className)} {...props} />;
}
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-panel", className)} {...props} />;
}
export function SplitView({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ui-split", className)} {...props} />;
}
