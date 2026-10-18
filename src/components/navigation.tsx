import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Tabs as RTabs } from "radix-ui";
import { Button, cx, type ButtonProps } from "./actions";
export interface TabsProps extends React.ComponentPropsWithoutRef<
  typeof RTabs.Root
> {
  items: {
    value: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
  label: string;
}
export function Tabs({ items, label, className, ...props }: TabsProps) {
  return (
    <RTabs.Root className={cx("ui-tabs", className)} {...props}>
      <RTabs.List className="ui-tab-list" aria-label={label}>
        {items.map((i) => (
          <RTabs.Trigger
            className="ui-tab"
            key={i.value}
            value={i.value}
            disabled={i.disabled}
          >
            {i.label}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      {items.map((i) => (
        <RTabs.Content className="ui-tab-content" key={i.value} value={i.value}>
          {i.content}
        </RTabs.Content>
      ))}
    </RTabs.Root>
  );
}
export function Breadcrumbs({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cx("ui-breadcrumbs", className)}
      {...props}
    >
      <ol>{children}</ol>
    </nav>
  );
}
export interface NavigationItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
}
export function NavigationItem({
  active,
  className,
  ...props
}: NavigationItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cx("ui-nav-item", className)}
      {...props}
    />
  );
}
export function SidebarItem(props: NavigationItemProps) {
  return <NavigationItem {...props} />;
}
export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "onChange"
> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}
export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cx("ui-inline", className)}
      {...props}
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span aria-live="polite">
        {page} / {pageCount}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
export function CommandMenuTrigger({
  children = "Search commands",
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="secondary"
      className={cx("ui-command-trigger", className)}
      {...props}
    >
      {children}
      <kbd>⌘ K</kbd>
    </Button>
  );
}
