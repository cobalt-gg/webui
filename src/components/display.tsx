import {
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type TableHTMLAttributes,
  type ReactNode,
} from "react";
import { Avatar as RAvatar } from "radix-ui";
import { Button, cx } from "./actions";
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "outlined" | "elevated" | "filled";
}
export function Card({ variant = "outlined", className, ...props }: CardProps) {
  return (
    <div
      className={cx("ui-card", className)}
      data-variant={variant}
      {...props}
    />
  );
}
export function ListItem({
  className,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return <li className={cx("ui-list-item", className)} {...props} />;
}
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}
export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
  imageProps,
  ...props
}: AvatarProps) {
  return (
    <RAvatar.Root
      className={cx("ui-avatar", className)}
      data-size={size}
      {...props}
    >
      <RAvatar.Image {...imageProps} src={src} alt={alt} />
      <RAvatar.Fallback role="img" aria-label={alt}>
        {fallback}
      </RAvatar.Fallback>
    </RAvatar.Root>
  );
}
export function Table({
  className,
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="ui-table-scroll">
      <table className={cx("ui-table", className)} {...props} />
    </div>
  );
}
export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  action?: ReactNode;
}
export function EmptyState({
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div className={cx("ui-empty", className)} {...props}>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function Divider({
  className,
  ...props
}: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx("ui-divider", className)} {...props} />;
}
export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  copyable?: boolean;
}
export function CodeBlock({
  code,
  language = "tsx",
  copyable = true,
  className,
  ...props
}: CodeBlockProps) {
  const [status, setStatus] = useState("Copy");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied");
    } catch {
      setStatus("Select code to copy");
    }
  }
  return (
    <div className={cx("ui-code-block", className)} {...props}>
      <div className="ui-code-heading">
        <span>{language}</span>
        {copyable && (
          <Button variant="ghost" size="sm" onClick={copy}>
            {status}
          </Button>
        )}
        <span className="ui-sr-only" role="status">
          {status === "Copied" ? "Copied to clipboard" : ""}
        </span>
      </div>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
