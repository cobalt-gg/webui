import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
import {
  AlertDialog as RAlert,
  ContextMenu as RContext,
  Dialog as RDialog,
  DropdownMenu as RMenu,
  HoverCard as RHover,
  Popover as RPopover,
  Tooltip as RTooltip,
  VisuallyHidden,
} from "radix-ui";
import { Check, ChevronLeft, ChevronRight, ChevronRight as Sub, CornerDownLeft, Search, X } from "lucide-react";
import { cx } from "../lib/utils";
import { usePortalContainer } from "../lib/portal";
import { Button, type ButtonVariant } from "./actions";

interface OpenState {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/* ---------- Dialog & Sheet ---------- */

export interface DialogProps extends OpenState {
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Hide the title visually (still announced) */
  hideTitle?: boolean;
  className?: string;
}

export function Dialog({ trigger, title, description, children, footer, size = "md", hideTitle, className, ...state }: DialogProps) {
  const container = usePortalContainer();
  const heading = <RDialog.Title className="ui-dialog-title">{title}</RDialog.Title>;
  return (
    <RDialog.Root {...state}>
      {trigger && <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>}
      <RDialog.Portal container={container}>
        <RDialog.Overlay className="ui-overlay" />
        <RDialog.Content className={cx("ui-dialog", `is-${size}`, className)}>
          <div className="ui-dialog-head">
            <div>
              {hideTitle ? <VisuallyHidden.Root>{heading}</VisuallyHidden.Root> : heading}
              {description ? (
                <RDialog.Description className="ui-dialog-desc">{description}</RDialog.Description>
              ) : (
                <VisuallyHidden.Root><RDialog.Description>{typeof title === "string" ? title : "Dialog"}</RDialog.Description></VisuallyHidden.Root>
              )}
            </div>
            <RDialog.Close className="ui-close" aria-label="Close"><X size={16} /></RDialog.Close>
          </div>
          {children && <div className="ui-dialog-body">{children}</div>}
          {footer && <div className="ui-dialog-foot">{footer}</div>}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}

/** Wrap a footer button to close the enclosing Dialog or Sheet. */
export const DialogClose = RDialog.Close;

export interface SheetProps extends Omit<DialogProps, "size"> {
  side?: "right" | "left" | "bottom";
  width?: number | string;
}

/** Panel that slides in from an edge. */
export function Sheet({ trigger, title, description, children, footer, side = "right", width, className, ...state }: SheetProps) {
  const container = usePortalContainer();
  return (
    <RDialog.Root {...state}>
      {trigger && <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>}
      <RDialog.Portal container={container}>
        <RDialog.Overlay className="ui-overlay" />
        <RDialog.Content className={cx("ui-sheet", `is-${side}`, className)} style={width ? { width } : undefined}>
          <div className="ui-dialog-head">
            <div>
              <RDialog.Title className="ui-dialog-title">{title}</RDialog.Title>
              {description ? <RDialog.Description className="ui-dialog-desc">{description}</RDialog.Description> : <VisuallyHidden.Root><RDialog.Description>{typeof title === "string" ? title : "Panel"}</RDialog.Description></VisuallyHidden.Root>}
            </div>
            <RDialog.Close className="ui-close" aria-label="Close"><X size={16} /></RDialog.Close>
          </div>
          <div className="ui-dialog-body ui-sheet-body">{children}</div>
          {footer && <div className="ui-dialog-foot">{footer}</div>}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}

export interface AlertDialogProps extends OpenState {
  trigger?: ReactElement;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  tone?: "danger" | "accent";
}

/** Confirmation that must be answered; focus starts on Cancel. */
export function AlertDialog({ trigger, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, tone = "danger", ...state }: AlertDialogProps) {
  const container = usePortalContainer();
  const variant: ButtonVariant = tone === "danger" ? "danger" : "primary";
  return (
    <RAlert.Root {...state}>
      {trigger && <RAlert.Trigger asChild>{trigger}</RAlert.Trigger>}
      <RAlert.Portal container={container}>
        <RAlert.Overlay className="ui-overlay" />
        <RAlert.Content className="ui-dialog is-sm">
          <div className="ui-dialog-head">
            <div>
              <RAlert.Title className="ui-dialog-title">{title}</RAlert.Title>
              <RAlert.Description className="ui-dialog-desc">{description}</RAlert.Description>
            </div>
          </div>
          <div className="ui-dialog-foot">
            <RAlert.Cancel asChild><Button variant="ghost">{cancelLabel}</Button></RAlert.Cancel>
            <RAlert.Action asChild><Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button></RAlert.Action>
          </div>
        </RAlert.Content>
      </RAlert.Portal>
    </RAlert.Root>
  );
}

/* ---------- Floating ---------- */

type Side = "top" | "right" | "bottom" | "left";

export interface PopoverProps extends OpenState {
  trigger: ReactElement;
  children: ReactNode;
  side?: Side;
  align?: "start" | "center" | "end";
  title?: ReactNode;
  className?: string;
  /** Props passed to the floating content (aria-label etc.) */
  contentProps?: React.ComponentProps<typeof RPopover.Content>;
}

export function Popover({ trigger, children, side = "bottom", align = "center", title, className, contentProps, ...state }: PopoverProps) {
  const container = usePortalContainer();
  return (
    <RPopover.Root {...state}>
      <RPopover.Trigger asChild>{trigger}</RPopover.Trigger>
      <RPopover.Portal container={container}>
        <RPopover.Content side={side} align={align} sideOffset={8} className={cx("ui-popover is-padded", className)} {...contentProps}>
          {title && <p className="ui-popover-title">{title}</p>}
          {children}
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: Side;
  /** ms */
  delay?: number;
  shortcut?: string[];
}

/** Hover / focus hint. Supplementary only: never the sole label. */
export function Tooltip({ content, children, side = "top", delay = 300, shortcut }: TooltipProps) {
  const container = usePortalContainer();
  return (
    <RTooltip.Provider delayDuration={delay}>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal container={container}>
          <RTooltip.Content side={side} sideOffset={6} className="ui-tooltip">
            {content}
            {shortcut && <span className="ui-kbd-group">{shortcut.map((k) => <kbd key={k} className="ui-kbd">{k}</kbd>)}</span>}
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}

export interface HoverCardProps {
  trigger: ReactElement;
  children: ReactNode;
  side?: Side;
  openDelay?: number;
}

/** Rich preview on hover (a friend's profile, a game). Not reachable by touch: keep it supplementary. */
export function HoverCard({ trigger, children, side = "bottom", openDelay = 400 }: HoverCardProps) {
  const container = usePortalContainer();
  return (
    <RHover.Root openDelay={openDelay} closeDelay={100}>
      <RHover.Trigger asChild>{trigger}</RHover.Trigger>
      <RHover.Portal container={container}>
        <RHover.Content side={side} sideOffset={8} className="ui-popover is-padded ui-hovercard">{children}</RHover.Content>
      </RHover.Portal>
    </RHover.Root>
  );
}

/* ---------- Menus ---------- */

export interface MenuItem {
  label?: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  /** Section label */
  heading?: ReactNode;
  checked?: boolean;
  items?: MenuItem[];
}

type MenuParts = typeof RMenu | typeof RContext;

function renderItems(P: MenuParts, items: MenuItem[], container?: HTMLElement): ReactNode {
  return items.map((it, i) => {
    if (it.separator) return <P.Separator key={i} className="ui-menu-sep" />;
    if (it.heading) return <P.Label key={i} className="ui-menu-heading">{it.heading}</P.Label>;
    const inner = (
      <>
        <span className="ui-menu-check-slot">{it.icon ?? (it.checked !== undefined && <P.ItemIndicator><Check size={14} /></P.ItemIndicator>)}</span>
        <span className="ui-menu-label">{it.label}</span>
        {it.shortcut && <span className="ui-menu-hint">{it.shortcut}</span>}
      </>
    );
    if (it.items)
      return (
        <P.Sub key={i}>
          <P.SubTrigger className="ui-menu-item" disabled={it.disabled}>
            {inner}
            <Sub size={14} className="ui-menu-hint" />
          </P.SubTrigger>
          <P.Portal container={container}>
            <P.SubContent className="ui-menu" sideOffset={4}>{renderItems(P, it.items, container)}</P.SubContent>
          </P.Portal>
        </P.Sub>
      );
    if (it.checked !== undefined)
      return (
        <P.CheckboxItem key={i} className="ui-menu-item" checked={it.checked} disabled={it.disabled} onSelect={it.onSelect}>
          {inner}
        </P.CheckboxItem>
      );
    return (
      <P.Item key={i} className={cx("ui-menu-item", it.danger && "is-danger")} disabled={it.disabled} onSelect={it.onSelect}>
        {inner}
      </P.Item>
    );
  });
}

export interface DropdownMenuProps extends OpenState {
  trigger: ReactElement;
  items: MenuItem[];
  align?: "start" | "center" | "end";
  side?: Side;
  contentProps?: React.ComponentProps<typeof RMenu.Content>;
}

export function DropdownMenu({ trigger, items, align = "start", side = "bottom", contentProps, ...state }: DropdownMenuProps) {
  const container = usePortalContainer();
  return (
    <RMenu.Root {...state}>
      <RMenu.Trigger asChild>{trigger}</RMenu.Trigger>
      <RMenu.Portal container={container}>
        <RMenu.Content className="ui-menu" align={align} side={side} sideOffset={6} {...contentProps}>
          {renderItems(RMenu, items, container)}
        </RMenu.Content>
      </RMenu.Portal>
    </RMenu.Root>
  );
}

export interface ContextMenuProps {
  children: ReactElement;
  items: MenuItem[];
}

/** Right-click (or long-press, or Shift+F10) menu for its child. */
export function ContextMenu({ children, items }: ContextMenuProps) {
  const container = usePortalContainer();
  return (
    <RContext.Root>
      <RContext.Trigger asChild>{children}</RContext.Trigger>
      <RContext.Portal container={container}>
        <RContext.Content className="ui-menu">{renderItems(RContext, items, container)}</RContext.Content>
      </RContext.Portal>
    </RContext.Root>
  );
}

/* ---------- Command palette ---------- */

export interface Command {
  id: string;
  label: string;
  group?: string;
  icon?: ReactNode;
  shortcut?: string[];
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps extends OpenState {
  commands: Command[];
  placeholder?: string;
  emptyText?: string;
  /** Bind ⌘K / Ctrl+K to open it */
  hotkey?: boolean;
}

/** ⌘K launcher: filter commands, arrows to move, Enter to run. */
export function CommandPalette({ commands, placeholder = "Type a command or search…", emptyText = "Nothing found", hotkey = true, open, defaultOpen = false, onOpenChange }: CommandPaletteProps) {
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const setOpen = (o: boolean) => (open === undefined && setInner(o), onOpenChange?.(o));
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const container = usePortalContainer();
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(() => {
    if (isOpen) (setQuery(""), setActive(0));
  }, [isOpen]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => [c.label, c.group, ...(c.keywords ?? [])].join(" ").toLowerCase().includes(q)) : commands;
  }, [commands, query]);
  const groups = useMemo(() => {
    const m = new Map<string, Command[]>();
    shown.forEach((c) => m.set(c.group ?? "", [...(m.get(c.group ?? "") ?? []), c]));
    return [...m.entries()];
  }, [shown]);
  const run = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    c.onSelect();
  };
  let index = -1;
  return (
    <RDialog.Root open={isOpen} onOpenChange={setOpen}>
      <RDialog.Portal container={container}>
        <RDialog.Overlay className="ui-overlay" />
        <RDialog.Content className="ui-dialog is-md ui-palette">
          <VisuallyHidden.Root>
            <RDialog.Title>Command palette</RDialog.Title>
            <RDialog.Description>Search for a command and press Enter to run it.</RDialog.Description>
          </VisuallyHidden.Root>
          <div className="ui-palette-search">
            <Search size={16} aria-hidden="true" />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="ui-palette-list"
              aria-activedescendant={shown[active] ? `ui-cmd-${shown[active].id}` : undefined}
              placeholder={placeholder}
              value={query}
              onChange={(e) => (setQuery(e.target.value), setActive(0))}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(shown.length - 1, a + 1)));
                if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
                if (e.key === "Enter") (e.preventDefault(), run(shown[active]));
              }}
            />
            <kbd className="ui-kbd">Esc</kbd>
          </div>
          <div role="listbox" id="ui-palette-list" className="ui-palette-list">
            {shown.length === 0 && <p className="ui-listbox-empty">{emptyText}</p>}
            {groups.map(([group, list]) => (
              <div key={group} role="group" aria-label={group || "Commands"}>
                {group && <p className="ui-menu-heading">{group}</p>}
                {list.map((c) => {
                  index++;
                  const i = index;
                  return (
                    <div
                      key={c.id}
                      id={`ui-cmd-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      className={cx("ui-menu-item", i === active && "is-active")}
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(c)}
                    >
                      <span className="ui-menu-check-slot">{c.icon}</span>
                      <span className="ui-menu-label">{c.label}</span>
                      {c.shortcut ? (
                        <span className="ui-kbd-group">{c.shortcut.map((k) => <kbd key={k} className="ui-kbd">{k}</kbd>)}</span>
                      ) : (
                        i === active && <CornerDownLeft size={14} className="ui-menu-hint" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}

/* ---------- Lightbox ---------- */

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: ReactNode;
}

export interface LightboxProps extends OpenState {
  images: LightboxImage[];
  index?: number;
  onIndexChange?: (index: number) => void;
}

/** Full-screen image viewer with arrow-key paging. */
export function Lightbox({ images, index = 0, onIndexChange, ...state }: LightboxProps) {
  const [i, setI] = useState(index);
  useEffect(() => setI(index), [index]);
  const go = (n: number) => {
    const next = (n + images.length) % images.length;
    setI(next);
    onIndexChange?.(next);
  };
  const container = usePortalContainer();
  const img = images[i];
  return (
    <RDialog.Root {...state}>
      <RDialog.Portal container={container}>
        <RDialog.Overlay className="ui-overlay is-dark" />
        <RDialog.Content
          className="ui-lightbox"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(i + 1);
            if (e.key === "ArrowLeft") go(i - 1);
          }}
        >
          <RDialog.Title className="ui-sr-only">{img?.alt ?? "Image"}</RDialog.Title>
          <RDialog.Description className="ui-sr-only">Image {i + 1} of {images.length}. Use arrow keys to move between images.</RDialog.Description>
          {img && <img src={img.src} alt={img.alt} />}
          {img?.caption && <p className="ui-lightbox-caption">{img.caption}</p>}
          {images.length > 1 && (
            <>
              <button type="button" className="ui-lightbox-nav is-prev" aria-label="Previous image" onClick={() => go(i - 1)}><ChevronLeft size={20} /></button>
              <button type="button" className="ui-lightbox-nav is-next" aria-label="Next image" onClick={() => go(i + 1)}><ChevronRight size={20} /></button>
            </>
          )}
          <RDialog.Close className="ui-close ui-lightbox-close" aria-label="Close"><X size={18} /></RDialog.Close>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
