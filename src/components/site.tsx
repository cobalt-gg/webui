import {
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type InputHTMLAttributes,
} from "react";
import { Dialog as RDialog } from "radix-ui";
import { ChevronLeft, ChevronRight, X, Keyboard } from "lucide-react";
import { cx, IconButton, Button, ripple } from "./actions";
import { usePortalContainer } from "./portal";
export interface SiteLink {
  label: string;
  href: string;
  active?: boolean;
}
export interface SiteHeaderProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  links: SiteLink[];
  actions?: ReactNode;
  navigationLabel?: string;
}
export function SiteHeader({
  brand,
  links,
  actions,
  navigationLabel = "Site navigation",
  className,
  ...props
}: SiteHeaderProps) {
  return (
    <header className={cx("ui-site-header", className)} {...props}>
      <div className="ui-site-brand">{brand}</div>
      <nav aria-label={navigationLabel}>
        {links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
      {actions && <div className="ui-inline">{actions}</div>}
    </header>
  );
}
export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  brand: ReactNode;
  links: SiteLink[];
  copyright: string;
}
export function SiteFooter({
  brand,
  links,
  copyright,
  className,
  ...props
}: SiteFooterProps) {
  return (
    <footer className={cx("ui-site-footer", className)} {...props}>
      <div className="ui-inline">
        <strong>{brand}</strong>
        <nav aria-label="Footer navigation">
          {links.map((link) => (
            <a key={link.href + link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <p>{copyright}</p>
    </footer>
  );
}
export interface MediaItem {
  src: string;
  alt: string;
  title: string;
  description?: string;
}
export interface MediaGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: MediaItem[];
  label: string;
}
export function MediaGallery({
  items,
  label,
  className,
  ...props
}: MediaGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const lastIndex = useRef(0);
  const container = usePortalContainer();
  const selectedIndex =
    index === null ? null : Math.min(index, Math.max(0, items.length - 1));
  const item = selectedIndex === null ? null : items[selectedIndex];
  const navigate = (n: number) => {
    if (selectedIndex !== null && items.length)
      setIndex((selectedIndex + n + items.length) % items.length);
  };
  return (
    <div className={cx("ui-media-gallery", className)} {...props}>
      <div className="ui-media-grid" role="group" aria-label={label}>
        {items.map((image, i) => (
          <button
            type="button"
            key={image.src + i}
            className="ui-media-tile"
            onPointerDown={ripple}
            ref={(node) => {
              triggers.current[i] = node;
            }}
            onClick={() => {
              lastIndex.current = i;
              setIndex(i);
            }}
            aria-label={`View ${image.title}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              decoding="async"
            />
            <span>{image.title}</span>
          </button>
        ))}
      </div>
      <RDialog.Root
        open={index !== null && items.length > 0}
        onOpenChange={(open) => {
          if (!open) setIndex(null);
        }}
      >
        <RDialog.Portal container={container}>
          <RDialog.Overlay className="ui-overlay" />
          <RDialog.Content
            className="ui-lightbox"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              triggers.current[lastIndex.current]?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                navigate(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                navigate(-1);
              }
            }}
          >
            {item && (
              <>
                <div className="ui-inline">
                  <div>
                    <RDialog.Title>{item.title}</RDialog.Title>
                    <RDialog.Description>
                      {item.description ?? item.alt}
                    </RDialog.Description>
                  </div>
                  <RDialog.Close asChild>
                    <IconButton variant="ghost" aria-label="Close image">
                      <X size={18} />
                    </IconButton>
                  </RDialog.Close>
                </div>
                <img src={item.src} alt={item.alt} />
                <div className="ui-inline ui-lightbox-controls">
                  <IconButton
                    variant="secondary"
                    aria-label="Previous image"
                    disabled={items.length < 2}
                    onClick={() => navigate(-1)}
                  >
                    <ChevronLeft size={17} />
                  </IconButton>
                  <span aria-live="polite">
                    {(selectedIndex ?? 0) + 1} / {items.length}
                  </span>
                  <IconButton
                    variant="secondary"
                    aria-label="Next image"
                    disabled={items.length < 2}
                    onClick={() => navigate(1)}
                  >
                    <ChevronRight size={17} />
                  </IconButton>
                </div>
              </>
            )}
          </RDialog.Content>
        </RDialog.Portal>
      </RDialog.Root>
    </div>
  );
}
export interface ColorPickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "value" | "defaultValue" | "size"
> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  presets?: string[];
}
export function ColorPicker({
  label,
  value,
  onValueChange,
  presets = ["#3b4275", "#3867ff", "#8b5cf6", "#16a085", "#b35b32"],
  className,
  disabled,
  ...props
}: ColorPickerProps) {
  return (
    <div className={cx("ui-color-picker", className)}>
      <div className="ui-inline">
        <label className="ui-custom-color">
          <input
            {...props}
            type="color"
            aria-label={label}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            disabled={disabled}
          />
          <span>{label}</span>
        </label>
        <code>{value.toUpperCase()}</code>
      </div>
      <div className="ui-inline" role="group" aria-label={`${label} presets`}>
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Use ${color}`}
            aria-pressed={value.toLowerCase() === color.toLowerCase()}
            disabled={disabled}
            className="ui-color-swatch"
            style={{ background: color }}
            onClick={() => onValueChange(color)}
          />
        ))}
      </div>
    </div>
  );
}
export interface HotkeyInputProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}
export function HotkeyInput({
  label,
  value,
  onValueChange,
  disabled,
  className,
  ...props
}: HotkeyInputProps) {
  const [recording, setRecording] = useState(false);
  return (
    <div className={cx("ui-hotkey", className)} {...props}>
      <Button
        variant="secondary"
        aria-label={label}
        aria-pressed={recording}
        disabled={disabled}
        onClick={() => setRecording(!recording)}
        onBlur={() => setRecording(false)}
        onKeyDown={(e) => {
          if (!recording) return;
          if (e.key === "Tab") return;
          if (e.key === "Escape") {
            e.preventDefault();
            setRecording(false);
            return;
          }
          if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return;
          e.preventDefault();
          const keys = [
            e.ctrlKey ? "Ctrl" : null,
            e.metaKey ? "Meta" : null,
            e.altKey ? "Alt" : null,
            e.shiftKey ? "Shift" : null,
            e.key === " "
              ? "Space"
              : e.key.length === 1
                ? e.key.toUpperCase()
                : e.key,
          ].filter(Boolean);
          onValueChange(keys.join("+"));
          setRecording(false);
        }}
      >
        <Keyboard size={15} aria-hidden="true" />
        {recording ? "Press a shortcut…" : value}
      </Button>
      <span className="ui-sr-only" role="status">
        {recording
          ? "Press a shortcut. Escape cancels. Tab leaves the control."
          : `Shortcut: ${value}`}
      </span>
    </div>
  );
}
