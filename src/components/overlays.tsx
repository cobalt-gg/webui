import type { ReactNode } from "react";
import {
  Dialog as RDialog,
  AlertDialog as RAlert,
  Popover as RPopover,
  DropdownMenu as RMenu,
  ContextMenu as RContext,
  Tooltip as RTooltip,
} from "radix-ui";
import { Button, cx, ripple } from "./actions";
import { usePortalContainer } from "./portal";
export interface DialogProps extends React.ComponentPropsWithoutRef<
  typeof RDialog.Root
> {
  trigger: ReactNode;
  title: string;
  description: string;
  className?: string;
  contentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof RDialog.Content>,
    "children"
  >;
}
export function Dialog({
  trigger,
  title,
  description,
  children,
  className,
  contentProps,
  ...props
}: DialogProps) {
  const container = usePortalContainer();
  return (
    <RDialog.Root {...props}>
      <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>
      <RDialog.Portal container={container}>
        <RDialog.Overlay className="ui-overlay" />
        <RDialog.Content
          {...contentProps}
          className={cx("ui-dialog", className, contentProps?.className)}
        >
          <RDialog.Title className="ui-overlay-title">{title}</RDialog.Title>
          <RDialog.Description className="ui-description">
            {description}
          </RDialog.Description>
          {children}
          <RDialog.Close asChild>
            <Button variant="secondary">Close</Button>
          </RDialog.Close>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
export function Sheet(props: DialogProps) {
  return <Dialog {...props} className={cx("ui-sheet", props.className)} />;
}
export interface AlertDialogProps extends React.ComponentPropsWithoutRef<
  typeof RAlert.Root
> {
  trigger: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  cancelLabel?: string;
  className?: string;
}
export function AlertDialog({
  trigger,
  title,
  description,
  actionLabel,
  onAction,
  cancelLabel = "Cancel",
  className,
  ...props
}: AlertDialogProps) {
  const container = usePortalContainer();
  return (
    <RAlert.Root {...props}>
      <RAlert.Trigger asChild>{trigger}</RAlert.Trigger>
      <RAlert.Portal container={container}>
        <RAlert.Overlay className="ui-overlay" />
        <RAlert.Content className={cx("ui-dialog", className)}>
          <RAlert.Title className="ui-overlay-title">{title}</RAlert.Title>
          <RAlert.Description className="ui-description">
            {description}
          </RAlert.Description>
          <div className="ui-inline">
            <RAlert.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </RAlert.Cancel>
            <RAlert.Action asChild>
              <Button variant="destructive" onClick={onAction}>
                {actionLabel}
              </Button>
            </RAlert.Action>
          </div>
        </RAlert.Content>
      </RAlert.Portal>
    </RAlert.Root>
  );
}
export interface PopoverProps extends React.ComponentPropsWithoutRef<
  typeof RPopover.Root
> {
  trigger: ReactNode;
  label: string;
  className?: string;
  contentProps?: React.ComponentPropsWithoutRef<typeof RPopover.Content>;
}
export function Popover({
  trigger,
  label,
  children,
  className,
  contentProps,
  ...props
}: PopoverProps) {
  const container = usePortalContainer();
  return (
    <RPopover.Root {...props}>
      <RPopover.Trigger asChild>{trigger}</RPopover.Trigger>
      <RPopover.Portal container={container}>
        <RPopover.Content
          sideOffset={8}
          {...contentProps}
          aria-label={label}
          className={cx("ui-popover", className, contentProps?.className)}
        >
          {children}
          <RPopover.Close asChild>
            <Button size="sm" variant="ghost">
              Close
            </Button>
          </RPopover.Close>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}
export interface MenuItem {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}
export interface DropdownMenuProps extends React.ComponentPropsWithoutRef<
  typeof RMenu.Root
> {
  trigger: ReactNode;
  items: MenuItem[];
  className?: string;
  label: string;
}
export function DropdownMenu({
  trigger,
  items,
  className,
  label,
  ...props
}: DropdownMenuProps) {
  const container = usePortalContainer();
  return (
    <RMenu.Root {...props}>
      <RMenu.Trigger asChild>{trigger}</RMenu.Trigger>
      <RMenu.Portal container={container}>
        <RMenu.Content
          aria-label={label}
          sideOffset={6}
          className={cx("ui-menu", className)}
        >
          {items.map((i, n) => (
            <RMenu.Item
              key={n}
              className="ui-menu-item"
              onPointerDown={ripple}
              disabled={i.disabled}
              data-destructive={i.destructive}
              onSelect={i.onSelect}
            >
              {i.label}
            </RMenu.Item>
          ))}
        </RMenu.Content>
      </RMenu.Portal>
    </RMenu.Root>
  );
}
export interface ContextMenuProps extends React.ComponentPropsWithoutRef<
  typeof RContext.Root
> {
  children: ReactNode;
  items: MenuItem[];
  className?: string;
  label: string;
}
export function ContextMenu({
  children,
  items,
  label,
  className,
  ...props
}: ContextMenuProps) {
  const container = usePortalContainer();
  return (
    <RContext.Root {...props}>
      <RContext.Trigger
        tabIndex={0}
        className={cx("ui-context-trigger", className)}
      >
        {children}
      </RContext.Trigger>
      <RContext.Portal container={container}>
        <RContext.Content aria-label={label} className="ui-menu">
          {items.map((i, n) => (
            <RContext.Item
              key={n}
              className="ui-menu-item"
              onPointerDown={ripple}
              disabled={i.disabled}
              data-destructive={i.destructive}
              onSelect={i.onSelect}
            >
              {i.label}
            </RContext.Item>
          ))}
        </RContext.Content>
      </RContext.Portal>
    </RContext.Root>
  );
}
export interface TooltipProps extends React.ComponentPropsWithoutRef<
  typeof RTooltip.Root
> {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}
export function Tooltip({
  children,
  content,
  className,
  ...props
}: TooltipProps) {
  const container = usePortalContainer();
  return (
    <RTooltip.Provider delayDuration={250}>
      <RTooltip.Root {...props}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal container={container}>
          <RTooltip.Content
            sideOffset={6}
            className={cx("ui-tooltip", className)}
          >
            {content}
            <RTooltip.Arrow />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}
