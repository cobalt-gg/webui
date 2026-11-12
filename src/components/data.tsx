import { forwardRef, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Accordion as RAccordion, Avatar as RAvatar } from "radix-ui";
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, Download, Laptop, Monitor, Smartphone, TrendingDown, TrendingUp } from "lucide-react";
import { cx, ripple } from "../lib/utils";
import { CopyButton } from "./actions";
import { Badge } from "./feedback";
import { Checkbox } from "./inputs";

/* ---------- Card ---------- */

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  variant?: "default" | "sunken" | "outline" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, description, action, footer, media, variant = "default", padding = "md", className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cx("ui-card", `is-${variant}`, `is-pad-${padding}`, className)} {...props}>
      {media && <div className="ui-card-media">{media}</div>}
      {(title || action) && (
        <div className="ui-card-head">
          <div>
            {title && <h3 className="ui-card-title">{title}</h3>}
            {description && <p className="ui-card-desc">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children && <div className="ui-card-body">{children}</div>}
      {footer && <div className="ui-card-foot">{footer}</div>}
    </div>
  );
});

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Makes the row a button */
  onSelect?: () => void;
  selected?: boolean;
}

export function ListItem({ title, description, leading, trailing, onSelect, selected, className, ...props }: ListItemProps) {
  const content = (
    <>
      {leading && <span className="ui-list-leading">{leading}</span>}
      <span className="ui-list-text">
        <span className="ui-list-title">{title}</span>
        {description && <span className="ui-hint">{description}</span>}
      </span>
      {trailing && <span className="ui-list-trailing">{trailing}</span>}
    </>
  );
  if (onSelect)
    return (
      <div className={cx("ui-list-item-wrap", className)} {...props}>
        <button type="button" className={cx("ui-list-item is-interactive ui-rippled", selected && "is-selected")} aria-pressed={selected} onClick={(e) => (ripple(e), onSelect())}>
          {content}
        </button>
      </div>
    );
  return <div className={cx("ui-list-item", className)} {...props}>{content}</div>;
}

/* ---------- Avatar ---------- */

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  /** Initials; derived from alt when omitted */
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "away" | "busy" | "offline" | "playing";
  shape?: "circle" | "square";
}

export function Avatar({ src, alt, fallback, size = "md", status, shape = "circle", className, ...props }: AvatarProps) {
  const initials = fallback ?? alt.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className={cx("ui-avatar", `is-${size}`, `is-${shape}`, className)} {...props}>
      <RAvatar.Root className="ui-avatar-inner">
        {src && <RAvatar.Image src={src} alt={alt} className="ui-avatar-img" />}
        <RAvatar.Fallback className="ui-avatar-fallback" aria-label={alt} delayMs={src ? 300 : 0}>{initials}</RAvatar.Fallback>
      </RAvatar.Root>
      {status && <span className={cx("ui-avatar-status", `is-${status}`)} role="img" aria-label={status} />}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  people: { name: string; src?: string }[];
  max?: number;
  size?: AvatarProps["size"];
}

/** Overlapping stack of avatars with a "+n" overflow. */
export function AvatarGroup({ people, max = 4, size = "sm", className, ...props }: AvatarGroupProps) {
  const rest = people.length - max;
  return (
    <div className={cx("ui-avatar-group", className)} role="group" aria-label={`${people.length} people`} {...props}>
      {people.slice(0, max).map((p) => <Avatar key={p.name} alt={p.name} src={p.src} size={size} />)}
      {rest > 0 && <span className={cx("ui-avatar", `is-${size}`, "is-circle ui-avatar-more")} aria-label={`${rest} more`}>+{rest}</span>}
    </div>
  );
}

/* ---------- Table ---------- */

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Return a comparable value to make the column sortable */
  sortValue?: (row: T) => string | number;
  align?: "start" | "end" | "center";
  width?: number | string;
}

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLTableElement>, "children"> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption?: ReactNode;
  /** Adds a checkbox column */
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  empty?: ReactNode;
  density?: "compact" | "comfortable";
}

/** Data table with optional sorting and row selection. */
export function Table<T>({ columns, rows, rowKey, caption, selectable, selected = [], onSelectedChange, empty, density = "comfortable", className, ...props }: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort?.key);
    if (!col?.sortValue || !sort) return rows;
    return [...rows].sort((a, b) => {
      const x = col.sortValue!(a), y = col.sortValue!(b);
      return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
    });
  }, [rows, columns, sort]);
  const allKeys = rows.map(rowKey);
  const all = selectable && allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
  const some = selected.length > 0 && !all;
  return (
    <div className={cx("ui-table-wrap", className)}>
      <table className={cx("ui-table", `is-${density}`)} {...props}>
        {caption && <caption className="ui-table-caption">{caption}</caption>}
        <thead>
          <tr>
            {selectable && (
              <th className="ui-table-check">
                <Checkbox aria-label="Select all rows" checked={all ? true : some ? "indeterminate" : false} onCheckedChange={(c) => onSelectedChange?.(c ? allKeys : [])} />
              </th>
            )}
            {columns.map((c) => {
              const dir = sort?.key === c.key ? sort.dir : 0;
              return (
                <th key={c.key} style={{ width: c.width, textAlign: c.align === "end" ? "right" : c.align }} aria-sort={dir === 1 ? "ascending" : dir === -1 ? "descending" : c.sortValue ? "none" : undefined}>
                  {c.sortValue ? (
                    <button type="button" className="ui-th-sort" onClick={() => setSort(dir === 1 ? { key: c.key, dir: -1 } : dir === -1 ? null : { key: c.key, dir: 1 })}>
                      {c.header}
                      <span className={cx("ui-sort-icon", dir !== 0 && "is-on")} aria-hidden="true">{dir === -1 ? <ArrowDown size={12} /> : <ArrowUp size={12} />}</span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr><td colSpan={columns.length + (selectable ? 1 : 0)} className="ui-table-empty">{empty ?? "No rows"}</td></tr>
          )}
          {sorted.map((r) => {
            const k = rowKey(r);
            const isSel = selected.includes(k);
            return (
              <tr key={k} className={cx(isSel && "is-selected")} aria-selected={selectable ? isSel : undefined}>
                {selectable && (
                  <td className="ui-table-check">
                    <Checkbox aria-label={`Select row ${k}`} checked={isSel} onCheckedChange={(c) => onSelectedChange?.(c ? [...selected, k] : selected.filter((s) => s !== k))} />
                  </td>
                )}
                {columns.map((c) => <td key={c.key} style={{ textAlign: c.align === "end" ? "right" : c.align }}>{c.cell(r)}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Simple display ---------- */

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div className={cx("ui-empty", className)} {...props}>
      {icon && <span className="ui-empty-icon">{icon}</span>}
      <p className="ui-empty-title">{title}</p>
      {description && <p className="ui-hint">{description}</p>}
      {action && <div className="ui-empty-action">{action}</div>}
    </div>
  );
}

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ label, orientation = "horizontal", className, ...props }: DividerProps) {
  if (orientation === "vertical") return <span role="separator" aria-orientation="vertical" className={cx("ui-divider is-vertical", className)} {...props} />;
  if (!label) return <hr className={cx("ui-divider", className)} {...(props as HTMLAttributes<HTMLHRElement>)} />;
  return (
    <div role="separator" className={cx("ui-divider-label", className)} {...props}>
      <span>{label}</span>
    </div>
  );
}

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
  icon?: ReactNode;
}

/** Small neutral label (genre, platform). Removable when onRemove is set. */
export function Tag({ onRemove, icon, className, children, ...props }: TagProps) {
  return (
    <span className={cx("ui-tag", className)} {...props}>
      {icon}
      {children}
      {onRemove && <button type="button" aria-label={`Remove ${typeof children === "string" ? children : "tag"}`} onClick={onRemove}>×</button>}
    </span>
  );
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  code: string;
  language?: string;
  title?: ReactNode;
  copyable?: boolean;
  lineNumbers?: boolean;
}

export function CodeBlock({ code, language, title, copyable = true, lineNumbers, className, ...props }: CodeBlockProps) {
  return (
    <div className={cx("ui-code", className)} {...props}>
      {(title || language || copyable) && (
        <div className="ui-code-head">
          <span className="ui-code-title">{title ?? language}</span>
          {copyable && <CopyButton value={code} variant="ghost" />}
        </div>
      )}
      <pre className={cx(lineNumbers && "has-lines")}>
        <code>
          {lineNumbers
            ? code.split("\n").map((l, i) => <span key={i} className="ui-code-line">{l || " "}{"\n"}</span>)
            : code}
        </code>
      </pre>
    </div>
  );
}

export interface CopyFieldProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  label?: string;
  /** Mask the value until revealed */
  secret?: boolean;
}

/** Read-only value with a copy button (invite links, IDs, keys). */
export function CopyField({ value, label = "Value", secret, className, ...props }: CopyFieldProps) {
  const [shown, setShown] = useState(!secret);
  return (
    <div className={cx("ui-copy-field", className)} {...props}>
      <input className="ui-input ui-mono" readOnly value={shown ? value : "•".repeat(Math.min(24, value.length))} aria-label={label} onFocus={(e) => e.target.select()} />
      {secret && (
        <button type="button" className="ui-btn is-ghost is-sm" onClick={() => setShown((s) => !s)} aria-pressed={shown}>
          {shown ? "Hide" : "Reveal"}
        </button>
      )}
      <CopyButton value={value} />
    </div>
  );
}

export interface RecoveryCodesProps extends HTMLAttributes<HTMLDivElement> {
  codes: string[];
  filename?: string;
}

/** Grid of one-time backup codes with copy and download. */
export function RecoveryCodes({ codes, filename = "recovery-codes.txt", className, ...props }: RecoveryCodesProps) {
  const text = codes.join("\n");
  return (
    <div className={cx("ui-recovery", className)} {...props}>
      <ol className="ui-recovery-grid">{codes.map((c) => <li key={c} className="ui-mono">{c}</li>)}</ol>
      <div className="ui-recovery-actions">
        <CopyButton value={text} label="Copy all" />
        <button
          type="button"
          className="ui-btn is-secondary is-sm"
          onClick={() => {
            const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: filename });
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
}

export interface DeviceSessionProps extends HTMLAttributes<HTMLDivElement> {
  device: string;
  kind?: "desktop" | "laptop" | "mobile";
  location?: string;
  lastActive: string;
  current?: boolean;
  onRevoke?: () => void;
}

/** One signed-in device with a revoke action. */
export function DeviceSession({ device, kind = "desktop", location, lastActive, current, onRevoke, className, ...props }: DeviceSessionProps) {
  const Icon = kind === "mobile" ? Smartphone : kind === "laptop" ? Laptop : Monitor;
  return (
    <div className={cx("ui-list-item ui-device", className)} {...props}>
      <span className="ui-list-leading ui-device-icon"><Icon size={18} aria-hidden="true" /></span>
      <span className="ui-list-text">
        <span className="ui-list-title">{device} {current && <Badge tone="success">This device</Badge>}</span>
        <span className="ui-hint">{[location, lastActive].filter(Boolean).join(" · ")}</span>
      </span>
      {!current && onRevoke && <button type="button" className="ui-btn is-ghost is-sm ui-danger-text" onClick={onRevoke}>Sign out</button>}
    </div>
  );
}

/* ---------- Accordion ---------- */

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several open at once */
  multiple?: boolean;
  defaultValue?: string[];
  className?: string;
}

export function Accordion({ items, multiple, defaultValue = [], className }: AccordionProps) {
  const inner = items.map((it) => (
    <RAccordion.Item key={it.value} value={it.value} disabled={it.disabled} className="ui-accordion-item">
      <RAccordion.Header className="ui-accordion-header">
        <RAccordion.Trigger className="ui-accordion-trigger ui-rippled" onClick={ripple}>
          {it.title}
          <ChevronDown size={16} className="ui-accordion-chevron" aria-hidden="true" />
        </RAccordion.Trigger>
      </RAccordion.Header>
      <RAccordion.Content className="ui-accordion-content"><div className="ui-accordion-inner">{it.content}</div></RAccordion.Content>
    </RAccordion.Item>
  ));
  return multiple ? (
    <RAccordion.Root type="multiple" defaultValue={defaultValue} className={cx("ui-accordion", className)}>{inner}</RAccordion.Root>
  ) : (
    <RAccordion.Root type="single" collapsible defaultValue={defaultValue[0]} className={cx("ui-accordion", className)}>{inner}</RAccordion.Root>
  );
}

/* ---------- Stats ---------- */

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  /** e.g. +12% */
  delta?: string;
  trend?: "up" | "down" | "flat";
  /** Positive direction; "down" for metrics where lower is better */
  goodDirection?: "up" | "down";
  icon?: ReactNode;
  spark?: number[];
}

export function StatCard({ label, value, delta, trend = "flat", goodDirection = "up", icon, spark, className, ...props }: StatCardProps) {
  const good = trend === "flat" ? undefined : trend === goodDirection;
  return (
    <div className={cx("ui-card is-default is-pad-md ui-stat", className)} {...props}>
      <div className="ui-stat-head">
        <span className="ui-stat-label">{label}</span>
        {icon && <span className="ui-stat-icon">{icon}</span>}
      </div>
      <div className="ui-stat-value">{value}</div>
      <div className="ui-stat-foot">
        {delta && (
          <span className={cx("ui-stat-delta", good === true && "is-good", good === false && "is-bad")}>
            {trend === "up" ? <TrendingUp size={13} aria-hidden="true" /> : trend === "down" ? <TrendingDown size={13} aria-hidden="true" /> : null}
            {delta}
          </span>
        )}
        {spark && <Sparkline data={spark} />}
      </div>
    </div>
  );
}

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  /** Fill under the line */
  area?: boolean;
  label?: string;
}

/** Tiny inline trend line. */
export function Sparkline({ data, width = 96, height = 28, area = true, label, className, ...props }: SparklineProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((d, i) => [(i / (data.length - 1)) * width, height - 2 - ((d - min) / (max - min || 1)) * (height - 4)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg className={cx("ui-spark", className)} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...props}>
      {area && <path d={`${line} L${width},${height} L0,${height} Z`} className="ui-spark-area" />}
      <path d={line} className="ui-spark-line" />
    </svg>
  );
}

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  href?: string;
}

export function FeatureCard({ icon, title, description, href, className, ...props }: FeatureCardProps) {
  const body = (
    <>
      {icon && <span className="ui-feature-icon">{icon}</span>}
      <h3 className="ui-card-title">{title}</h3>
      <p className="ui-card-desc">{description}</p>
    </>
  );
  return href ? (
    <a href={href} className={cx("ui-card is-interactive is-pad-lg ui-feature", className)}>{body}</a>
  ) : (
    <div className={cx("ui-card is-default is-pad-lg ui-feature", className)} {...props}>{body}</div>
  );
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: { term: ReactNode; detail: ReactNode }[];
  layout?: "rows" | "columns";
}

/** Term / value pairs (game details, account info). */
export function DescriptionList({ items, layout = "rows", className, ...props }: DescriptionListProps) {
  return (
    <dl className={cx("ui-dl", `is-${layout}`, className)} {...props}>
      {items.map((it, i) => (
        <div key={i} className="ui-dl-row">
          <dt>{it.term}</dt>
          <dd>{it.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export interface TimelineItem {
  title: ReactNode;
  time?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}

/** Vertical list of events (patch notes, activity feed). */
export function Timeline({ items, className, ...props }: { items: TimelineItem[] } & HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className={cx("ui-timeline", className)} {...props}>
      {items.map((it, i) => (
        <li key={i} className="ui-timeline-item">
          <span className={cx("ui-timeline-dot", `is-${it.tone ?? "neutral"}`)} aria-hidden="true">{it.icon}</span>
          <div className="ui-timeline-body">
            <div className="ui-timeline-head">
              <span className="ui-list-title">{it.title}</span>
              {it.time && <span className="ui-hint">{it.time}</span>}
            </div>
            {it.description && <div className="ui-hint">{it.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Media ---------- */

export interface MediaItem {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export interface MediaGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: MediaItem[];
  /** Called with the index when a tile is activated (open a Lightbox) */
  onOpen?: (index: number) => void;
}

/** Large lead image with a thumbnail strip. */
export function MediaGallery({ items, onOpen, className, ...props }: MediaGalleryProps) {
  const [active, setActive] = useState(0);
  const item = items[active];
  if (!item) return null;
  return (
    <div className={cx("ui-gallery", className)} {...props}>
      <button type="button" className="ui-gallery-main" onClick={() => onOpen?.(active)} aria-label={onOpen ? `Open ${item.alt}` : item.alt}>
        <img src={item.src} alt={item.alt} />
      </button>
      {item.caption && <p className="ui-hint">{item.caption}</p>}
      <div className="ui-gallery-thumbs" role="tablist" aria-label="Images">
        {items.map((m, i) => (
          <button key={m.src} type="button" role="tab" aria-selected={i === active} aria-label={m.alt} className={cx("ui-gallery-thumb", i === active && "is-active")} onClick={() => setActive(i)}>
            <img src={m.src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  "aria-label": string;
  /** Slide width (CSS) */
  slideWidth?: string;
  children: ReactNode;
}

/** Horizontally scrolling row with snap points and prev/next buttons. */
export function Carousel({ slideWidth = "280px", className, children, ...props }: CarouselProps) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className={cx("ui-carousel", className)} aria-roledescription="carousel" {...props}>
      <div className="ui-carousel-track" ref={track} style={{ "--ui-slide": slideWidth } as React.CSSProperties}>
        {children}
      </div>
      <button type="button" className="ui-carousel-nav is-prev" aria-label="Scroll back" onClick={() => scroll(-1)}><ChevronLeft size={18} /></button>
      <button type="button" className="ui-carousel-nav is-next" aria-label="Scroll forward" onClick={() => scroll(1)}><ChevronRight size={18} /></button>
    </section>
  );
}
