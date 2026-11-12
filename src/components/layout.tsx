import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { AspectRatio as RAspect, ScrollArea as RScroll } from "radix-ui";
import { cx } from "../lib/utils";

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
const gapVar = (g: Space) => (g === 0 ? "0" : `var(--ui-space-${g})`);

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch";
  as?: "div" | "section" | "ul" | "ol" | "form";
}

/** Vertical flow with consistent gaps. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack({ gap = 4, align = "stretch", as: Tag = "div", className, style, ...props }, ref) {
  return <Tag ref={ref as never} className={cx("ui-stack", className)} style={{ gap: gapVar(gap), alignItems: align, ...style }} {...(props as object)} />;
});

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Space;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

/** Horizontal row that wraps by default. */
export const Inline = forwardRef<HTMLDivElement, InlineProps>(function Inline({ gap = 2, align = "center", justify = "start", wrap = true, className, style, ...props }, ref) {
  const j = justify === "between" ? "space-between" : justify === "start" ? "flex-start" : justify === "end" ? "flex-end" : "center";
  return <div ref={ref} className={cx("ui-inline", className)} style={{ gap: gapVar(gap), alignItems: align === "start" ? "flex-start" : align === "end" ? "flex-end" : align, justifyContent: j, flexWrap: wrap ? "wrap" : "nowrap", ...style }} {...props} />;
});

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed column count, or a min tile width for auto-fill */
  columns?: number;
  minItemWidth?: string;
  gap?: Space;
}

export function Grid({ columns, minItemWidth = "220px", gap = 4, className, style, ...props }: GridProps) {
  const template = columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(${minItemWidth}, 100%), 1fr))`;
  return <div className={cx("ui-grid", className)} style={{ gridTemplateColumns: template, gap: gapVar(gap), ...style }} {...props} />;
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

export function Container({ size = "lg", className, ...props }: ContainerProps) {
  return <div className={cx("ui-container", `is-${size}`, className)} {...props} />;
}

export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

/** Titled section box used in settings and dashboards. */
export function Panel({ title, description, actions, className, children, ...props }: PanelProps) {
  return (
    <section className={cx("ui-panel", className)} {...props}>
      {(title || actions) && (
        <header className="ui-panel-head">
          <div>
            {title && <h2 className="ui-panel-title">{title}</h2>}
            {description && <p className="ui-hint">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="ui-panel-body">{children}</div>
    </section>
  );
}

export interface SplitViewProps extends HTMLAttributes<HTMLDivElement> {
  aside: ReactNode;
  /** Width of the aside column */
  asideWidth?: string;
  asideSide?: "start" | "end";
}

/** Two columns that stack below 640px. */
export function SplitView({ aside, asideWidth = "280px", asideSide = "start", className, children, style, ...props }: SplitViewProps) {
  return (
    <div className={cx("ui-split-view", asideSide === "end" && "is-end", className)} style={{ "--ui-aside": asideWidth, ...style } as CSSProperties} {...props}>
      <div className="ui-split-aside">{aside}</div>
      <div className="ui-split-main">{children}</div>
    </div>
  );
}

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  htmlFor?: string;
}

/** Label + description on the left, control on the right. */
export function SettingsRow({ title, description, control, htmlFor, className, ...props }: SettingsRowProps) {
  return (
    <div className={cx("ui-settings-row", className)} {...props}>
      <div className="ui-settings-text">
        {htmlFor ? <label htmlFor={htmlFor} className="ui-list-title">{title}</label> : <span className="ui-list-title">{title}</span>}
        {description && <span className="ui-hint">{description}</span>}
      </div>
      <div className="ui-settings-control">{control}</div>
    </div>
  );
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: ReactNode;
  header?: ReactNode;
  /** Right-hand panel (friends, activity) */
  aside?: ReactNode;
  sidebarLabel?: string;
  asideLabel?: string;
  /** Fill the viewport (100dvh) rather than the parent */
  fullHeight?: boolean;
}

/** Sidebar + header + content (+ optional aside) frame for apps. */
export function AppShell({ sidebar, header, aside, sidebarLabel = "Sidebar", asideLabel = "Details", fullHeight, className, children, ...props }: AppShellProps) {
  return (
    <div className={cx("ui-shell", fullHeight && "is-full", aside && "has-aside", className)} {...props}>
      {sidebar && <nav className="ui-shell-sidebar" aria-label={sidebarLabel}>{sidebar}</nav>}
      <div className="ui-shell-main">
        {header && <header className="ui-shell-header">{header}</header>}
        <main className="ui-shell-content">{children}</main>
      </div>
      {aside && <aside className="ui-shell-aside" aria-label={asideLabel}>{aside}</aside>}
    </div>
  );
}

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  /** Heading level for the title (default 1) */
  headingLevel?: 1 | 2 | 3 | 4;
}

export function PageHeader({ title, description, eyebrow, actions, breadcrumbs, headingLevel = 1, className, ...props }: PageHeaderProps) {
  const H = `h${headingLevel}` as "h1";
  return (
    <header className={cx("ui-page-header", className)} {...props}>
      {breadcrumbs}
      <div className="ui-page-header-row">
        <div>
          {eyebrow && <p className="ui-eyebrow">{eyebrow}</p>}
          <H className="ui-page-title">{title}</H>
          {description && <p className="ui-page-desc">{description}</p>}
        </div>
        {actions && <div className="ui-page-actions">{actions}</div>}
      </div>
    </header>
  );
}

export interface AuthPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  logo?: ReactNode;
  footer?: ReactNode;
  /** Heading level for the title (default 1) */
  headingLevel?: 1 | 2 | 3 | 4;
}

/** Centred card for sign-in, sign-up and verification screens. */
export function AuthPanel({ title, description, logo, footer, headingLevel = 1, className, children, ...props }: AuthPanelProps) {
  const H = `h${headingLevel}` as "h1";
  return (
    <div className={cx("ui-auth", className)} {...props}>
      {logo && <div className="ui-auth-logo">{logo}</div>}
      <H className="ui-auth-title">{title}</H>
      {description && <p className="ui-page-desc">{description}</p>}
      <div className="ui-auth-body">{children}</div>
      {footer && <div className="ui-auth-foot">{footer}</div>}
    </div>
  );
}

export function AspectRatio({ ratio = 16 / 9, className, children }: { ratio?: number; className?: string; children: ReactNode }) {
  return (
    <RAspect.Root ratio={ratio} className={cx("ui-aspect", className)}>
      {children}
    </RAspect.Root>
  );
}

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  maxHeight?: number | string;
}

/** Scroll container with thin overlay scrollbars that match the theme. */
export function ScrollArea({ maxHeight = 240, className, children, ...props }: ScrollAreaProps) {
  return (
    <RScroll.Root className={cx("ui-scroll", className)} {...props}>
      <RScroll.Viewport className="ui-scroll-viewport" style={{ maxHeight }} tabIndex={0}>
        {children}
      </RScroll.Viewport>
      <RScroll.Scrollbar orientation="vertical" className="ui-scrollbar">
        <RScroll.Thumb className="ui-scroll-thumb" />
      </RScroll.Scrollbar>
    </RScroll.Root>
  );
}

export function VisuallyHidden({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("ui-sr-only", className)} {...props} />;
}
