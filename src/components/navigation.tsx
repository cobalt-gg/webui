import { forwardRef, useState, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { Tabs as RTabs, Menubar as RMenubar, Toolbar as RToolbar } from "radix-ui";
import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Search, Menu, X } from "lucide-react";
import { cx, ripple, useControllable } from "../lib/utils";
import { usePortalContainer } from "../lib/portal";

/* ---------- Tabs ---------- */

export interface TabItem {
  value: string;
  label: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "underline" | "pill";
  "aria-label"?: string;
  className?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, variant = "underline", className, ...props }: TabsProps) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items[0]?.value ?? "", onValueChange);
  return (
    <RTabs.Root value={current} onValueChange={setCurrent} className={cx("ui-tabs", `is-${variant}`, className)}>
      <RTabs.List className="ui-tab-list" aria-label={props["aria-label"]}>
        {items.map((t) => (
          <RTabs.Trigger key={t.value} value={t.value} disabled={t.disabled} className="ui-tab ui-rippled" onClick={ripple}>
            {t.icon}
            {t.label}
            {t.badge !== undefined && <span className="ui-tab-badge">{t.badge}</span>}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      {items.map((t) =>
        t.content === undefined ? null : (
          <RTabs.Content key={t.value} value={t.value} className="ui-tab-panel">
            {t.content}
          </RTabs.Content>
        ),
      )}
    </RTabs.Root>
  );
}

/* ---------- Links ---------- */

export interface Crumb {
  label: ReactNode;
  href?: string;
}

export function Breadcrumbs({ items, className, ...props }: { items: Crumb[] } & HTMLAttributes<HTMLElement>) {
  return (
    <nav aria-label="Breadcrumb" className={cx("ui-breadcrumbs", className)} {...props}>
      <ol>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !c.href ? (
                <span aria-current={last ? "page" : undefined}>{c.label}</span>
              ) : (
                <a href={c.href}>{c.label}</a>
              )}
              {!last && <ChevronRight size={13} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Trailing element (shortcut, chevron) */
  trailing?: ReactNode;
}

/** Vertical sidebar link. */
export const SidebarItem = forwardRef<HTMLAnchorElement, NavItemProps>(function SidebarItem(
  { active, icon, badge, trailing, className, children, onClick, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      aria-current={active ? "page" : undefined}
      className={cx("ui-sidebar-item ui-rippled", active && "is-active", className)}
      onClick={(e) => (ripple(e), onClick?.(e))}
      {...props}
    >
      {icon && <span className="ui-nav-icon">{icon}</span>}
      <span className="ui-nav-label">{children}</span>
      {badge !== undefined && <span className="ui-tab-badge">{badge}</span>}
      {trailing}
    </a>
  );
});

/** Horizontal top-nav link. */
export const NavigationItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavigationItem(
  { active, icon, badge, className, children, onClick, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      aria-current={active ? "page" : undefined}
      className={cx("ui-nav-item ui-rippled", active && "is-active", className)}
      onClick={(e) => (ripple(e), onClick?.(e))}
      {...props}
    >
      {icon}
      {children}
      {badge !== undefined && <span className="ui-tab-badge">{badge}</span>}
    </a>
  );
});

export interface SidebarSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  action?: ReactNode;
}

/** Labelled group of SidebarItems. */
export function SidebarSection({ title, action, className, children, ...props }: SidebarSectionProps) {
  return (
    <div className={cx("ui-sidebar-section", className)} {...props}>
      {title && (
        <div className="ui-sidebar-title">
          <span>{title}</span>
          {action}
        </div>
      )}
      <div className="ui-sidebar-items">{children}</div>
    </div>
  );
}

/* ---------- Pagination ---------- */

export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  total: number;
  /** Pages shown either side of the current one */
  siblings?: number;
  className?: string;
}

function pageList(page: number, total: number, siblings: number) {
  const out: (number | "gap")[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - page) <= siblings) out.push(p);
    else if (out[out.length - 1] !== "gap") out.push("gap");
  }
  return out;
}

export function Pagination({ page, defaultPage = 1, onPageChange, total, siblings = 1, className }: PaginationProps) {
  const [current, setCurrent] = useControllable(page, defaultPage, onPageChange);
  return (
    <nav aria-label="Pagination" className={cx("ui-pagination", className)}>
      <button type="button" className="ui-page" aria-label="Previous page" disabled={current <= 1} onClick={() => setCurrent(current - 1)}>
        <ChevronLeft size={15} />
      </button>
      {pageList(current, total, siblings).map((p, i) =>
        p === "gap" ? (
          <span key={`g${i}`} className="ui-page is-gap" aria-hidden="true"><MoreHorizontal size={15} /></span>
        ) : (
          <button
            key={p}
            type="button"
            className={cx("ui-page", p === current && "is-current")}
            aria-current={p === current ? "page" : undefined}
            aria-label={`Page ${p}`}
            onClick={() => setCurrent(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="ui-page" aria-label="Next page" disabled={current >= total} onClick={() => setCurrent(current + 1)}>
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}

/* ---------- Command trigger, stepper ---------- */

export interface CommandMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
  shortcut?: string[];
}

/** Search-looking button that opens a CommandPalette. */
export function CommandMenuTrigger({ placeholder = "Search or jump to…", shortcut = ["⌘", "K"], className, ...props }: CommandMenuTriggerProps) {
  return (
    <button type="button" className={cx("ui-input ui-command-trigger", className)} aria-haspopup="dialog" {...props}>
      <Search size={15} aria-hidden="true" />
      <span className="ui-placeholder">{placeholder}</span>
      <span className="ui-kbd-group" aria-hidden="true">{shortcut.map((k) => <kbd key={k} className="ui-kbd">{k}</kbd>)}</span>
    </button>
  );
}

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** Zero-based index of the current step */
  current: number;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({ steps, current, orientation = "horizontal", className, ...props }: StepperProps) {
  return (
    <ol className={cx("ui-stepper", `is-${orientation}`, className)} {...props}>
      {steps.map((s, i) => {
        const state = i < current ? "complete" : i === current ? "current" : "upcoming";
        return (
          <li key={i} className={cx("ui-step", `is-${state}`)} aria-current={state === "current" ? "step" : undefined}>
            <span className="ui-step-dot" aria-hidden="true">{state === "complete" ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
            <span className="ui-step-text">
              <span className="ui-step-label">{s.label}<span className="ui-sr-only"> ({state})</span></span>
              {s.description && <span className="ui-hint">{s.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Site header / footer ---------- */

export interface SiteLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  links?: SiteLink[];
  actions?: ReactNode;
  navigationLabel?: string;
  sticky?: boolean;
}

/** Marketing / docs header that collapses to a menu button on narrow screens. */
export function SiteHeader({ brand, links = [], actions, navigationLabel = "Main", sticky, className, ...props }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className={cx("ui-site-header", sticky && "is-sticky", open && "is-open", className)} {...props}>
      <div className="ui-site-header-inner">
        <div className="ui-site-brand">{brand}</div>
        {links.length > 0 && (
          <nav aria-label={navigationLabel} className="ui-site-nav" id="ui-site-nav">
            {links.map((l) => (
              <NavigationItem key={`${l.label}-${l.href}`} href={l.href} active={l.active}>{l.label}</NavigationItem>
            ))}
          </nav>
        )}
        <div className="ui-site-actions">{actions}</div>
        {links.length > 0 && (
          <button type="button" className="ui-close ui-site-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="ui-site-nav" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}
      </div>
    </header>
  );
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  columns?: { title: string; links: SiteLink[] }[];
  legal?: ReactNode;
}

export function SiteFooter({ brand, columns = [], legal, className, ...props }: SiteFooterProps) {
  return (
    <footer className={cx("ui-site-footer", className)} {...props}>
      <div className="ui-site-footer-grid">
        {brand && <div className="ui-site-footer-brand">{brand}</div>}
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="ui-site-footer-col">
            <p className="ui-eyebrow">{c.title}</p>
            <ul>{c.links.map((l) => <li key={`${l.label}-${l.href}`}><a href={l.href}>{l.label}</a></li>)}</ul>
          </nav>
        ))}
      </div>
      {legal && <div className="ui-site-footer-legal">{legal}</div>}
    </footer>
  );
}

/* ---------- Menubar, Toolbar, TreeView ---------- */

export interface MenubarItem {
  label?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  separator?: boolean;
  checked?: boolean;
}

export interface MenubarProps {
  menus: { label: string; items: MenubarItem[] }[];
  className?: string;
}

/** Desktop-app menu bar (File, Edit, View…). */
export function Menubar({ menus, className }: MenubarProps) {
  const container = usePortalContainer();
  return (
    <RMenubar.Root className={cx("ui-menubar", className)}>
      {menus.map((m) => (
        <RMenubar.Menu key={m.label}>
          <RMenubar.Trigger className="ui-menubar-trigger">{m.label}</RMenubar.Trigger>
          <RMenubar.Portal container={container}>
            <RMenubar.Content className="ui-menu" align="start" sideOffset={6}>
              {m.items.map((it, i) =>
                it.separator ? (
                  <RMenubar.Separator key={i} className="ui-menu-sep" />
                ) : it.checked !== undefined ? (
                  <RMenubar.CheckboxItem key={i} className="ui-menu-item" checked={it.checked} disabled={it.disabled} onSelect={it.onSelect}>
                    <span className="ui-menu-check-slot"><RMenubar.ItemIndicator><Check size={14} /></RMenubar.ItemIndicator></span>
                    <span className="ui-menu-label">{it.label}</span>
                    {it.shortcut && <span className="ui-menu-hint">{it.shortcut}</span>}
                  </RMenubar.CheckboxItem>
                ) : (
                  <RMenubar.Item key={i} className="ui-menu-item" disabled={it.disabled} onSelect={it.onSelect}>
                    <span className="ui-menu-label">{it.label}</span>
                    {it.shortcut && <span className="ui-menu-hint">{it.shortcut}</span>}
                  </RMenubar.Item>
                ),
              )}
            </RMenubar.Content>
          </RMenubar.Portal>
        </RMenubar.Menu>
      ))}
    </RMenubar.Root>
  );
}

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  "aria-label": string;
}

/** Arrow-key navigable row of controls. Use ToolbarButton and ToolbarSeparator inside. */
export function Toolbar({ className, children, ...props }: ToolbarProps) {
  return <RToolbar.Root className={cx("ui-toolbar", className)} {...props}>{children}</RToolbar.Root>;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, React.ComponentProps<typeof RToolbar.Button>>(function ToolbarButton({ className, ...props }, ref) {
  return <RToolbar.Button ref={ref} className={cx("ui-toggle is-sm", className)} {...props} />;
});

export function ToolbarSeparator() {
  return <RToolbar.Separator className="ui-toolbar-sep" />;
}

export interface TreeNode {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selected?: string;
  onSelect?: (id: string) => void;
  defaultExpanded?: string[];
  "aria-label": string;
  className?: string;
}

/** Collapsible hierarchy (folders, mod lists) with tree keyboard support. */
export function TreeView({ nodes, selected, onSelect, defaultExpanded = [], className, ...props }: TreeViewProps) {
  const [expanded, setExpanded] = useState(new Set(defaultExpanded));
  const [current, setCurrent] = useControllable(selected, nodes[0]?.id ?? "", onSelect);
  const toggle = (id: string, open?: boolean) =>
    setExpanded((s) => {
      const n = new Set(s);
      (open ?? !n.has(id)) ? n.add(id) : n.delete(id);
      return n;
    });
  const visible: TreeNode[] = [];
  const walk = (list: TreeNode[]) => list.forEach((n) => (visible.push(n), n.children && expanded.has(n.id) && walk(n.children)));
  walk(nodes);
  const focusId = (id: string) => requestAnimationFrame(() => document.getElementById(`ui-tree-${id}`)?.focus());
  const onKey = (e: React.KeyboardEvent, n: TreeNode) => {
    const i = visible.findIndex((v) => v.id === n.id);
    if (e.key === "ArrowDown" && visible[i + 1]) (e.preventDefault(), focusId(visible[i + 1].id));
    if (e.key === "ArrowUp" && visible[i - 1]) (e.preventDefault(), focusId(visible[i - 1].id));
    if (e.key === "ArrowRight" && n.children) (e.preventDefault(), toggle(n.id, true));
    if (e.key === "ArrowLeft" && n.children) (e.preventDefault(), toggle(n.id, false));
    if (e.key === "Enter" || e.key === " ") (e.preventDefault(), setCurrent(n.id), n.children && toggle(n.id));
  };
  const render = (list: TreeNode[], level: number): ReactNode =>
    list.map((n) => {
      const open = expanded.has(n.id);
      return (
        <li key={n.id} role="none">
          <div
            id={`ui-tree-${n.id}`}
            role="treeitem"
            aria-level={level}
            aria-expanded={n.children ? open : undefined}
            aria-selected={current === n.id}
            tabIndex={current === n.id ? 0 : -1}
            className={cx("ui-tree-item", current === n.id && "is-selected")}
            style={{ paddingLeft: 8 + (level - 1) * 16 }}
            onClick={() => (setCurrent(n.id), n.children && toggle(n.id))}
            onKeyDown={(e) => onKey(e, n)}
          >
            <span className={cx("ui-tree-caret", open && "is-open", !n.children && "is-leaf")} aria-hidden="true">
              <ChevronRight size={13} />
            </span>
            {n.icon}
            <span className="ui-nav-label">{n.label}</span>
          </div>
          {n.children && open && <ul role="group">{render(n.children, level + 1)}</ul>}
        </li>
      );
    });
  return <ul role="tree" className={cx("ui-tree", className)} aria-label={props["aria-label"]}>{render(nodes, 1)}</ul>;
}
