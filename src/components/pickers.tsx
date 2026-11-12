import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Popover as RPopover, Slider as RSlider } from "radix-ui";
import { Calendar as CalendarIcon, Check, ChevronDown, ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { cx, useControllable, useFieldId } from "../lib/utils";
import { usePortalContainer } from "../lib/portal";

/* ---------- Combobox ---------- */

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  emptyText?: string;
  "aria-label"?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

/** Type to filter a list, pick with arrows + Enter. */
export function Combobox({ options, value, defaultValue = null, onValueChange, placeholder = "Search…", emptyText = "No matches", className, disabled, id, ...props }: ComboboxProps) {
  const [selected, setSelected] = useControllable<string | null>(value, defaultValue, onValueChange);
  const label = options.find((o) => o.value === selected)?.label ?? "";
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useFieldId();
  const fid = useFieldId(id);
  const container = usePortalContainer();
  const shown = useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const choose = (o: ComboboxOption) => {
    if (o.disabled) return;
    setSelected(o.value);
    setQuery(null);
    setOpen(false);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") (e.preventDefault(), setOpen(true), setActive((a) => Math.min(shown.length - 1, a + 1)));
    else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(0, a - 1)));
    else if (e.key === "Enter" && open && shown[active]) (e.preventDefault(), choose(shown[active]));
    else if (e.key === "Escape") (setOpen(false), setQuery(null));
  };
  return (
    <RPopover.Root open={open && !disabled} onOpenChange={setOpen}>
      <RPopover.Anchor asChild>
        <div className={cx("ui-input-wrap ui-combobox", className)}>
          <input
            id={fid}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && shown[active] ? `${listId}-${shown[active].value}` : undefined}
            aria-label={props["aria-label"]}
            className="ui-input"
            placeholder={placeholder}
            disabled={disabled}
            value={query ?? label}
            onChange={(e) => (setQuery(e.target.value), setActive(0), setOpen(true))}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onKeyDown={onKey}
          />
          {selected ? (
            <button type="button" className="ui-close ui-input-adorn" aria-label="Clear selection" onClick={() => (setSelected(null), setQuery(null))}>
              <X size={14} />
            </button>
          ) : (
            <span className="ui-input-adorn" aria-hidden="true"><ChevronDown size={15} /></span>
          )}
        </div>
      </RPopover.Anchor>
      <RPopover.Portal container={container}>
        <RPopover.Content
          className="ui-popover ui-listbox-pop"
          align="start"
          sideOffset={6}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if ((e.target as HTMLElement).closest?.(".ui-combobox")) e.preventDefault();
          }}
        >
          <ul role="listbox" id={listId} className="ui-listbox">
            {shown.length === 0 && <li className="ui-listbox-empty">{emptyText}</li>}
            {shown.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${o.value}`}
                role="option"
                aria-selected={o.value === selected}
                aria-disabled={o.disabled || undefined}
                className={cx("ui-menu-item", i === active && "is-active")}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
              >
                <span className="ui-menu-label">{o.label}</span>
                {o.hint && <span className="ui-menu-hint">{o.hint}</span>}
                {o.value === selected && <Check size={14} className="ui-menu-check" />}
              </li>
            ))}
          </ul>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}

/* ---------- TagInput ---------- */

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  "aria-label"?: string;
  className?: string;
}

/** Type and press Enter or comma to add tags; Backspace removes the last. */
export function TagInput({ value, defaultValue = [], onValueChange, placeholder = "Add tag", max, className, ...props }: TagInputProps) {
  const [tags, setTags] = useControllable(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const add = () => {
    const t = draft.trim().replace(/,$/, "");
    if (!t || tags.includes(t) || (max && tags.length >= max)) return setDraft("");
    setTags([...tags, t]);
    setDraft("");
  };
  return (
    <div className={cx("ui-input ui-tags", className)} onClick={() => input.current?.focus()}>
      {tags.map((t) => (
        <span key={t} className="ui-tag">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        ref={input}
        value={draft}
        aria-label={props["aria-label"] ?? placeholder}
        placeholder={tags.length ? "" : placeholder}
        onChange={(e) => (e.target.value.endsWith(",") ? (setDraft(e.target.value), setTimeout(add)) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.preventDefault(), add());
          if (e.key === "Backspace" && !draft && tags.length) setTags(tags.slice(0, -1));
        }}
        onBlur={add}
      />
    </div>
  );
}

/* ---------- RangeSlider ---------- */

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: ReactNode;
  formatValue?: (n: number) => string;
  className?: string;
}

/** Two-thumb slider for a min–max range (price, playtime). */
export function RangeSlider({ value, defaultValue = [20, 80], onValueChange, min = 0, max = 100, step = 1, label, formatValue = String, className }: RangeSliderProps) {
  const [range, setRange] = useControllable(value, defaultValue, onValueChange);
  return (
    <div className={cx("ui-slider-field", className)}>
      <div className="ui-progress-head">
        {label && <span className="ui-label">{label}</span>}
        <span className="ui-progress-value">{formatValue(range[0])} – {formatValue(range[1])}</span>
      </div>
      <RSlider.Root className="ui-slider" value={range} min={min} max={max} step={step} minStepsBetweenThumbs={1} onValueChange={(v) => setRange([v[0], v[1]])}>
        <RSlider.Track className="ui-slider-track"><RSlider.Range className="ui-slider-range" /></RSlider.Track>
        <RSlider.Thumb className="ui-slider-thumb" aria-label="Minimum" />
        <RSlider.Thumb className="ui-slider-thumb" aria-label="Maximum" />
      </RSlider.Root>
    </div>
  );
}

/* ---------- Rating ---------- */

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  size?: number;
  label?: string;
  className?: string;
}

/** Star rating as a radio group; read-only mode renders an image with a label. */
export function Rating({ value, defaultValue = 0, onValueChange, max = 5, readOnly, size = 18, label = "Rating", className }: RatingProps) {
  const [rating, setRating] = useControllable(value, defaultValue, onValueChange);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? rating;
  const name = useFieldId();
  if (readOnly)
    return (
      <span className={cx("ui-rating is-readonly", className)} role="img" aria-label={`${label}: ${rating} out of ${max}`}>
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} size={size} className={cx(i < Math.round(rating) && "is-on")} aria-hidden="true" />
        ))}
      </span>
    );
  return (
    <div role="radiogroup" aria-label={label} className={cx("ui-rating", className)} onMouseLeave={() => setHover(null)}>
      {Array.from({ length: max }, (_, i) => (
        <label key={i} className="ui-rating-star" onMouseEnter={() => setHover(i + 1)}>
          <input type="radio" name={name} value={i + 1} checked={rating === i + 1} onChange={() => setRating(i + 1)} aria-label={`${i + 1} star${i ? "s" : ""}`} />
          <Star size={size} className={cx(i < shown && "is-on")} aria-hidden="true" />
        </label>
      ))}
    </div>
  );
}

/* ---------- Calendar / DatePicker ---------- */

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export interface CalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  locale?: string;
  className?: string;
}

/** Month grid with arrow-key navigation (PageUp/PageDown change month). */
export function Calendar({ value, defaultValue = null, onValueChange, min, max, weekStartsOn = 1, locale, className }: CalendarProps) {
  const [selected, setSelected] = useControllable<Date | null>(value, defaultValue, onValueChange as (d: Date | null) => void);
  const [focus, setFocus] = useState<Date>(() => selected ?? new Date());
  const grid = useRef<HTMLDivElement>(null);
  const today = new Date();
  const first = new Date(focus.getFullYear(), focus.getMonth(), 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(start, i).toLocaleDateString(locale, { weekday: "narrow" }));
  const outOfRange = (d: Date) => (min && d < addDays(min, 0) && !sameDay(d, min)) || (max && d > max && !sameDay(d, max));
  const move = (d: Date) => {
    setFocus(d);
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>("[tabindex='0']")?.focus());
  };
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (map[e.key] !== undefined) (e.preventDefault(), move(addDays(focus, map[e.key])));
    if (e.key === "PageUp") (e.preventDefault(), move(new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate())));
    if (e.key === "PageDown") (e.preventDefault(), move(new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate())));
  };
  return (
    <div className={cx("ui-calendar", className)}>
      <div className="ui-calendar-head">
        <button type="button" className="ui-close" aria-label="Previous month" onClick={() => setFocus(new Date(focus.getFullYear(), focus.getMonth() - 1, 1))}>
          <ChevronLeft size={16} />
        </button>
        <span className="ui-calendar-title" aria-live="polite">{focus.toLocaleDateString(locale, { month: "long", year: "numeric" })}</span>
        <button type="button" className="ui-close" aria-label="Next month" onClick={() => setFocus(new Date(focus.getFullYear(), focus.getMonth() + 1, 1))}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div role="grid" className="ui-calendar-grid" ref={grid} onKeyDown={onKey}>
        <div role="row" className="ui-calendar-row">
          {weekdays.map((w, i) => <span key={i} role="columnheader" className="ui-calendar-weekday">{w}</span>)}
        </div>
        {Array.from({ length: 6 }, (_, r) => (
          <div role="row" key={r} className="ui-calendar-row">
            {days.slice(r * 7, r * 7 + 7).map((d) => {
              const isSel = selected && sameDay(d, selected);
              return (
                <span role="gridcell" key={d.toISOString()} aria-selected={!!isSel}>
                  <button
                    type="button"
                    tabIndex={sameDay(d, focus) ? 0 : -1}
                    disabled={!!outOfRange(d)}
                    aria-label={d.toLocaleDateString(locale, { dateStyle: "full" })}
                    className={cx("ui-day", d.getMonth() !== focus.getMonth() && "is-outside", sameDay(d, today) && "is-today", isSel && "is-selected")}
                    onClick={() => (setSelected(d), setFocus(d))}
                  >
                    {d.getDate()}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface DatePickerProps extends Omit<CalendarProps, "className"> {
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

/** A field that opens a Calendar in a popover. */
export function DatePicker({ value, defaultValue = null, onValueChange, placeholder = "Pick a date", locale, className, ...rest }: DatePickerProps) {
  const [date, setDate] = useControllable<Date | null>(value, defaultValue, onValueChange as (d: Date | null) => void);
  const [open, setOpen] = useState(false);
  const container = usePortalContainer();
  return (
    <RPopover.Root open={open} onOpenChange={setOpen}>
      <RPopover.Trigger asChild>
        <button type="button" className={cx("ui-input ui-datepicker", className)} aria-label={rest["aria-label"] ?? placeholder}>
          <CalendarIcon size={15} aria-hidden="true" />
          <span className={cx(!date && "ui-placeholder")}>{date ? date.toLocaleDateString(locale, { dateStyle: "medium" }) : placeholder}</span>
        </button>
      </RPopover.Trigger>
      <RPopover.Portal container={container}>
        <RPopover.Content className="ui-popover" align="start" sideOffset={6}>
          <Calendar value={date} onValueChange={(d) => (setDate(d), setOpen(false))} locale={locale} {...rest} />
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}
